import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { AuthState } from "../types/auth";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setAuth: (data) => {
        const { accessToken, refreshToken, ...userInfo } = data;

        // Lưu Cookie toàn hệ thống với path: '/'
        Cookies.set("accessToken", accessToken, { expires: 7, path: "/" });
        Cookies.set("refreshToken", refreshToken, { expires: 7, path: "/" });

        set({
          user: userInfo,
          isAuthenticated: true,
        });
      },

      logout: () => {
        Cookies.remove("accessToken", { path: "/" });
        Cookies.remove("refreshToken", { path: "/" });
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage", // Lưu state người dùng vào localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
