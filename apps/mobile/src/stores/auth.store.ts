import { create } from 'zustand';

import { mockUser } from '@/mocks/user.mock';
import type { User, UserRole } from '@/types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  activeRole: UserRole;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  activeRole: 'CUSTOMER',
  login: async (email: string) => {
    await new Promise<void>((resolve) => setTimeout(resolve, 600));
    set({
      user: { ...mockUser, email: email || mockUser.email },
      isAuthenticated: true,
      activeRole: 'CUSTOMER',
    });
  },
  logout: () => set({ user: null, isAuthenticated: false, activeRole: 'CUSTOMER' }),
  switchRole: (role) => set({ activeRole: role }),
}));
