import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PRODUCT_QUERY_KEY } from "./useProduct";
import { reviewService } from "../services/reviewService";
import { CreateReviewCommand } from "../types";

export const REVIEW_QUERY_KEY = ["reviews"];

// Hook lấy danh sách đánh giá theo productId
export const useGetProductReviews = (productId: string) => {
  return useQuery({
    queryKey: [...REVIEW_QUERY_KEY, productId],
    queryFn: () => reviewService.getProductReviews(productId),
    enabled: !!productId,
  });
};

// Hook tạo mới đánh giá
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewCommand) => reviewService.createReview(data),
    onSuccess: (_, variables) => {
      // Làm mới danh sách review của sản phẩm đó
      queryClient.invalidateQueries({
        queryKey: [...REVIEW_QUERY_KEY, variables.productId],
      });
      // Làm mới dữ liệu sản phẩm (để cập nhật lại điểm đánh giá trung bình / số lượt đánh giá nếu có)
      queryClient.invalidateQueries({
        queryKey: [...PRODUCT_QUERY_KEY, variables.productId],
      });
    },
  });
};
