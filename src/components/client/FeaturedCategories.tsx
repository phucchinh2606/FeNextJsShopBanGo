"use client";

import Link from "next/link";
import { ArrowRight, Folder } from "lucide-react";
import { useGetCategories } from "@/src/hooks/useCategory";

export const FeaturedCategories = () => {
  const { data: categoryResponse, isLoading } = useGetCategories();
  const categories = categoryResponse?.data || [];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Danh mục lựa chọn
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-1">
              Khám Phá Theo Danh Mục
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center space-x-1 text-sm font-semibold text-amber-800 hover:text-amber-600 transition"
          >
            <span>Tất cả danh mục</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.categoryId}
              href={`/products?categoryId=${cat.categoryId}`}
              className="group flex flex-col items-center p-6 bg-amber-50/50 hover:bg-amber-100/60 border border-amber-100/80 rounded-2xl transition duration-300 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-amber-800 shadow-sm group-hover:scale-110 transition duration-300 mb-3">
                <Folder className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-800 group-hover:text-amber-900 transition line-clamp-1">
                {cat.categoryName}
              </h3>
              {cat.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
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
