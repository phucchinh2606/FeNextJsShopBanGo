"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { NewsDto, NewsStatus } from "@/src/types";
import { useCreateNews, useUpdateNews } from "@/src/hooks/useNews";
import { X, Upload, Loader2, Newspaper } from "lucide-react";

const newsSchema = z.object({
  title: z.string().min(5, "Tiêu đề bài viết phải có ít nhất 5 ký tự"),
  summary: z.string().min(10, "Tóm tắt ngắn phải có ít nhất 10 ký tự"),
  content: z.string().min(20, "Nội dung bài viết phải có ít nhất 20 ký tự"),
  authorId: z.string().min(1, "Vui lòng nhập Mã tác giả"),
  status: z.union([z.number(), z.string()]).transform((val) => Number(val)),
});

type NewsFormValues = z.infer<typeof newsSchema>;

interface NewsModalProps {
  newsItem?: NewsDto | null;
  onClose: () => void;
}

export const NewsModal = ({ newsItem, onClose }: NewsModalProps) => {
  const isEdit = !!newsItem;
  const createMutation = useCreateNews();
  const updateMutation = useUpdateNews();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    newsItem?.imageUrl || "",
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      authorId: "admin-id", // Thay thế bằng ID người dùng hiện tại nếu có
      status: NewsStatus.Draft,
    },
  });

  useEffect(() => {
    if (newsItem) {
      reset({
        title: newsItem.title,
        summary: newsItem.summary,
        content: newsItem.content,
        authorId: newsItem.authorId || "admin-id",
        status: newsItem.status,
      });
      setImagePreview(newsItem.imageUrl);
    }
  }, [newsItem, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (values: NewsFormValues) => {
    if (isEdit && newsItem) {
      updateMutation.mutate(
        {
          id: newsItem.newsId,
          data: {
            ...values,
            status: Number(values.status) as NewsStatus,
            image: imageFile || undefined,
          },
        },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(
        {
          ...values,
          status: Number(values.status) as NewsStatus,
          image: imageFile || undefined,
        },
        { onSuccess: onClose },
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Newspaper className="w-4 h-4 text-amber-800" />
            <span>{isEdit ? "Cập Nhật Bài Viết" : "Thêm Bài Viết Mới"}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs"
        >
          {/* Tiêu đề */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">
              Tiêu đề bài viết *
            </label>
            <input
              {...register("title")}
              placeholder="Nhập tiêu đề bài viết..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800"
            />
            {errors.title && (
              <p className="text-rose-500 text-[11px]">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Trạng thái */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                Trạng thái *
              </label>
              <select
                {...register("status")}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800"
              >
                <option value={NewsStatus.Draft}>Bản nháp (Draft)</option>
                <option value={NewsStatus.Published}>
                  Xuất bản (Published)
                </option>
                <option value={NewsStatus.Archived}>Lưu trữ (Archived)</option>
              </select>
            </div>

            {/* Mã tác giả */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                Mã Tác giả *
              </label>
              <input
                {...register("authorId")}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800"
              />
              {errors.authorId && (
                <p className="text-rose-500 text-[11px]">
                  {errors.authorId.message}
                </p>
              )}
            </div>
          </div>

          {/* Tóm tắt ngắn */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">
              Mô tả tóm tắt *
            </label>
            <textarea
              rows={2}
              {...register("summary")}
              placeholder="Nhập phần tóm tắt ngắn bài viết..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800"
            />
            {errors.summary && (
              <p className="text-rose-500 text-[11px]">
                {errors.summary.message}
              </p>
            )}
          </div>

          {/* Nội dung bài viết */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">
              Nội dung bài viết *
            </label>
            <textarea
              rows={6}
              {...register("content")}
              placeholder="Nhập nội dung đầy đủ bài viết..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800"
            />
            {errors.content && (
              <p className="text-rose-500 text-[11px]">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Ảnh minh họa */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">
              Ảnh đại diện bài viết
            </label>
            <div className="flex items-center space-x-4">
              {imagePreview && (
                <div className="relative w-16 h-16 rounded-xl border overflow-hidden shrink-0 bg-slate-50">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <label className="flex-1 flex items-center justify-center space-x-2 border-2 border-dashed border-slate-200 rounded-xl p-3 cursor-pointer hover:bg-slate-50 transition">
                <Upload className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500 font-medium">Tải ảnh lên</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-amber-800 text-white rounded-xl hover:bg-amber-900 transition font-semibold flex items-center space-x-1.5 disabled:opacity-50"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEdit ? "Cập Nhật" : "Đăng Bài"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
