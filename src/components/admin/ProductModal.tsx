"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { ProductDto, ProductStatus } from "@/src/types";
import { useCreateProduct, useUpdateProduct } from "@/src/hooks/useProduct";
import { useGetCategories } from "@/src/hooks/useCategory";
import { X, Upload, Loader2 } from "lucide-react";

// Schema Validation với Zod
const productSchema = z.object({
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  productName: z.string().min(2, "Tên sản phẩm phải từ 2 ký tự"),
  material: z.string().min(1, "Vui lòng nhập chất liệu gỗ"),
  dimensions: z.string().min(1, "Vui lòng nhập kích thước"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
  price: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .refine((val) => val >= 1000, "Giá sản phẩm tối thiểu 1.000đ"),
  stockQuantity: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .refine((val) => val >= 0, "Số lượng kho không hợp lệ"),
  status: z.union([z.number(), z.string()]).transform((val) => Number(val)),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductModalProps {
  product?: ProductDto | null;
  onClose: () => void;
}

export const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const isEdit = !!product;
  const { data: categoryRes } = useGetCategories();
  const categories = categoryRes?.data || [];

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    product?.imageUrl || "",
  );
  const [imageError, setImageError] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      categoryId: "",
      productName: "",
      material: "",
      dimensions: "",
      description: "",
      price: 0,
      stockQuantity: 0,
      status: ProductStatus.InStock,
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        categoryId: product.categoryId,
        productName: product.productName,
        material: product.material,
        dimensions: product.dimensions,
        description: product.description,
        price: product.price,
        stockQuantity: product.stockQuantity,
        status: product.status,
      });
      setImagePreview(product.imageUrl);
    }
  }, [product, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageError("");
    }
  };

  const onSubmit = (values: ProductFormValues) => {
    if (!isEdit && !mainImageFile) {
      setImageError("Vui lòng tải lên ảnh chính của sản phẩm");
      return;
    }

    if (isEdit && product) {
      updateMutation.mutate(
        {
          id: product.productId,
          data: {
            ...values,
            status: Number(values.status) as ProductStatus,
            image: mainImageFile || undefined,
          },
        },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(
        {
          ...values,
          status: Number(values.status) as ProductStatus,
          mainImage: mainImageFile!,
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
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-900">
            {isEdit ? "Cập Nhật Sản Phẩm" : "Thêm Sản Phẩm Mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tên sản phẩm */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                Tên sản phẩm *
              </label>
              <input
                {...register("productName")}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800"
                placeholder="Nhập tên sản phẩm..."
              />
              {errors.productName && (
                <p className="text-rose-500 text-[11px]">
                  {errors.productName.message}
                </p>
              )}
            </div>

            {/* Danh mục */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Danh mục *</label>
              <select
                {...register("categoryId")}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-rose-500 text-[11px]">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            {/* Giá sản phẩm */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                Giá bán (VNĐ) *
              </label>
              <input
                type="number"
                {...register("price")}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800"
              />
              {errors.price && (
                <p className="text-rose-500 text-[11px]">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Số lượng tồn kho */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                Số lượng tồn kho *
              </label>
              <input
                type="number"
                {...register("stockQuantity")}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800"
              />
              {errors.stockQuantity && (
                <p className="text-rose-500 text-[11px]">
                  {errors.stockQuantity.message}
                </p>
              )}
            </div>

            {/* Chất liệu */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                Chất liệu gỗ *
              </label>
              <input
                {...register("material")}
                placeholder="Ví dụ: Gỗ Hương, Gỗ Gõ Đỏ..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800"
              />
              {errors.material && (
                <p className="text-rose-500 text-[11px]">
                  {errors.material.message}
                </p>
              )}
            </div>

            {/* Kích thước */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                Kích thước *
              </label>
              <input
                {...register("dimensions")}
                placeholder="Ví dụ: 120 x 80 x 75 cm"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800"
              />
              {errors.dimensions && (
                <p className="text-rose-500 text-[11px]">
                  {errors.dimensions.message}
                </p>
              )}
            </div>
          </div>

          {/* Trạng thái kho */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Trạng thái *</label>
            <select
              {...register("status")}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800"
            >
              <option value={ProductStatus.InStock}>Còn hàng</option>
              <option value={ProductStatus.OutOfStock}>Hết hàng</option>
              <option value={ProductStatus.Discontinued}>
                Ngừng kinh doanh
              </option>
            </select>
          </div>

          {/* Mô tả */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">
              Mô tả sản phẩm *
            </label>
            <textarea
              rows={3}
              {...register("description")}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800"
              placeholder="Nhập thông tin chi tiết..."
            />
            {errors.description && (
              <p className="text-rose-500 text-[11px]">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Ảnh chính */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">
              Ảnh đại diện sản phẩm {!isEdit && "*"}
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
                <span className="text-slate-500 font-medium">
                  Tải lên hình ảnh
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            {imageError && (
              <p className="text-rose-500 text-[11px]">{imageError}</p>
            )}
          </div>

          {/* Footer Actions */}
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
              <span>{isEdit ? "Cập Nhật" : "Thêm Mới"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
