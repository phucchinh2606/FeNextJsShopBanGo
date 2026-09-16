import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { AuthState } from "../types/auth";

export const normalizeRole = (role: unknown): string => {
  if (typeof role === "string") {
    const normalized = role.trim();
    if (!normalized) return "Customer";
    const lowered = normalized.toLowerCase();
    if (lowered === "admin" || lowered === "1") return "Admin";
    if (lowered === "customer" || lowered === "0") return "Customer";
    return (
      normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase()
    );
  }

  if (typeof role === "number") {
    return role === 1 ? "Admin" : "Customer";
  }

  return "Customer";
};

export const isAdminRole = (role: unknown): boolean =>
  normalizeRole(role) === "Admin";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setAuth: (data) => {
        const { accessToken, refreshToken, ...userInfo } = data;
        const normalizedUser = {
          ...userInfo,
          role: normalizeRole(userInfo.role),
        };

        // Lưu Cookie toàn hệ thống với path: '/'
        Cookies.set("accessToken", accessToken, { expires: 7, path: "/" });
        Cookies.set("refreshToken", refreshToken, { expires: 7, path: "/" });

        set({
          user: normalizedUser,
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
