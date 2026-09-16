"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Share2, Tag } from "lucide-react";
import { useGetNewsById, useGetNewsList } from "@/src/hooks/useNews";
import { NewsStatus } from "@/src/types/news";
import { toast } from "sonner";

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: newsRes, isLoading } = useGetNewsById(id);
  const news = newsRes?.data;

  // Lấy các bài viết đề xuất mới nhất
  const { data: recentNewsRes } = useGetNewsList({
    pageNumber: 1,
    pageSize: 4,
    status: NewsStatus.Published,
    isDescending: true,
  });

  const recentNews = (recentNewsRes?.data?.items || []).filter(
    (item) => item.newsId !== id,
  );

  // Hàm chia sẻ liên kết sử dụng Toast (Sonner)
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Đã sao chép liên kết bài viết!", {
      style: {
        borderRadius: "12px",
        background: "#78350f",
        color: "#fff",
        fontSize: "13px",
      },
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 animate-pulse space-y-5">
        <div className="h-5 bg-slate-200 w-1/4 rounded-lg" />
        <div className="h-8 sm:h-10 bg-slate-200 w-3/4 rounded-xl" />
        <div className="h-64 sm:h-96 bg-slate-200 rounded-2xl" />
        <div className="h-32 bg-slate-200 rounded-xl" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-4xl w-full mx-auto px-4 py-16 sm:py-20 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
          Không tìm thấy bài viết
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Bài viết bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.
        </p>
        <Link
          href="/news"
          className="inline-flex items-center space-x-2 mt-6 text-xs font-semibold bg-amber-800 text-white px-5 py-2.5 rounded-xl hover:bg-amber-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang tin tức</span>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(news.createdAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Cột nội dung chính */}
        <article className="lg:col-span-8 bg-white p-4 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm">
          {/* Quay lại */}
          <Link
            href="/news"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900 transition mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tất cả bài viết</span>
          </Link>

          {/* Tiêu đề & Metadata */}
          <h1 className="text-xl sm:text-3xl font-serif font-bold text-slate-900 leading-tight">
            {news.title}
          </h1>

          <div className="flex items-center justify-between border-y border-slate-100 py-3 my-4 sm:my-6 text-xs text-slate-500">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-amber-800" />
                {formattedDate}
              </span>
              <span className="flex items-center">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-amber-800" />
                {news.authorName || "Admin"}
              </span>
            </div>
            <button
              onClick={handleCopyLink}
              className="flex items-center space-x-1 hover:text-amber-800 transition cursor-pointer text-xs"
              title="Chia sẻ"
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Chia sẻ</span>
            </button>
          </div>

          {/* Tóm tắt bài viết */}
          {news.summary && (
            <div className="bg-amber-50/60 border-l-4 border-amber-800 p-3.5 sm:p-4 rounded-r-xl sm:rounded-r-2xl text-xs sm:text-sm text-slate-700 font-medium italic mb-6 sm:mb-8 leading-relaxed">
              {news.summary}
            </div>
          )}

          {/* Ảnh minh họa bài viết */}
          {news.imageUrl && (
            <div className="relative aspect-[16/9] w-full bg-slate-100 rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-8">
              <Image
                src={news.imageUrl}
                alt={news.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          {/* Nội dung chi tiết HTML từ WYSIWYG */}
          <div
            className="prose prose-amber max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed space-y-4
              [&_img]:rounded-xl [&_img]:mx-auto [&_img]:my-4 [&_h2]:text-base [&_h2]:sm:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-sm [&_h3]:sm:text-lg [&_h3]:font-semibold [&_h3]:text-slate-800 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-amber-800 [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </article>

        {/* Sidebar - Bài viết mới nhất */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm space-y-5 lg:sticky lg:top-24">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <Tag className="w-4 h-4 text-amber-800" />
              <span>Bài Viết Mới Nhất</span>
            </h2>

            <div className="space-y-4">
              {recentNews.slice(0, 4).map((item) => (
                <Link
                  key={item.newsId}
                  href={`/news/${item.newsId}`}
                  className="group flex space-x-3 items-center"
                >
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                    <Image
                      src={item.imageUrl || "/placeholder-wood.jpg"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-slate-800 group-hover:text-amber-900 transition line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
