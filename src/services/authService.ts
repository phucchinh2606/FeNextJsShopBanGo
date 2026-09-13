import {
  LoginCommand,
  LoginResponseDto,
  RefreshTokenCommand,
  RefreshTokenResponseDto,
  RegisterCommand,
} from "../types/auth";
import { ApiResponse } from "../types/common";
import axiosClient from "./axiosClient";

export const authService = {
  register: async (data: RegisterCommand): Promise<ApiResponse<null>> => {
    return await axiosClient.post("/auth/register", data);
  },

  login: async (data: LoginCommand): Promise<ApiResponse<LoginResponseDto>> => {
    return await axiosClient.post("/auth/login", data);
  },

  refreshToken: async (
    data: RefreshTokenCommand,
  ): Promise<ApiResponse<RefreshTokenResponseDto>> => {
    return await axiosClient.post("/auth/refresh-token", data);
  },

  logout: async (): Promise<ApiResponse<null>> => {
    return await axiosClient.post("/Auth/logout");
  },
};
