"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  ShieldCheck,
  Truck,
  RefreshCw,
  Plus,
  Minus,
  Star,
  Upload,
  UserCheck,
  CheckCircle2,
  Package,
} from "lucide-react";
import { useGetProductById, useGetProducts } from "@/src/hooks/useProduct";
import { useCreateReview, useGetProductReviews } from "@/src/hooks/useReview";
import { useAddToCart } from "@/src/hooks/useCart";
import { ProductStatus } from "@/src/types";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;

  // States
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  // Form Review States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [previewImageUrls, setPreviewImageUrls] = useState<string[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // API Hooks
  const { data: productResponse, isLoading: isProductLoading } =
    useGetProductById(productId);
  const { data: reviewsResponse, isLoading: isReviewsLoading } =
    useGetProductReviews(productId);
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();
  const { mutate: createReview, isPending: isSubmittingReview } =
    useCreateReview();

  const product = productResponse?.data;
  const reviews = reviewsResponse?.data || [];

  // 1. Lấy danh sách sản phẩm cùng danh mục gốc
  const { data: relatedProductsResponse, isLoading: isRelatedLoading } =
    useGetProducts({
      categoryId: product?.categoryId,
      pageSize: 8,
      pageNumber: 1,
    });

  // 2. Lấy danh sách sản phẩm chung phòng trường hợp không có sản phẩm cùng danh mục
  const { data: fallbackProductsResponse } = useGetProducts({
    pageSize: 8,
    pageNumber: 1,
  });

  // Lọc sản phẩm hiện tại khỏi gợi ý
  let relatedProducts = (relatedProductsResponse?.data?.items || []).filter(
    (item) => item.productId !== productId,
  );

  // Nếu không có sản phẩm cùng danh mục, tự động dùng danh sách sản phẩm mới nhất làm gợi ý
  if (relatedProducts.length === 0) {
    relatedProducts = (fallbackProductsResponse?.data?.items || []).filter(
      (item) => item.productId !== productId,
    );
  }

  // Tính điểm đánh giá trung bình
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "5.0";

  // Tổng hợp tất cả ảnh
  const allProductImages = product
    ? [product.imageUrl, ...(product.subImageUrls || [])].filter(Boolean)
    : [];

  const mainImageUrl =
    selectedImage || product?.imageUrl || "/placeholder-wood.jpg";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setReviewImages((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewImageUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveReviewImage = (index: number) => {
    setReviewImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    createReview(
      {
        productId,
        rating,
        comment,
        images: reviewImages,
      },
      {
        onSuccess: () => {
          setComment("");
          setRating(5);
          setReviewImages([]);
          setPreviewImageUrls([]);
          setSubmitSuccess(true);
          setTimeout(() => setSubmitSuccess(false), 4000);
        },
      },
    );
  };

  if (isProductLoading) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 py-16">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-gray-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Sản phẩm không tồn tại hoặc đã bị xóa.</p>
      </div>
    );
  }

  const isOutOfStock =
    product.status === ProductStatus.OutOfStock || product.stockQuantity <= 0;

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Chi Tiết Sản Phẩm & Gallery */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
            <Image
              src={mainImageUrl}
              alt={product.productName}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {allProductImages.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {allProductImages.map((imgUrl, idx) => {
                const isSelected = mainImageUrl === imgUrl;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                      isSelected
                        ? "border-amber-800 ring-2 ring-amber-800/20"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full">
              {product.categoryName}
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-3">
              {product.productName}
            </h1>

            <div className="flex items-center space-x-2 mt-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(Number(averageRating))
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-700">
                {averageRating}
              </span>
              <span className="text-xs text-gray-400">
                ({reviews.length} đánh giá)
              </span>
            </div>

            <div className="text-3xl font-bold text-amber-900 mt-4">
              {product.price.toLocaleString("vi-VN")} đ
            </div>
          </div>

          <div className="border-y border-gray-100 py-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Chất liệu:</span>
              <span className="font-semibold text-gray-900">
                {product.material || "Gỗ tự nhiên"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Kích thước:</span>
              <span className="font-semibold text-gray-900">
                {product.dimensions || "Tiêu chuẩn"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tình trạng:</span>
              <span
                className={`font-semibold ${
                  isOutOfStock ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {isOutOfStock
                  ? "Hết hàng"
                  : `Còn hàng (${product.stockQuantity})`}
              </span>
            </div>
          </div>

          {!isOutOfStock && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-semibold uppercase text-gray-500">
                  Số lượng:
                </span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 hover:bg-gray-200 transition"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="px-4 text-sm font-bold text-gray-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stockQuantity, q + 1))
                    }
                    className="p-2.5 hover:bg-gray-200 transition"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <button
                onClick={() =>
                  addToCart({ productId: product.productId, quantity })
                }
                disabled={isAddingToCart}
                className="w-full py-4 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm rounded-xl shadow-lg shadow-amber-900/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>
                  {isAddingToCart ? "Đang thêm..." : "Thêm Vào Giỏ Hàng"}
                </span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs text-gray-600">
            <div className="p-3 rounded-xl bg-gray-50">
              <ShieldCheck className="w-5 h-5 mx-auto text-amber-800 mb-1" />
              <span>Bảo hành 5 năm</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50">
              <Truck className="w-5 h-5 mx-auto text-amber-800 mb-1" />
              <span>Miễn phí giao hàng</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50">
              <RefreshCw className="w-5 h-5 mx-auto text-amber-800 mb-1" />
              <span>Đổi trả 7 ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mô tả sản phẩm */}
      <div className="mt-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-xl font-serif font-bold text-gray-900">
          Mô Tả Sản Phẩm
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {product.description ||
            "Chưa có bài viết mô tả chi tiết cho sản phẩm này."}
        </p>
      </div>

      {/* Đánh Giá Sản Phẩm */}
      <div className="mt-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
        <div>
          <h2 className="text-xl font-serif font-bold text-gray-900">
            Đánh Giá & Nhận Xét ({reviews.length})
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Cảm nhận thực tế từ khách hàng đã trải nghiệm sản phẩm
          </p>
        </div>

        <form
          onSubmit={handleSubmitReview}
          className="bg-gray-50 p-6 rounded-2xl border border-gray-200/60 space-y-4"
        >
          <h3 className="text-sm font-bold text-gray-800">
            Gửi đánh giá của bạn
          </h3>

          {submitSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Cảm ơn bạn! Đánh giá của bạn đã được gửi thành công.</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-gray-600">
              Đánh giá điểm:
            </span>
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <textarea
              rows={3}
              required
              placeholder="Chia sẻ nhận xét của bạn..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-800 hover:text-amber-900 cursor-pointer bg-white px-3 py-2 rounded-xl border border-gray-300">
              <Upload className="w-4 h-4" />
              <span>Thêm ảnh thực tế</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {previewImageUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {previewImageUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative w-16 h-16 rounded-lg overflow-hidden border"
                  >
                    <Image
                      src={url}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveReviewImage(idx)}
                      className="absolute top-0 right-0 bg-red-600 text-white w-4 h-4 text-xs flex items-center justify-center rounded-bl"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmittingReview}
            className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50"
          >
            {isSubmittingReview ? "Đang gửi..." : "Gửi Đánh Giá"}
          </button>
        </form>

        {isReviewsLoading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-2xl" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center py-6 text-xs text-gray-500">
            Chưa có đánh giá nào cho sản phẩm này.
          </p>
        ) : (
          <div className="space-y-6 divide-y divide-gray-100">
            {reviews.map((rev) => (
              <div key={rev.reviewId} className="pt-6 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">
                        {rev.userName || "Khách hàng"}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(rev.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>

                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {rev.comment}
                </p>

                {rev.imageUrls && rev.imageUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {rev.imageUrls.map((img, index) => (
                      <div
                        key={index}
                        className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-100"
                      >
                        <Image
                          src={img}
                          alt="Review attachment"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sản Phẩm Tương Tự (Gợi ý Cùng Danh Mục) */}
      <div className="mt-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center space-x-2 border-b border-gray-100 pb-4">
          <Package className="w-5 h-5 text-amber-800" />
          <h2 className="text-xl font-serif font-bold text-gray-900">
            Sản Phẩm Tương Tự
          </h2>
        </div>

        {isRelatedLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-2xl" />
            ))}
          </div>
        ) : relatedProducts.length === 0 ? (
          <p className="text-xs text-gray-500 py-4 text-center">
            Chưa có sản phẩm tương tự nào.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.slice(0, 4).map((item) => (
              <Link
                key={item.productId}
                href={`/products/${item.productId}`}
                className="group bg-gray-50/50 rounded-2xl p-3 border border-gray-100 hover:border-amber-800/30 hover:shadow-md transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white mb-3">
                    <Image
                      src={item.imageUrl || "/placeholder-wood.jpg"}
                      alt={item.productName}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <h3 className="text-xs font-bold text-gray-800 group-hover:text-amber-800 transition line-clamp-2 leading-snug">
                    {item.productName}
                  </h3>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900">
                    {item.price.toLocaleString("vi-VN")} đ
                  </span>
                  <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded-md border border-gray-100">
                    Xem
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
