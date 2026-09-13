import { ApiResponse, CreateReviewCommand, ReviewDto } from "../types";
import axiosClient from "./axiosClient";

export const reviewService = {
  // GET: /api/Review/product/{productId} (Lấy danh sách đánh giá của sản phẩm)
  getProductReviews: async (
    productId: string,
  ): Promise<ApiResponse<ReviewDto[]>> => {
    return await axiosClient.get(`/Review/product/${productId}`);
  },

  // POST: /api/Review (Đăng đánh giá mới dạng multipart/form-data)
  createReview: async (
    data: CreateReviewCommand,
  ): Promise<ApiResponse<ReviewDto>> => {
    const formData = new FormData();
    formData.append("productId", data.productId);
    formData.append("rating", data.rating.toString());
    formData.append("comment", data.comment);

    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    return await axiosClient.post("/Review", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
