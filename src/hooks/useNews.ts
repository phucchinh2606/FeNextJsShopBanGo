import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateNewsCommand,
  GetAllNewsQuery,
  UpdateNewsCommand,
} from "../types";
import { newsService } from "../services/newsService";

export const NEWS_QUERY_KEY = ["news"];

// Hook lấy danh sách tin tức (có phân trang/lọc)
export const useGetNewsList = (params?: GetAllNewsQuery) => {
  return useQuery({
    queryKey: [...NEWS_QUERY_KEY, params],
    queryFn: () => newsService.getAllNews(params),
  });
};

// Hook lấy chi tiết tin tức theo ID
export const useGetNewsById = (id: string) => {
  return useQuery({
    queryKey: [...NEWS_QUERY_KEY, id],
    queryFn: () => newsService.getNewsById(id),
    enabled: !!id,
  });
};

// Hook tạo bài viết mới (Admin)
export const useCreateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNewsCommand) => newsService.createNews(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY });
    },
  });
};

// Hook cập nhật bài viết (Admin)
export const useUpdateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNewsCommand }) =>
      newsService.updateNews(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY });
    },
  });
};

// Hook xóa bài viết (Admin)
export const useDeleteNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => newsService.deleteNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY });
    },
  });
};
