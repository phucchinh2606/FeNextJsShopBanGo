"use client";

import Image from "next/image";
import Link from "next/link";

import { Calendar, User, ArrowRight } from "lucide-react";
import { useGetNewsList } from "@/src/hooks/useNews";
import { NewsStatus } from "@/src/types/news";

export const LatestNews = () => {
  const { data: newsResponse, isLoading } = useGetNewsList({
    pageNumber: 1,
    pageSize: 3,
    status: NewsStatus.Published,
    isDescending: true,
  });

  const newsList = newsResponse?.data?.items || [];

  return (
    <section className="py-10 sm:py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6 sm:mb-10">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-amber-700">
              Cập nhật tin tức
            </span>
            <h2 className="text-xl sm:text-3xl font-serif font-bold text-gray-900 mt-1">
              Tin Tức & Kiến Thức Đồ Gỗ
            </h2>
          </div>
          <Link
            href="/news"
            className="flex items-center space-x-1 text-xs sm:text-sm font-semibold text-amber-800 hover:text-amber-600 transition"
          >
            <span>Tất cả</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-64 sm:h-80 bg-gray-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {newsList.map((item) => {
              const formattedDate = new Date(item.createdAt).toLocaleDateString(
                "vi-VN",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                },
              );

              return (
                <article
                  key={item.newsId}
                  className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition duration-300"
                >
                  {/* Banner Ảnh */}
                  <div className="relative aspect-[16/9] w-full bg-gray-100 overflow-hidden">
                    <Image
                      src={item.imageUrl || "/placeholder-wood.jpg"}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  {/* Nội dung bài viết */}
                  <div className="p-4 sm:p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center space-x-3 sm:space-x-4 text-[11px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-amber-700" />
                          {formattedDate}
                        </span>
                        <span className="flex items-center">
                          <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-amber-700" />
                          {item.authorName || "Admin"}
                        </span>
                      </div>

                      <Link href={`/news/${item.slug || item.newsId}`}>
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-amber-800 transition line-clamp-2 leading-snug">
                          {item.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-gray-600 mt-1.5 sm:mt-2 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-50">
                      <Link
                        href={`/news/${item.slug || item.newsId}`}
                        className="inline-flex items-center text-xs font-semibold text-amber-800 hover:text-amber-900 transition"
                      >
                        <span>Đọc tiếp</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition duration-200" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
