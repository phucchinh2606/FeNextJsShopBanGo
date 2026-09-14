"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useGetProducts, useDeleteProduct } from "@/src/hooks/useProduct";
import { useGetCategories } from "@/src/hooks/useCategory";
import { ProductDto, ProductStatus } from "@/src/types";
import { ProductModal } from "@/src/components/admin/ProductModal";
import { ConfirmModal } from "@/src/components/admin/ConfirmModal";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryIdFilter, setCategoryIdFilter] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State quản lý Modal xác nhận xóa sản phẩm
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data: categoryRes } = useGetCategories();
  const categories = categoryRes?.data || [];

  const { data: productRes, isLoading } = useGetProducts({
    pageNumber,
    pageSize: 10,
    searchTerm: searchTerm || undefined,
    categoryId: categoryIdFilter || undefined,
  });

  const deleteMutation = useDeleteProduct();

  const products = productRes?.data?.items || [];
  const totalPages = productRes?.data?.totalPages || 1;

  // Mở Modal xác nhận xóa
  const handleOpenDeleteModal = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  // Thực thi xóa sản phẩm khi bấm "Đồng ý"
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success(`Đã xóa sản phẩm "${deleteTarget.name}" thành công!`);
        setDeleteTarget(null);
      },
      onError: () => {
        toast.error("Có lỗi xảy ra, không thể xóa sản phẩm này.");
      },
    });
  };

  const renderStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.InStock:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Còn hàng
          </span>
        );
      case ProductStatus.OutOfStock:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Hết hàng
          </span>
        );
      case ProductStatus.Discontinued:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Ngừng kinh doanh
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
            <Package className="w-5 h-5 text-amber-800" />
            <span>Quản Lý Sản Phẩm</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Danh sách sản phẩm nội thất gỗ của cửa hàng
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-amber-800 text-white rounded-xl hover:bg-amber-900 transition text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Sản Phẩm Mới</span>
        </button>
      </div>

      {/* Toolbar Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm sản phẩm theo tên..."
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
            value={categoryIdFilter}
            onChange={(e) => {
              setCategoryIdFilter(e.target.value);
              setPageNumber(1);
            }}
            className="w-full sm:w-auto p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Sản Phẩm</th>
                <th className="p-4">Danh Mục</th>
                <th className="p-4 text-right">Giá Bán</th>
                <th className="p-4 text-center">Tồn Kho</th>
                <th className="p-4 text-center">Trạng Thái</th>
                <th className="p-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4">
                      <div className="h-10 bg-slate-200 rounded-xl w-48" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-slate-200 rounded w-24" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-slate-200 rounded w-20 ml-auto" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-slate-200 rounded w-12 mx-auto" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-slate-200 rounded w-16 mx-auto" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-slate-200 rounded w-12 mx-auto" />
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p.productId}
                    className="hover:bg-slate-50/80 transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden border bg-slate-50 shrink-0">
                          <Image
                            src={p.imageUrl || "/placeholder-wood.jpg"}
                            alt={p.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 line-clamp-1">
                            {p.productName}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {p.material}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-600">
                      {p.categoryName}
                    </td>
                    <td className="p-4 text-right font-bold text-amber-900">
                      {p.price.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="p-4 text-center font-bold text-slate-700">
                      {p.stockQuantity}
                    </td>
                    <td className="p-4 text-center">
                      {renderStatusBadge(p.status)}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => {
                            setSelectedProduct(p);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition"
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleOpenDeleteModal(p.productId, p.productName)
                          }
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

      {/* Modal CRUD Sản Phẩm */}
      {isModalOpen && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Modal Xác Nhận Xóa */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Xóa sản phẩm"
        description={`Bạn có chắc chắn muốn xóa sản phẩm "${deleteTarget?.name}"? Hành động này không thể hoàn tác.`}
        isLoading={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
