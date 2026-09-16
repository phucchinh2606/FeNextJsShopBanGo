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

  const getItemUniqueId = (item: any) =>
    (item.cartItemId || item.id || item.productId || "").toString();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (items.length > 0 && selectedIds.length === 0) {
      setSelectedIds(items.map((item) => getItemUniqueId(item)));
    }
  }, [items]);

  const handleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((item) => getItemUniqueId(item)));
    }
  };

  const handleToggleSelect = (item: any) => {
    const id = getItemUniqueId(item);
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemKey) => itemKey !== id)
        : [...prev, id],
    );
  };

  const selectedItems = items.filter((item) =>
    selectedIds.includes(getItemUniqueId(item)),
  );
  const selectedTotal = selectedItems.reduce(
    (acc, item) => acc + item.totalPrice,
    0,
  );

  const handleProceedToCheckout = () => {
    if (selectedIds.length === 0) return;
    const queryString = new URLSearchParams({
      items: selectedIds.join(","),
    }).toString();
    router.push(`/checkout?${queryString}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 py-10 sm:py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-28 bg-gray-200 rounded-2xl" />
          <div className="h-28 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 lg:pb-10">
      <h1 className="text-xl sm:text-3xl font-serif font-bold text-gray-900 mb-4 sm:mb-6">
        Giỏ Hàng Của Bạn
      </h1>

      {items.length === 0 ? (
        <div className="bg-white p-8 sm:p-12 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm text-center space-y-4">
          <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto" />
          <h2 className="text-base sm:text-lg font-bold text-gray-800">
            Giỏ hàng đang trống
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Hãy khám phá các sản phẩm gỗ mỹ nghệ cao cấp và thêm vào giỏ hàng
            nhé.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-amber-800 text-white font-semibold text-xs rounded-xl shadow-lg shadow-amber-900/20 hover:bg-amber-900 transition"
          >
            <span>Xem Sản Phẩm</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Danh sách Item trong Giỏ */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {/* Thanh Chọn Tất Cả */}
            <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between text-xs font-semibold text-gray-700">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === items.length && items.length > 0
                  }
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-amber-800 focus:ring-amber-800 cursor-pointer"
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
              const uniqueId = getItemUniqueId(item);
              const isChecked = selectedIds.includes(uniqueId);
              return (
                <div
                  key={uniqueId}
                  className={`bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border transition shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 ${
                    isChecked
                      ? "border-amber-800/40 bg-amber-50/10"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleSelect(item)}
                      className="w-4 h-4 rounded border-gray-300 text-amber-800 focus:ring-amber-800 cursor-pointer shrink-0"
                    />

                    {/* Image */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden bg-gray-50 border shrink-0">
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
                        className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 hover:text-amber-800 transition"
                      >
                        {item.productName}
                      </Link>
                      <div className="text-xs font-bold text-amber-900">
                        {item.unitPrice.toLocaleString("vi-VN")} đ
                      </div>
                    </div>
                  </div>

                  {/* Thanh điều khiển phụ (Mobile: Hàng dưới | Desktop: Cột bên) */}
                  <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
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
                        className="p-1 sm:p-1.5 hover:bg-gray-200 transition disabled:opacity-30"
                      >
                        <Minus className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                      <span className="px-2.5 sm:px-3 text-xs font-bold text-gray-800">
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
                        className="p-1 sm:p-1.5 hover:bg-gray-200 transition disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                    </div>

                    {/* Subtotal Desktop */}
                    <div className="text-right min-w-[90px]">
                      <div className="text-xs font-bold text-gray-900">
                        {item.totalPrice.toLocaleString("vi-VN")} đ
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      disabled={isRemoving}
                      onClick={() => removeItem(item.productId)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition"
                      title="Xóa khỏi giỏ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bảng Tóm Tắt Đơn Hàng (Desktop) */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm h-fit space-y-5 sm:space-y-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-gray-900">
              Tóm Tắt Đơn Hàng
            </h2>

            <div className="space-y-2.5 text-xs border-b border-gray-100 pb-4">
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

            <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-gray-900">
              <span>Tổng thanh toán:</span>
              <span className="text-lg sm:text-xl text-amber-900">
                {selectedTotal.toLocaleString("vi-VN")} đ
              </span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              disabled={selectedIds.length === 0}
              className="hidden lg:flex w-full py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-xl shadow-lg shadow-amber-900/20 transition items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>Thanh Toán Cho Items Đã Chọn</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Thanh Thanh Toán Cố Định Đáy Màn Hình (Chỉ hiển thị trên Mobile) */}
      {items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-2xl z-40 flex items-center justify-between space-x-3">
          <div>
            <span className="text-[10px] text-gray-500 block">
              Tổng tiền ({selectedIds.length} món):
            </span>
            <span className="text-base font-bold text-amber-900">
              {selectedTotal.toLocaleString("vi-VN")} đ
            </span>
          </div>
          <button
            onClick={handleProceedToCheckout}
            disabled={selectedIds.length === 0}
            className="px-5 py-3 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5 disabled:opacity-50 shrink-0"
          >
            <span>Thanh toán</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
