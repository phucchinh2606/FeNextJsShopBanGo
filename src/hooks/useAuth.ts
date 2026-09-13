import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "../types/common";
import { LoginCommand, LoginResponseDto, RegisterCommand } from "../types/auth";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/useAuthStore";
import { useRouter } from "next/navigation";

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
      // Dù API trả về thành công hay lỗi (ví dụ token đã hết hạn trước đó)
      // thì phía Client vẫn dọn dẹp toàn bộ dữ liệu phiên đăng nhập.
      logoutStore();
      queryClient.clear(); // Xóa sạch dữ liệu cache trong React Query
      router.push("/login");
    },
  });
};
