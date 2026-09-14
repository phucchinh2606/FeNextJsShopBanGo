"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useGetCart,
  useUpdateCartQuantity,
  useRemoveFromCart,
} from "@/src/hooks/useCart";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { data: cartResponse, isLoading } = useGetCart();
  const { mutate: updateQuantity, isPending: isUpdating } =
    useUpdateCartQuantity();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveFromCart();

  const cart = cartResponse?.data;
  const items = cart?.items || [];

  // Mảng lưu ID các item được tích chọn
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Tự động tích chọn tất cả item khi mới tải xong giỏ hàng
  useEffect(() => {
    if (items.length > 0 && selectedIds.length === 0) {
      setSelectedIds(items.map((item) => item.cartItemId));
    }
  }, [items]);

  // Chọn / Bỏ chọn tất cả
  const handleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((item) => item.cartItemId));
    }
  };

  // Chọn / Bỏ chọn 1 item
  const handleToggleSelect = (cartItemId: string) => {
    setSelectedIds((prev) =>
      prev.includes(cartItemId)
        ? prev.filter((id) => id !== cartItemId)
        : [...prev, cartItemId],
    );
  };

  // Tính tổng tiền các sản phẩm được chọn
  const selectedItems = items.filter((item) =>
    selectedIds.includes(item.cartItemId),
  );
  const selectedTotal = selectedItems.reduce(
    (acc, item) => acc + item.totalPrice,
    0,
  );

  // Chuyển sang Checkout kèm danh sách cartItemId
  const handleProceedToCheckout = () => {
    if (selectedIds.length === 0) return;
    const queryString = new URLSearchParams({
      items: selectedIds.join(","),
    }).toString();
    router.push(`/checkout?${queryString}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-32 bg-gray-200 rounded-2xl" />
          <div className="h-32 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-6">
        Giỏ Hàng Của Bạn
      </h1>

      {items.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center space-y-4">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto" />
          <h2 className="text-lg font-bold text-gray-800">
            Giỏ hàng đang trống
          </h2>
          <p className="text-sm text-gray-500">
            Hãy khám phá các sản phẩm gỗ mỹ nghệ cao cấp và thêm vào giỏ hàng
            nhé.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-800 text-white font-semibold text-xs rounded-xl shadow-lg shadow-amber-900/20 hover:bg-amber-900 transition"
          >
            <span>Xem Sản Phẩm</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Danh sách Item trong Giỏ */}
          <div className="lg:col-span-2 space-y-4">
            {/* Thanh Chọn Tất Cả */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between text-xs font-semibold text-gray-700">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === items.length && items.length > 0
                  }
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-amber-800 focus:ring-amber-800"
                />
                <span>Chọn tất cả ({items.length} sản phẩm)</span>
              </label>
              <span className="text-gray-400">
                Đã chọn:{" "}
                <strong className="text-amber-800">{selectedIds.length}</strong>
              </span>
            </div>

            {/* Loop Items */}
            {items.map((item) => {
              const isChecked = selectedIds.includes(item.cartItemId);
              return (
                <div
                  key={item.cartItemId}
                  className={`bg-white p-4 sm:p-5 rounded-2xl border transition shadow-sm flex items-center space-x-4 ${
                    isChecked
                      ? "border-amber-800/40 bg-amber-50/10"
                      : "border-gray-100"
                  }`}
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleSelect(item.cartItemId)}
                    className="w-4 h-4 rounded border-gray-300 text-amber-800 focus:ring-amber-800 cursor-pointer"
                  />

                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border shrink-0">
                    <Image
                      src={item.productImage || "/placeholder-wood.jpg"}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <Link
                      href={`/products/${item.productId}`}
                      className="text-sm font-bold text-gray-900 truncate block hover:text-amber-800 transition"
                    >
                      {item.productName}
                    </Link>
                    <div className="text-xs font-bold text-amber-900">
                      {item.unitPrice.toLocaleString("vi-VN")} đ
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <button
                      disabled={isUpdating || item.quantity <= 1}
                      onClick={() =>
                        updateQuantity({
                          productId: item.productId,
                          quantity: item.quantity - 1,
                        })
                      }
                      className="p-1.5 hover:bg-gray-200 transition disabled:opacity-30"
                    >
                      <Minus className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                    <span className="px-3 text-xs font-bold text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      disabled={isUpdating}
                      onClick={() =>
                        updateQuantity({
                          productId: item.productId,
                          quantity: item.quantity + 1,
                        })
                      }
                      className="p-1.5 hover:bg-gray-200 transition disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-gray-900">
                      {item.totalPrice.toLocaleString("vi-VN")} đ
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    disabled={isRemoving}
                    onClick={() => removeItem(item.productId)}
                    className="p-2 text-gray-400 hover:text-red-600 transition"
                    title="Xóa khỏi giỏ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bảng Tóm Tắt Đơn Hàng */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit space-y-6">
            <h2 className="text-lg font-serif font-bold text-gray-900">
              Tóm Tắt Đơn Hàng
            </h2>

            <div className="space-y-3 text-xs border-b border-gray-100 pb-4">
              <div className="flex justify-between text-gray-600">
                <span>Sản phẩm đã chọn:</span>
                <span className="font-bold text-gray-800">
                  {selectedIds.length} món
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span className="font-semibold text-emerald-600">Miễn phí</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm font-bold text-gray-900">
              <span>Tổng tiền thanh toán:</span>
              <span className="text-xl text-amber-900">
                {selectedTotal.toLocaleString("vi-VN")} đ
              </span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              disabled={selectedIds.length === 0}
              className="w-full py-4 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-xl shadow-lg shadow-amber-900/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>Thanh Toán Cho Items Đã Chọn</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
