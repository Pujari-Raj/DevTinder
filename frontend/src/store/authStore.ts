import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  // id: string;
  email: string;
  name: string,
  // will Add other user fields as per need
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),
        localStorage.removeItem("devtinder_user_details");
      },

      setLoading: (isLoading) => set({ isLoading }),

      initializeAuth: () => {
        // This will be called on app mount to restore auth state from localStorage
        // Token is in HTTP-only cookie, no need to restore it
        set({ isLoading: false });
      },
    }),
    {
      name: "devtinder_user_details", // localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
