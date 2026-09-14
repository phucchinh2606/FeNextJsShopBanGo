import {
  LoginCommand,
  LoginResponseDto,
  RefreshTokenCommand,
  RefreshTokenResponseDto,
  RegisterCommand,
  UpdateMyProfileDto,
  ChangePasswordDto,
} from "../types/auth";
import { UserDto } from "../types/user";
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

  // GET: /api/Auth/me (Lấy thông tin cá nhân)
  getMyProfile: async (): Promise<ApiResponse<UserDto>> => {
    return await axiosClient.get("/Auth/me");
  },

  // PUT: /api/Auth/me (Cập nhật thông tin cá nhân)
  updateMyProfile: async (
    data: UpdateMyProfileDto,
  ): Promise<ApiResponse<UserDto>> => {
    return await axiosClient.put("/Auth/me", data);
  },

  // PUT: /api/Auth/change-password (Đổi mật khẩu)
  changePassword: async (
    data: ChangePasswordDto,
  ): Promise<ApiResponse<boolean>> => {
    return await axiosClient.put("/Auth/change-password", data);
  },
};
