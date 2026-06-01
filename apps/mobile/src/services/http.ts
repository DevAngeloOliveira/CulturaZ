import { clearSession, getAccessToken, getRefreshToken, saveSession } from './session';

const baseUrl = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');

const DEFAULT_TIMEOUT_MS = 15000;

export interface ApiErrorBody {
  code: string;
  message: string;
  path?: string;
  timestamp?: string;
  details?: unknown;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, body: Partial<ApiErrorBody> | undefined, fallback: string) {
    super(body?.message ?? fallback);
    this.name = 'ApiError';
    this.status = status;
    this.code = body?.code ?? `HTTP_${status}`;
    this.details = body?.details;
  }
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type QueryValue = string | number | boolean | undefined | null;

export interface RequestOptions {
  query?: Record<string, QueryValue>;
  body?: unknown;
  auth?: boolean;
  signal?: AbortSignal;
}

let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: (() => void) | null): void => {
  onUnauthorized = handler;
};

let refreshInFlight: Promise<boolean> | null = null;

const performRefresh = async (): Promise<boolean> => {
  const token = getRefreshToken();
  if (!token) return false;
  try {
    const response = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ refreshToken: token }),
    });
    if (!response.ok) return false;
    const data = (await response.json()) as { accessToken: string; refreshToken: string };
    await saveSession({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    return true;
  } catch {
    return false;
  }
};

const refreshOnce = (): Promise<boolean> => {
  if (!refreshInFlight) {
    refreshInFlight = performRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
};

export const forceRefreshSession = (): Promise<boolean> => refreshOnce();

const buildUrl = (path: string, query?: RequestOptions['query']): string => {
  if (!query) return `${baseUrl}${path}`;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `${baseUrl}${path}?${qs}` : `${baseUrl}${path}`;
};

const parseBody = async (response: Response): Promise<unknown> => {
  if (response.status === 204) return undefined;
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json().catch(() => undefined);
  }
  const text = await response.text().catch(() => undefined);
  return text || undefined;
};

const execute = (
  method: Method,
  path: string,
  options: RequestOptions,
  withAuth: boolean,
): Promise<Response> => {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';
  if (withAuth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return fetch(buildUrl(path, options.query), {
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });
};

export const request = async <T>(
  method: Method,
  path: string,
  options: RequestOptions = {},
): Promise<T> => {
  const useAuth = options.auth !== false;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let effectiveOptions = options;
  if (!options.signal) {
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
    effectiveOptions = { ...options, signal: controller.signal };
  }

  try {
    let response = await execute(method, path, effectiveOptions, useAuth);

    if (response.status === 401 && useAuth && getRefreshToken()) {
      const refreshed = await refreshOnce();
      if (refreshed) {
        response = await execute(method, path, effectiveOptions, true);
      }
    }

    const payload = await parseBody(response);

    if (!response.ok) {
      if (response.status === 401 && useAuth) {
        await clearSession();
        onUnauthorized?.();
      }
      throw new ApiError(
        response.status,
        payload as Partial<ApiErrorBody> | undefined,
        `Falha na requisição (${response.status}).`,
      );
    }

    return payload as T;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

export const httpClient = {
  get: <T>(path: string, options?: RequestOptions): Promise<T> => request<T>('GET', path, options),
  post: <T>(path: string, options?: RequestOptions): Promise<T> =>
    request<T>('POST', path, options),
  put: <T>(path: string, options?: RequestOptions): Promise<T> => request<T>('PUT', path, options),
  patch: <T>(path: string, options?: RequestOptions): Promise<T> =>
    request<T>('PATCH', path, options),
  delete: <T>(path: string, options?: RequestOptions): Promise<T> =>
    request<T>('DELETE', path, options),
};
