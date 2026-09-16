"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CategoryDto } from "@/src/types";
import {
  useCreateCategory,
  useUpdateCategory,
  useGetCategories,
} from "@/src/hooks/useCategory";
import { X, Loader2, FolderTree } from "lucide-react";

const categorySchema = z.object({
  categoryName: z.string().min(2, "Tên danh mục phải có ít nhất 2 ký tự"),
  description: z.string().optional(),
  parentId: z.string().nullable().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryModalProps {
  category?: CategoryDto | null;
  onClose: () => void;
}

export const CategoryModal = ({ category, onClose }: CategoryModalProps) => {
  const isEdit = !!category;
  const { data: categoryRes } = useGetCategories();
  const allCategories = categoryRes?.data || [];

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  // Loại trừ danh mục hiện tại khỏi danh sách chọn danh mục cha nếu đang sửa
  const parentOptions = allCategories.filter(
    (c) => !isEdit || c.categoryId !== category?.categoryId,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: "",
      description: "",
      parentId: null,
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        categoryName: category.categoryName,
        description: category.description || "",
        parentId: category.parentId || null,
      });
    }
  }, [category, reset]);

  const onSubmit = (values: CategoryFormValues) => {
    const payload = {
      categoryName: values.categoryName,
      description: values.description || undefined,
      parentId: values.parentId || null,
    };

    if (isEdit && category) {
      updateMutation.mutate(
        { id: category.categoryId, data: payload },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(payload, { onSuccess: onClose });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="p-3.5 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
            <FolderTree className="w-4 h-4 text-amber-800 shrink-0" />
            <span className="truncate">
              {isEdit ? "Cập Nhật Danh Mục" : "Thêm Danh Mục Mới"}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-3.5 sm:p-5 overflow-y-auto space-y-3.5 sm:space-y-4 text-xs flex-1"
        >
          {/* Tên danh mục */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">
              Tên danh mục <span className="text-rose-500">*</span>
            </label>
            <input
              {...register("categoryName")}
              placeholder="Nhập tên danh mục (Ví dụ: Bàn Ghế, Sập Gụ...)"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800 transition"
            />
            {errors.categoryName && (
              <p className="text-rose-500 text-[11px]">
                {errors.categoryName.message}
              </p>
            )}
          </div>

          {/* Danh mục cha */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">
              Danh mục cha (Tùy chọn)
            </label>
            <select
              {...register("parentId")}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800 transition"
            >
              <option value="">-- Là danh mục gốc --</option>
              {parentOptions.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Mô tả */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">
              Mô tả danh mục
            </label>
            <textarea
              rows={3}
              {...register("description")}
              placeholder="Nhập mô tả ngắn cho danh mục này..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800 transition resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 sm:px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition font-semibold text-xs"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-3.5 sm:px-4 py-2 bg-amber-800 text-white rounded-xl hover:bg-amber-900 transition font-semibold text-xs flex items-center space-x-1.5 disabled:opacity-50"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEdit ? "Cập Nhật" : "Tạo Danh Mục"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
