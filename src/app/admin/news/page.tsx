"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useGetNewsList, useDeleteNews } from "@/src/hooks/useNews";
import { NewsDto, NewsStatus } from "@/src/types";
import { NewsModal } from "@/src/components/admin/NewsModal";
import { ConfirmModal } from "@/src/components/admin/ConfirmModal";
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

  // State cho Modal xác nhận xóa
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

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

  // Mở Modal xác nhận xóa
  const handleOpenDeleteModal = (id: string, title: string) => {
    setDeleteTarget({ id, title });
  };

  // Xử lý xóa bài viết khi bấm "Đồng ý"
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success(`Đã xóa bài viết "${deleteTarget.title}" thành công!`);
        setDeleteTarget(null);
      },
      onError: () => {
        toast.error("Có lỗi xảy ra, không thể xóa bài viết này.");
      },
    });
  };

  const renderStatusBadge = (status: NewsStatus) => {
    switch (status) {
      case NewsStatus.Published:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
            Xuất bản
          </span>
        );
      case NewsStatus.Draft:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 inline-block">
            Bản nháp
          </span>
        );
      case NewsStatus.Archived:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 inline-block">
            Lưu trữ
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Newspaper className="w-5 h-5 text-amber-800 shrink-0" />
            <span>Quản Lý Tin Tức & Bài Viết</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
            Quản lý tin tức, kiến thức nội thất và ưu đãi của cửa hàng
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedNews(null);
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-amber-800 text-white rounded-xl hover:bg-amber-900 active:scale-95 transition text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Bài Viết Mới</span>
        </button>
      </div>

      {/* Toolbar Filter */}
      <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
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

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 sm:p-6 space-y-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl w-full" />
            ))}
          </div>
        ) : newsList.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-xs text-slate-400">
            Không tìm thấy bài viết nào
          </div>
        ) : (
          <>
            {/* 1. Mobile Card View (Dành cho điện thoại) */}
            <div className="block md:hidden divide-y divide-slate-100">
              {newsList.map((n) => (
                <div key={n.newsId} className="p-4 space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="relative w-16 h-14 rounded-lg overflow-hidden border bg-slate-50 shrink-0">
                      <Image
                        src={n.imageUrl || "/placeholder-news.jpg"}
                        alt={n.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 text-xs line-clamp-2">
                        {n.title}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {n.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-50">
                    <div className="flex items-center space-x-3 text-slate-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{n.authorName || "Admin"}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>
                          {new Date(n.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                    <div>{renderStatusBadge(n.status)}</div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedNews(n);
                        setIsModalOpen(true);
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-amber-50 hover:text-amber-800 rounded-lg transition flex items-center space-x-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Sửa</span>
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(n.newsId, n.title)}
                      className="px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Desktop Table View (Dành cho màn hình lớn) */}
            <div className="hidden md:block overflow-x-auto">
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
                  {newsList.map((n) => (
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
                            onClick={() =>
                              handleOpenDeleteModal(n.newsId, n.title)
                            }
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-3 sm:p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
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

      {/* Modal CRUD News */}
      {isModalOpen && (
        <NewsModal
          newsItem={selectedNews}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Modal Xác Nhận Xóa */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Xóa bài viết"
        description={`Bạn có chắc chắn muốn xóa bài viết "${deleteTarget?.title}"? Hành động này không thể hoàn tác.`}
        isLoading={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
