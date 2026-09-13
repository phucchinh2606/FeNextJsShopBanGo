import axiosClient from "./axiosClient";
import { UserDto, CreateUserCommand, UpdateUserCommand } from "../types/user";
import { ApiResponse } from "../types";

export const userService = {
  // GET: /api/Users (Lấy tất cả danh sách người dùng - Admin)
  getAllUsers: async (): Promise<ApiResponse<UserDto[]>> => {
    return await axiosClient.get("/Users");
  },

  // GET: /api/Users/{id} (Lấy chi tiết người dùng theo ID)
  getUserById: async (id: string): Promise<ApiResponse<UserDto>> => {
    return await axiosClient.get(`/Users/${id}`);
  },

  // POST: /api/Users (Tạo mới người dùng - Admin)
  createUser: async (data: CreateUserCommand): Promise<ApiResponse<string>> => {
    return await axiosClient.post("/Users", data);
  },

  // PUT: /api/Users/{id} (Cập nhật thông tin người dùng - Admin)
  updateUser: async (
    id: string,
    data: UpdateUserCommand,
  ): Promise<ApiResponse<boolean>> => {
    return await axiosClient.put(`/Users/${id}`, data);
  },

  // DELETE: /api/Users/{id} (Xóa người dùng - Admin)
  deleteUser: async (id: string): Promise<ApiResponse<boolean>> => {
    return await axiosClient.delete(`/Users/${id}`);
  },
};
