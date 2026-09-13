"use client";

import { useState } from "react";
import Image from "next/image";
import { useGetNewsList, useDeleteNews } from "@/src/hooks/useNews";
import { NewsDto, NewsStatus } from "@/src/types";
import { NewsModal } from "@/src/components/admin/NewsModal";
import {
  Newspaper,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
} from "lucide-react";

export default function AdminNewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedNews, setSelectedNews] = useState<NewsDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: newsRes, isLoading } = useGetNewsList({
    pageNumber,
    pageSize: 10,
    searchTerm: searchTerm || undefined,
    status:
      statusFilter !== "" ? (Number(statusFilter) as NewsStatus) : undefined,
  });

  const deleteMutation = useDeleteNews();

  const newsList = newsRes?.data?.items || [];
  const totalPages = newsRes?.data?.totalPages || 1;

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const renderStatusBadge = (status: NewsStatus) => {
    switch (status) {
      case NewsStatus.Published:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Xuất bản
          </span>
        );
      case NewsStatus.Draft:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Bản nháp
          </span>
        );
      case NewsStatus.Archived:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Lưu trữ
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Newspaper className="w-5 h-5 text-amber-800" />
            <span>Quản Lý Tin Tức & Bài Viết</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý tin tức, kiến thức nội thất và ưu đãi của cửa hàng
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedNews(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-amber-800 text-white rounded-xl hover:bg-amber-900 transition text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Bài Viết Mới</span>
        </button>
      </div>

      {/* Toolbar Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề bài viết..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPageNumber(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPageNumber(1);
            }}
            className="w-full sm:w-auto p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none"
          >
            <option value="">Tất cả trạng thái</option>
            <option value={NewsStatus.Published}>Xuất bản</option>
            <option value={NewsStatus.Draft}>Bản nháp</option>
            <option value={NewsStatus.Archived}>Lưu trữ</option>
          </select>
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Bài Viết</th>
                <th className="p-4">Tác Giả</th>
                <th className="p-4">Ngày Tạo</th>
                <th className="p-4 text-center">Trạng Thái</th>
                <th className="p-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                [1, 2, 3, 4].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4">
                      <div className="h-10 bg-slate-200 rounded-xl w-64" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-slate-200 rounded w-24" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-slate-200 rounded w-24" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-slate-200 rounded w-16 mx-auto" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-slate-200 rounded w-12 mx-auto" />
                    </td>
                  </tr>
                ))
              ) : newsList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400">
                    Không tìm thấy bài viết nào
                  </td>
                </tr>
              ) : (
                newsList.map((n) => (
                  <tr
                    key={n.newsId}
                    className="hover:bg-slate-50/80 transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3 max-w-md">
                        <div className="relative w-12 h-10 rounded-xl overflow-hidden border bg-slate-50 shrink-0">
                          <Image
                            src={n.imageUrl || "/placeholder-news.jpg"}
                            alt={n.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 line-clamp-1">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            {n.summary}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1 text-slate-600">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{n.authorName || "Admin"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1 text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {new Date(n.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {renderStatusBadge(n.status)}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => {
                            setSelectedNews(n);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition"
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(n.newsId, n.title)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Trang <strong>{pageNumber}</strong> /{" "}
              <strong>{totalPages}</strong>
            </span>
            <div className="flex items-center space-x-1">
              <button
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber((p) => p - 1)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pageNumber >= totalPages}
                onClick={() => setPageNumber((p) => p + 1)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <NewsModal
          newsItem={selectedNews}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
