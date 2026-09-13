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
  role: string;
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
