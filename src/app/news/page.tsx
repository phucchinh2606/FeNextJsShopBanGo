"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  User,
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { useGetNewsList } from "@/src/hooks/useNews";
import { NewsStatus } from "@/src/types/news";
import { Header } from "@/src/components/client/Header";
import { Footer } from "@/src/components/client/Footer";

export default function NewsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 9;

  const { data: newsResponse, isLoading } = useGetNewsList({
    pageNumber,
    pageSize,
    searchTerm: searchTerm || undefined,
    status: NewsStatus.Published,
    isDescending: true,
  });

  const newsList = newsResponse?.data?.items || [];
  const totalPages = newsResponse?.data?.totalPages || 1;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Banner tiêu đề */}
        <div className="bg-gradient-to-r from-amber-900 to-amber-950 text-white p-8 sm:p-12 rounded-3xl shadow-sm mb-10 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
              Kiến thức & Kinh nghiệm
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold mt-2 leading-tight">
              Tin Tức & Kiến Thức Nội Thất Gỗ
            </h1>
            <p className="text-amber-100/80 text-sm mt-3 leading-relaxed">
              Tổng hợp những hướng dẫn bảo quản, cách chọn gỗ chuẩn và xu hướng
              bài trí phong thủy nội thất gỗ cao cấp cho ngôi nhà của bạn.
            </p>
          </div>
          <BookOpen className="absolute right-6 -bottom-6 w-64 h-64 text-white/5 pointer-events-none hidden md:block" />
        </div>

        {/* Thanh tìm kiếm & Lọc */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết theo tiêu đề..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPageNumber(1);
              }}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition"
            />
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Hiển thị {newsList.length} bài viết
          </p>
        </div>

        {/* Danh sách Tin tức Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-slate-200/60 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : newsList.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
            <p className="text-slate-500 text-sm">
              Không tìm thấy bài viết nào phù hợp với từ khóa của bạn.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition duration-300"
                >
                  <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={item.imageUrl || "/placeholder-wood.jpg"}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center space-x-4 text-[11px] text-slate-400 mb-3">
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-amber-800" />
                          {formattedDate}
                        </span>
                        <span className="flex items-center">
                          <User className="w-3.5 h-3.5 mr-1 text-amber-800" />
                          {item.authorName || "Admin"}
                        </span>
                      </div>

                      <Link href={`/news/${item.newsId}`}>
                        <h2 className="text-base font-bold text-slate-900 group-hover:text-amber-900 transition line-clamp-2 leading-snug">
                          {item.title}
                        </h2>
                      </Link>

                      <p className="text-xs text-slate-500 mt-2.5 line-clamp-3 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <Link
                        href={`/news/${item.newsId}`}
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

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 pt-10">
            <button
              disabled={pageNumber === 1}
              onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
              className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-white disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-4 text-slate-700">
              Trang {pageNumber} / {totalPages}
            </span>
            <button
              disabled={pageNumber === totalPages}
              onClick={() =>
                setPageNumber((prev) => Math.min(prev + 1, totalPages))
              }
              className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-white disabled:opacity-40 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
