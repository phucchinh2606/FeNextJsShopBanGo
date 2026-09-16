"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useGetCategories, useDeleteCategory } from "@/src/hooks/useCategory";
import { CategoryDto } from "@/src/types";
import { CategoryModal } from "@/src/components/admin/CategoryModal";
import { ConfirmModal } from "@/src/components/admin/ConfirmModal";
import {
  FolderTree,
  Plus,
  Search,
  Edit,
  Trash2,
  CornerDownRight,
  Folder,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryDto | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State cho Modal xác nhận xóa thay thế confirm()
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data: response, isLoading } = useGetCategories();
  const deleteMutation = useDeleteCategory();

  const rawCategories = response?.data || [];

  // Xử lý danh sách phân cấp (Hierarchy Layout)
  const displayCategories = useMemo(() => {
    if (!rawCategories.length) return [];

    // Nếu đang tìm kiếm, hiển thị danh sách phẳng kết quả
    if (searchTerm.trim()) {
      return rawCategories.filter(
        (c) =>
          c.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Sắp xếp danh mục con nằm ngay bên dưới danh mục cha
    const result: (CategoryDto & { level: number })[] = [];
    const rootCategories = rawCategories.filter(
      (c) =>
        !c.parentId || c.parentId === "00000000-0000-0000-0000-000000000000",
    );

    const processCategory = (category: CategoryDto, level: number) => {
      result.push({ ...category, level });

      // Lấy danh mục con từ subCategories hoặc lọc từ danh sách gốc
      const subCats =
        category.subCategories && category.subCategories.length > 0
          ? category.subCategories
          : rawCategories.filter((c) => c.parentId === category.categoryId);

      subCats.forEach((sub) => processCategory(sub, level + 1));
    };

    rootCategories.forEach((root) => processCategory(root, 0));

    // Thêm các danh mục còn lại nếu bị thiếu liên kết cha
    const processedIds = new Set(result.map((r) => r.categoryId));
    rawCategories.forEach((c) => {
      if (!processedIds.has(c.categoryId)) {
        result.push({ ...c, level: 0 });
      }
    });

    return result;
  }, [rawCategories, searchTerm]);

  // Map lấy tên danh mục cha
  const getParentName = (parentId?: string | null) => {
    if (!parentId) return null;
    const parent = rawCategories.find((c) => c.categoryId === parentId);
    return parent ? parent.categoryName : null;
  };

  // Mở Modal xác nhận xóa
  const handleOpenDeleteModal = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  // Thực thi xóa khi người dùng chọn "Đồng ý"
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success(`Đã xóa danh mục "${deleteTarget.name}" thành công!`);
        setDeleteTarget(null);
      },
      onError: () => {
        toast.error("Có lỗi xảy ra, không thể xóa danh mục này.");
      },
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center space-x-2">
            <FolderTree className="w-5 h-5 text-amber-800 shrink-0" />
            <span>Quản Lý Danh Mục</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
            Quản lý và phân loại các danh mục sản phẩm đồ gỗ mỹ nghệ
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-amber-800 text-white rounded-xl hover:bg-amber-900 active:scale-95 transition text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Danh Mục Mới</span>
        </button>
      </div>

      {/* Toolbar Search */}
      <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:max-w-md">
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

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 sm:p-6 space-y-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-xl w-full" />
            ))}
          </div>
        ) : displayCategories.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-xs text-slate-400">
            Không tìm thấy danh mục nào.
          </div>
        ) : (
          <>
            {/* 1. Mobile List View (Card Layout cho Màn hình nhỏ) */}
            <div className="block md:hidden divide-y divide-slate-100">
              {displayCategories.map((c) => {
                const parentName = getParentName(c.parentId);
                const level =
                  (c as CategoryDto & { level?: number }).level || 0;

                return (
                  <div key={c.categoryId} className="p-3.5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className="flex items-center space-x-1.5"
                        style={{ paddingLeft: `${Math.min(level * 12, 36)}px` }}
                      >
                        {level > 0 ? (
                          <CornerDownRight className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        ) : (
                          <Folder className="w-4 h-4 text-amber-800 shrink-0 fill-amber-100" />
                        )}
                        <span
                          className={`text-xs ${level > 0 ? "font-medium text-slate-700" : "font-bold text-slate-900"}`}
                        >
                          {c.categoryName}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={() => {
                            setSelectedCategory(c);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-600 hover:text-amber-800 bg-slate-50 hover:bg-amber-50 rounded-lg border border-slate-200"
                          title="Sửa"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            handleOpenDeleteModal(c.categoryId, c.categoryName)
                          }
                          className="p-1.5 text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-lg border border-slate-200"
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-400">Danh mục cha:</span>
                      {parentName ? (
                        <span className="px-2 py-0.5 rounded-full font-semibold bg-amber-50 text-amber-800 border border-amber-200 text-[10px]">
                          {parentName}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium text-[10px]">
                          Gốc
                        </span>
                      )}
                    </div>

                    {c.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 bg-slate-50 p-2 rounded-lg">
                        {c.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 2. Desktop Table View (Bảng truyền thống trên Màn hình lớn) */}
            <div className="hidden md:block overflow-x-auto">
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
                  {displayCategories.map((c) => {
                    const parentName = getParentName(c.parentId);
                    const level =
                      (c as CategoryDto & { level?: number }).level || 0;

                    return (
                      <tr
                        key={c.categoryId}
                        className="hover:bg-slate-50/80 transition"
                      >
                        <td className="p-4 font-bold text-slate-800">
                          <div
                            className="flex items-center space-x-2"
                            style={{ paddingLeft: `${level * 24}px` }}
                          >
                            {level > 0 ? (
                              <CornerDownRight className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            ) : (
                              <Folder className="w-4 h-4 text-amber-800 shrink-0 fill-amber-100" />
                            )}
                            <span
                              className={
                                level > 0 ? "font-medium text-slate-700" : ""
                              }
                            >
                              {c.categoryName}
                            </span>
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
                                handleOpenDeleteModal(
                                  c.categoryId,
                                  c.categoryName,
                                )
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
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Modal CRUD Category */}
      {isModalOpen && (
        <CategoryModal
          category={selectedCategory}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Modal Xác nhận Xóa */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Xóa danh mục"
        description={`Bạn có chắc chắn muốn xóa danh mục "${deleteTarget?.name}"? Hành động này không thể hoàn tác.`}
        isLoading={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
