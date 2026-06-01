import { ApiError } from '@/services/http';

const CODE_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'E-mail ou senha incorretos.',
  USER_BLOCKED: 'Esta conta está bloqueada. Fale com o suporte.',
  EMAIL_ALREADY_EXISTS: 'Já existe uma conta com este e-mail.',
  INVALID_TOKEN: 'Sua sessão expirou. Entre novamente.',
  VALIDATION_ERROR: 'Confira os dados informados e tente de novo.',
  RESOURCE_NOT_FOUND: 'Não encontramos o que você procura.',
  FORBIDDEN: 'Você não tem permissão para esta ação.',
};

const NETWORK_FALLBACK = 'Sem conexão com o servidor. Verifique sua internet.';
const GENERIC_FALLBACK = 'Algo deu errado. Tente novamente.';

export const getErrorMessage = (error: unknown, fallback = GENERIC_FALLBACK): string => {
  if (error instanceof ApiError) {
    return CODE_MESSAGES[error.code] ?? error.message ?? fallback;
  }
  if (error instanceof TypeError) {
    return NETWORK_FALLBACK;
  }
  if (error instanceof Error && error.name === 'AbortError') {
    return 'O servidor demorou para responder. Verifique sua conexão.';
  }
  return fallback;
};

export const getErrorCode = (error: unknown): string | null =>
  error instanceof ApiError ? error.code : null;
