import { create } from "zustand";
import Cookies from "js-cookie";
import { AuthState } from "../types/auth";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setAuth: (data) => {
    const { accessToken, refreshToken, ...userInfo } = data;

    Cookies.set("accessToken", accessToken, { expires: 1 / 96 });
    Cookies.set("refreshToken", refreshToken, { expires: 7 });

    set({
      user: userInfo,
      isAuthenticated: true,
    });
  },

  logout: () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
