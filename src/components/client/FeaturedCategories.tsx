"use client";

import Link from "next/link";
import { ArrowRight, Folder } from "lucide-react";
import { useGetCategories } from "@/src/hooks/useCategory";

export const FeaturedCategories = () => {
  const { data: categoryResponse, isLoading } = useGetCategories();
  const categories = categoryResponse?.data || [];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 sm:w-1/4"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-28 sm:h-32 bg-gray-200 rounded-xl"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-10 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-amber-700">
              Danh mục lựa chọn
            </span>
            <h2 className="text-xl sm:text-3xl font-serif font-bold text-gray-900 mt-1">
              Khám Phá Theo Danh Mục
            </h2>
          </div>
          <Link
            href="/products"
            className="flex items-center space-x-1 text-xs sm:text-sm font-semibold text-amber-800 hover:text-amber-600 transition"
          >
            <span>Tất cả</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.categoryId}
              href={`/products?categoryId=${cat.categoryId}`}
              className="group flex flex-col items-center p-4 sm:p-6 bg-amber-50/50 hover:bg-amber-100/60 border border-amber-100/80 rounded-2xl transition duration-300 text-center"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-amber-800 shadow-sm group-hover:scale-110 transition duration-300 mb-2 sm:mb-3">
                <Folder className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-amber-900 transition line-clamp-1">
                {cat.categoryName}
              </h3>
              {cat.description && (
                <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1 hidden sm:block">
                  {cat.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
