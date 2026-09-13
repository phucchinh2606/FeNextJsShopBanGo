import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/userService";
import { CreateUserCommand, UpdateUserCommand } from "../types";

export const USER_QUERY_KEY = ["users"];

// Hook lấy danh sách tất cả người dùng
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: () => userService.getAllUsers(),
  });
};

// Hook lấy thông tin người dùng theo ID
export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: [...USER_QUERY_KEY, id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
};

// Hook tạo người dùng mới
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserCommand) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
};

// Hook cập nhật thông tin người dùng
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserCommand }) =>
      userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
};

// Hook xóa người dùng
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
};
