"use client";

import Image from "next/image";
import Link from "next/link";
import { TopProductDto } from "@/src/types";
import { ArrowRight, Package } from "lucide-react";

interface TopProductsWidgetProps {
  products?: TopProductDto[];
  isLoading?: boolean;
}

export const TopProductsWidget = ({
  products = [],
  isLoading,
}: TopProductsWidgetProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-40 bg-slate-200 rounded animate-pulse" />
        <div className="border border-slate-100 rounded-2xl bg-white p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-3 animate-pulse">
              <div className="w-12 h-12 bg-slate-200 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center space-x-2">
          <Package className="w-4 h-4 text-amber-800 shrink-0" />
          <span>Top Sản Phẩm Bán Chạy</span>
        </h2>
        <Link
          href="/admin/products"
          className="text-[11px] sm:text-xs font-semibold text-amber-800 hover:text-amber-900 hover:underline flex items-center space-x-1 transition"
        >
          <span>Tất cả sản phẩm</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-sm">
        {products.length === 0 ? (
          <div className="p-6 sm:p-8 text-center text-xs text-slate-400">
            Chưa có dữ liệu sản phẩm bán chạy
          </div>
        ) : (
          products.map((product, index) => (
            <div
              key={product.productId}
              className="p-3 sm:p-3.5 flex items-center justify-between space-x-2 sm:space-x-3 hover:bg-slate-50/80 transition"
            >
              <span className="text-[11px] sm:text-xs font-bold text-slate-400 w-3.5 sm:w-4 text-center shrink-0">
                #{index + 1}
              </span>

              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                <Image
                  src={product.imageUrl || "/placeholder-wood.jpg"}
                  alt={product.productName}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 text-xs">
                <Link
                  href={`/admin/products?id=${product.productId}`}
                  className="font-bold text-slate-800 truncate block hover:text-amber-800 transition"
                >
                  {product.productName}
                </Link>
                <p className="text-slate-400 mt-0.5 text-[11px] truncate">
                  Chất liệu:{" "}
                  <span className="text-slate-600 font-medium">
                    {product.material}
                  </span>
                </p>
              </div>

              <div className="text-right text-xs shrink-0">
                <span className="font-bold text-amber-900 block text-[11px] sm:text-xs">
                  {product.totalRevenue.toLocaleString("vi-VN")} đ
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-500">
                  Đã bán:{" "}
                  <strong className="text-slate-700">
                    {product.totalQuantitySold}
                  </strong>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
