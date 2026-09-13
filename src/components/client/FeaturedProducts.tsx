"use client";

import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { ArrowRight } from "lucide-react";
import { useGetProducts } from "@/src/hooks/useProduct";

export const FeaturedProducts = () => {
  const { data: productResponse, isLoading } = useGetProducts({
    pageNumber: 1,
    pageSize: 8,
    isDescending: true,
  });

  const products = productResponse?.data?.items || [];

  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Sản phẩm nổi bật
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-1">
              Nội Thất Gỗ Mới Nhất
            </h2>
          </div>
          <Link
            href="/products"
            className="flex items-center space-x-1 text-sm font-semibold text-amber-800 hover:text-amber-600 transition"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-80 bg-gray-200 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
