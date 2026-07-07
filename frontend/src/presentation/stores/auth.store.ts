import { create } from "zustand";
import type { User } from "@/core/domain/entities/user.entity";

interface AuthState {
  user: User | null;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setInitialized: (value: boolean) => void;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isInitialized: false,

  setUser: (user) => set({ user }),

  setInitialized: (isInitialized) => set({ isInitialized }),

  isAdmin: () => get().user?.isAdmin() ?? false,

  isAuthenticated: () => get().user !== null,
}));
