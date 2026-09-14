import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "../types/common";
import {
  LoginCommand,
  LoginResponseDto,
  RegisterCommand,
  UpdateMyProfileDto,
  ChangePasswordDto,
} from "../types/auth";
import { UserDto } from "../types/user";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/useAuthStore";
import { useRouter } from "next/navigation";

export const PROFILE_QUERY_KEY = ["my-profile"];

export const useRegister = () => {
  return useMutation<ApiResponse<null>, Error, RegisterCommand>({
    mutationFn: (data: RegisterCommand) => authService.register(data),
  });
};

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<ApiResponse<LoginResponseDto>, Error, LoginCommand>({
    mutationFn: (data: LoginCommand) => authService.login(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setAuth(response.data);
      }
    },
  });
};

export const useLogout = () => {
  const logoutStore = useAuthStore((state) => state.logout);
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      logoutStore();
      queryClient.clear();
      router.push("/login");
    },
  });
};

// ================= HOOKS CHO MY PROFILE =================

// Hook lấy thông tin Profile cá nhân
export const useGetMyProfile = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => authService.getMyProfile(),
  });
};

// Hook cập nhật Profile cá nhân
export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<UserDto>, Error, UpdateMyProfileDto>({
    mutationFn: (data: UpdateMyProfileDto) => authService.updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
};

// Hook đổi mật khẩu
export const useChangePassword = () => {
  return useMutation<ApiResponse<boolean>, Error, ChangePasswordDto>({
    mutationFn: (data: ChangePasswordDto) => authService.changePassword(data),
  });
};
