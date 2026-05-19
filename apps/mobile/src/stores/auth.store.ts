import { create } from 'zustand';

import { queryClient } from '@/lib/queryClient';
import { authApi } from '@/services/api';
import { setUnauthorizedHandler } from '@/services/http';
import { clearSession, loadSession, saveSession } from '@/services/session';
import type { ApiUserRole, RegisterRequest, UserResponse } from '@/types/api';

export type SessionStatus = 'idle' | 'hydrating' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: UserResponse | null;
  status: SessionStatus;
  isAuthenticated: boolean;
  activeRole: ApiUserRole;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<UserResponse>;
  register: (payload: RegisterRequest) => Promise<UserResponse>;
  logout: () => Promise<void>;
  switchRole: (role: ApiUserRole) => void;
}

const ROLE_PRIORITY: ApiUserRole[] = ['CUSTOMER', 'SELLER', 'ADMIN', 'SUPPORT'];

const pickActiveRole = (roles: ApiUserRole[]): ApiUserRole =>
  ROLE_PRIORITY.find((role) => roles.includes(role)) ?? 'CUSTOMER';

const authenticatedState = (user: UserResponse) => ({
  user,
  status: 'authenticated' as SessionStatus,
  isAuthenticated: true,
  activeRole: pickActiveRole(user.roles),
});

const guestState = {
  user: null,
  status: 'unauthenticated' as SessionStatus,
  isAuthenticated: false,
  activeRole: 'CUSTOMER' as ApiUserRole,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...guestState,
  status: 'idle',

  hydrate: async () => {
    set({ status: 'hydrating' });
    const tokens = await loadSession();
    if (!tokens) {
      set(guestState);
      return;
    }
    try {
      const user = await authApi.me();
      set(authenticatedState(user));
    } catch {
      await clearSession();
      set(guestState);
    }
  },

  login: async (email, password) => {
    const auth = await authApi.login({ email, password });
    await saveSession({ accessToken: auth.accessToken, refreshToken: auth.refreshToken });
    set(authenticatedState(auth.user));
    return auth.user;
  },

  register: async (payload) => {
    const auth = await authApi.register(payload);
    await saveSession({ accessToken: auth.accessToken, refreshToken: auth.refreshToken });
    set(authenticatedState(auth.user));
    return auth.user;
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // logout é best-effort: a sessão local é limpa de qualquer forma.
    }
    await clearSession();
    queryClient.clear();
    set(guestState);
  },

  switchRole: (role) => {
    if (get().user?.roles.includes(role)) {
      set({ activeRole: role });
    }
  },
}));

setUnauthorizedHandler(() => {
  queryClient.clear();
  useAuthStore.setState(guestState);
});
