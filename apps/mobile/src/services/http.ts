const baseUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

export interface HttpError extends Error {
  status: number;
  body?: unknown;
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export const http = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { body, headers, ...rest } = options;
  const response = await fetch(`${baseUrl}${path}`, {
    ...rest,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const payload: unknown = contentType.includes('application/json')
    ? await response.json().catch(() => undefined)
    : await response.text().catch(() => undefined);

  if (!response.ok) {
    const error: HttpError = Object.assign(new Error(`HTTP ${response.status} em ${path}`), {
      status: response.status,
      body: payload,
    });
    throw error;
  }

  return payload as T;
};
