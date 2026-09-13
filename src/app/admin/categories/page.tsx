"use client";

import { useState } from "react";
import { useGetCategories, useDeleteCategory } from "@/src/hooks/useCategory";
import { CategoryDto } from "@/src/types";
import { CategoryModal } from "@/src/components/admin/CategoryModal";
import {
  FolderTree,
  Plus,
  Search,
  Edit,
  Trash2,
  CornerDownRight,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryDto | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: response, isLoading } = useGetCategories();
  const deleteMutation = useDeleteCategory();

  const categories = response?.data || [];

  // Lọc theo từ khóa tìm kiếm
  const filteredCategories = categories.filter(
    (c) =>
      c.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Map lấy tên danh mục cha
  const getParentName = (parentId?: string | null) => {
    if (!parentId) return null;
    const parent = categories.find((c) => c.categoryId === parentId);
    return parent ? parent.categoryName : null;
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <FolderTree className="w-5 h-5 text-amber-800" />
            <span>Quản Lý Danh Mục</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý và phân loại các danh mục sản phẩm đồ gỗ mỹ nghệ
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-amber-800 text-white rounded-xl hover:bg-amber-900 transition text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Danh Mục Mới</span>
        </button>
      </div>

      {/* Toolbar Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800"
          />
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Tên Danh Mục</th>
                <th className="p-4">Danh Mục Cha</th>
                <th className="p-4">Mô Tả</th>
                <th className="p-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                [1, 2, 3, 4].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4">
                      <div className="h-4 bg-slate-200 rounded w-32" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-slate-200 rounded w-24" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-slate-200 rounded w-48" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-slate-200 rounded w-12 mx-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-400">
                    Không tìm thấy danh mục nào
                  </td>
                </tr>
              ) : (
                filteredCategories.map((c) => {
                  const parentName = getParentName(c.parentId);
                  return (
                    <tr
                      key={c.categoryId}
                      className="hover:bg-slate-50/80 transition"
                    >
                      <td className="p-4 font-bold text-slate-800">
                        <div className="flex items-center space-x-1.5">
                          {c.parentId && (
                            <CornerDownRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span>{c.categoryName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {parentName ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            {parentName}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">
                            Danh mục gốc
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-slate-500 max-w-xs truncate">
                        {c.description || "—"}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => {
                              setSelectedCategory(c);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition"
                            title="Sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(c.categoryId, c.categoryName)
                            }
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <CategoryModal
          category={selectedCategory}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
