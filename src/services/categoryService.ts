import {
  ApiResponse,
  CategoryDto,
  CreateCategoryCommand,
  UpdateCategoryCommand,
} from "../types";
import axiosClient from "./axiosClient";

export const categoryService = {
  // GET: /api/Categories
  getAllCategories: async (): Promise<ApiResponse<CategoryDto[]>> => {
    return await axiosClient.get("/Categories");
  },

  // GET: /api/Categories/{id}
  getCategoryById: async (id: string): Promise<ApiResponse<CategoryDto>> => {
    return await axiosClient.get(`/Categories/${id}`);
  },

  // POST: /api/Categories
  createCategory: async (
    data: CreateCategoryCommand,
  ): Promise<ApiResponse<string>> => {
    return await axiosClient.post("/Categories", data);
  },

  // PUT: /api/Categories/{id}
  updateCategory: async (
    id: string,
    data: UpdateCategoryCommand,
  ): Promise<ApiResponse<boolean>> => {
    return await axiosClient.put(`/Categories/${id}`, data);
  },

  // DELETE: /api/Categories/{id}
  deleteCategory: async (id: string): Promise<ApiResponse<boolean>> => {
    return await axiosClient.delete(`/Categories/${id}`);
  },
};
