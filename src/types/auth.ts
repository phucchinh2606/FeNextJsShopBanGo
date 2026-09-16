import { UserRole } from "./user";

export interface RegisterCommand {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
}

export interface LoginCommand {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  email: string;
  fullName: string;
  role: string | number;
}

export interface AuthState {
  user: Omit<LoginResponseDto, "accessToken" | "refreshToken"> | null;
  isAuthenticated: boolean;
  setAuth: (data: LoginResponseDto) => void;
  logout: () => void;
}

export interface RefreshTokenCommand {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;
}

// ================= BỔ SUNG CHO MY PROFILE =================

export interface UpdateMyProfileDto {
  fullName: string;
  phoneNumber: string;
  address: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
