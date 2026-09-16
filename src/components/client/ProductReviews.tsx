"use client";

import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { useCreateReview, useGetProductReviews } from "@/src/hooks/useReview";

interface ProductReviewsProps {
  productId: string;
}

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const { data: reviewsData, isLoading } = useGetProductReviews(productId);
  const { mutate: createReview, isPending } = useCreateReview();

  const reviews = reviewsData?.data || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    createReview(
      { productId, rating, comment },
      {
        onSuccess: () => {
          setComment("");
          setRating(5);
        },
      },
    );
  };

  return (
    <div className="space-y-6 sm:space-y-10">
      <h2 className="text-lg sm:text-xl font-serif font-bold text-gray-900 border-b pb-3 sm:pb-4">
        Đánh Giá Sản Phẩm
      </h2>

      {/* Form Đăng Đánh Giá */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 p-4 sm:p-6 rounded-2xl space-y-3 sm:space-y-4"
      >
        <h3 className="text-xs sm:text-sm font-semibold text-gray-800">
          Viết đánh giá của bạn
        </h3>

        {/* Chọn số sao */}
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5 sm:p-1 focus:outline-none"
            >
              <Star
                className={`w-5 h-5 sm:w-6 sm:h-6 transition ${
                  star <= (hoverRating || rating)
                    ? "text-amber-500 fill-amber-500"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
          <span className="text-[11px] sm:text-xs font-semibold text-gray-600 ml-1 sm:ml-2">
            ({hoverRating || rating}/5 sao)
          </span>
        </div>

        {/* Nhập bình luận */}
        <div>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ cảm nhận của bạn về chất lượng gỗ..."
            className="w-full p-2.5 sm:p-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-medium text-xs rounded-xl shadow transition disabled:opacity-50"
        >
          {isPending ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </form>

      {/* Danh Sách Đánh Giá */}
      <div className="space-y-3 sm:space-y-4">
        {isLoading ? (
          <p className="text-xs text-gray-500">Đang tải đánh giá...</p>
        ) : reviews.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-500 text-xs sm:text-sm bg-white rounded-2xl border border-dashed border-gray-200">
            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-gray-300 mb-2" />
            <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
          </div>
        ) : (
          reviews.map((rev: any) => (
            <div
              key={rev.reviewId || rev.id}
              className="p-3.5 sm:p-4 bg-white rounded-xl border border-gray-100 shadow-sm space-y-1.5 sm:space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-gray-800">
                  {rev.userName || rev.authorName || "Khách hàng"}
                </span>
                <span className="text-[10px] sm:text-[11px] text-gray-400">
                  {new Date(rev.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>

              <div className="flex items-center space-x-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                      star <= rev.rating
                        ? "text-amber-500 fill-amber-500"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-gray-700 leading-relaxed">
                {rev.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
