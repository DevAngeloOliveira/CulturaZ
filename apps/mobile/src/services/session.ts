import * as SecureStore from 'expo-secure-store';

const ACCESS_KEY = 'culturaz.accessToken';
const REFRESH_KEY = 'culturaz.refreshToken';

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

let accessToken: string | null = null;
let refreshToken: string | null = null;

export const getAccessToken = (): string | null => accessToken;

export const getRefreshToken = (): string | null => refreshToken;

export const loadSession = async (): Promise<SessionTokens | null> => {
  const [access, refresh] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_KEY),
    SecureStore.getItemAsync(REFRESH_KEY),
  ]);
  if (access && refresh) {
    accessToken = access;
    refreshToken = refresh;
    return { accessToken: access, refreshToken: refresh };
  }
  accessToken = null;
  refreshToken = null;
  return null;
};

export const saveSession = async (tokens: SessionTokens): Promise<void> => {
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_KEY, tokens.accessToken),
    SecureStore.setItemAsync(REFRESH_KEY, tokens.refreshToken),
  ]);
};

export const clearSession = async (): Promise<void> => {
  accessToken = null;
  refreshToken = null;
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_KEY),
    SecureStore.deleteItemAsync(REFRESH_KEY),
  ]);
};
