import {
  ApiResponse,
  CreateNewsCommand,
  GetAllNewsQuery,
  NewsDto,
  PagedResult,
  UpdateNewsCommand,
} from "../types";
import axiosClient from "./axiosClient";

export const newsService = {
  // GET: /api/News (Lấy danh sách bài viết tin tức)
  getAllNews: async (
    params?: GetAllNewsQuery,
  ): Promise<ApiResponse<PagedResult<NewsDto>>> => {
    return await axiosClient.get("/News", { params });
  },

  // GET: /api/News/{id} (Lấy chi tiết bài viết theo ID)
  getNewsById: async (id: string): Promise<ApiResponse<NewsDto>> => {
    return await axiosClient.get(`/News/${id}`);
  },

  // POST: /api/News (Tạo bài viết mới - FormData)
  createNews: async (data: CreateNewsCommand): Promise<ApiResponse<string>> => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("summary", data.summary);
    formData.append("content", data.content);
    formData.append("authorId", data.authorId);

    if (data.status !== undefined) {
      formData.append("status", data.status.toString());
    }

    if (data.image) {
      formData.append("image", data.image);
    }

    return await axiosClient.post("/News", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // PUT: /api/News/{id} (Cập nhật bài viết - FormData)
  updateNews: async (
    id: string,
    data: UpdateNewsCommand,
  ): Promise<ApiResponse<boolean>> => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("summary", data.summary);
    formData.append("content", data.content);
    formData.append("authorId", data.authorId);
    formData.append("status", data.status.toString());

    if (data.image) {
      formData.append("image", data.image);
    }

    return await axiosClient.put(`/News/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // DELETE: /api/News/{id} (Xóa bài viết)
  deleteNews: async (id: string): Promise<ApiResponse<boolean>> => {
    return await axiosClient.delete(`/News/${id}`);
  },
};
