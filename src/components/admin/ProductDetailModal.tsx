"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductDto, ProductStatus } from "@/src/types";
import {
  X,
  Package,
  Tag,
  Boxes,
  Ruler,
  Layers,
  Calendar,
  DollarSign,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

interface ProductDetailModalProps {
  product: ProductDto | null;
  onClose: () => void;
}

export function ProductDetailModal({
  product,
  onClose,
}: ProductDetailModalProps) {
  if (!product) return null;

  // Ghép ảnh chính và các ảnh phụ thành 1 danh sách hiển thị
  const allImages = [product.imageUrl, ...(product.subImageUrls || [])].filter(
    Boolean,
  );

  const [selectedImage, setSelectedImage] = useState<string>(
    product.imageUrl || "/placeholder-wood.jpg",
  );

  const renderStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.InStock:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Còn hàng
          </span>
        );
      case ProductStatus.OutOfStock:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Hết hàng
          </span>
        );
      case ProductStatus.Discontinued:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Ngừng kinh doanh
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-800">
              Chi Tiết Sản Phẩm
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gallery Ảnh */}
            <div className="space-y-3">
              <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
                <Image
                  src={selectedImage || "/placeholder-wood.jpg"}
                  alt={product.productName}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Ảnh Thumbnail */}
              {allImages.length > 1 && (
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center space-x-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>Hình ảnh sản phẩm ({allImages.length})</span>
                  </p>
                  <div className="flex space-x-2 overflow-x-auto pb-1">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                          selectedImage === img
                            ? "border-amber-800 ring-2 ring-amber-800/20"
                            : "border-slate-200 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image src={img} alt="" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Thông tin chính */}
            <div className="space-y-4">
              <div>
                <span className="text-amber-800 font-semibold text-[11px] uppercase tracking-wider">
                  {product.categoryName}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                  {product.productName}
                </h3>
                <div className="mt-2">{renderStatusBadge(product.status)}</div>
              </div>

              <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
                <span className="text-[11px] text-amber-800 font-medium block">
                  Giá bán công khai
                </span>
                <span className="text-xl font-bold text-amber-900">
                  {product.price.toLocaleString("vi-VN")} đ
                </span>
              </div>

              {/* Lưới thuộc tính */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold text-[10px] uppercase block flex items-center space-x-1">
                    <Layers className="w-3 h-3" />
                    <span>Chất liệu</span>
                  </span>
                  <span className="font-medium text-slate-800 mt-0.5 block">
                    {product.material || "Chưa cập nhật"}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold text-[10px] uppercase block flex items-center space-x-1">
                    <Ruler className="w-3 h-3" />
                    <span>Kích thước</span>
                  </span>
                  <span className="font-medium text-slate-800 mt-0.5 block">
                    {product.dimensions || "Chưa cập nhật"}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold text-[10px] uppercase block flex items-center space-x-1">
                    <Boxes className="w-3 h-3" />
                    <span>Số lượng tồn</span>
                  </span>
                  <span className="font-bold text-slate-800 mt-0.5 block">
                    {product.stockQuantity} sản phẩm
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold text-[10px] uppercase block flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Ngày tạo</span>
                  </span>
                  <span className="font-medium text-slate-800 mt-0.5 block">
                    {product.createdAt
                      ? new Date(product.createdAt).toLocaleDateString("vi-VN")
                      : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mô tả chi tiết */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <h4 className="font-bold text-slate-800 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Mô tả sản phẩm</span>
            </h4>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line text-xs">
              {product.description ||
                "Chưa có mô tả chi tiết cho sản phẩm này."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold text-xs transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
