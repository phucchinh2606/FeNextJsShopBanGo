"use client";

import Image from "next/image";
import Link from "next/link";

import { ShoppingCart, Eye } from "lucide-react";
import { ProductDto, ProductStatus } from "@/src/types/product";
import { useAddToCart } from "@/src/hooks/useCart";

interface ProductCardProps {
  product: ProductDto;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { mutate: addToCart, isPending } = useAddToCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({ productId: product.productId, quantity: 1 });
  };

  const isOutOfStock =
    product.status === ProductStatus.OutOfStock || product.stockQuantity <= 0;

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 flex flex-col h-full">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
        <Image
          src={product.imageUrl || "/placeholder-wood.jpg"}
          alt={product.productName}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition duration-500"
        />

        {/* Status Badge */}
        {isOutOfStock && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded uppercase">
            Hết hàng
          </span>
        )}

        {/* Hover Action Overlay (Chỉ hiển thị nút trên Desktop) */}
        <div className="hidden sm:flex absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 items-center justify-center space-x-2">
          <Link
            href={`/products/${product.productId}`}
            className="p-2.5 sm:p-3 bg-white rounded-full text-gray-800 hover:text-amber-800 hover:scale-110 transition shadow-md"
            title="Xem chi tiết"
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          {!isOutOfStock && (
            <button
              onClick={handleQuickAdd}
              disabled={isPending}
              className="p-2.5 sm:p-3 bg-amber-800 rounded-full text-white hover:bg-amber-900 hover:scale-110 transition shadow-md disabled:opacity-50"
              title="Thêm nhanh vào giỏ"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[10px] sm:text-[11px] font-medium text-amber-700 uppercase tracking-wider block">
            {product.categoryName}
          </span>
          <Link href={`/products/${product.productId}`}>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-amber-800 transition line-clamp-2 mt-0.5 sm:mt-1">
              {product.productName}
            </h3>
          </Link>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
            Gỗ: {product.material}
          </p>
        </div>

        <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="text-xs sm:text-base font-bold text-amber-900">
            {product.price.toLocaleString("vi-VN")}{" "}
            <span className="text-[10px] sm:text-xs">đ</span>
          </div>
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock || isPending}
            className="text-[11px] sm:text-xs font-semibold text-amber-800 hover:text-amber-900 disabled:text-gray-400"
          >
            {isPending ? "Đang..." : "+ Thêm"}
          </button>
        </div>
      </div>
    </div>
  );
};
