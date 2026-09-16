"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useGetCart } from "@/src/hooks/useCart";
import { useCreateOrder } from "@/src/hooks/useOrder";
import { PaymentMethod } from "@/src/types";
import {
  MapPin,
  Phone,
  FileText,
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  Truck,
  Loader2,
} from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemIdsString = searchParams.get("items") || "";
  const selectedCartItemIds = itemIdsString ? itemIdsString.split(",") : [];

  const { data: cartResponse, isLoading: isCartLoading } = useGetCart();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();

  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.COD,
  );
  const [errorMsg, setErrorMsg] = useState("");

  const cart = cartResponse?.data;
  const allItems = cart?.items || [];

  const checkoutItems = allItems.filter((item) => {
    const currentItemId = (
      item.cartItemId ||
      (item as any).id ||
      item.productId ||
      ""
    )
      .toString()
      .toLowerCase();

    return selectedCartItemIds.some(
      (selectedId) => selectedId.trim().toLowerCase() === currentItemId,
    );
  });

  const totalAmount = checkoutItems.reduce(
    (acc, item) => acc + item.totalPrice,
    0,
  );

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.trim() || !phoneNumber.trim()) {
      setErrorMsg("Vui lòng điền đầy đủ địa chỉ giao hàng và số điện thoại.");
      return;
    }

    if (checkoutItems.length === 0) {
      setErrorMsg("Không tìm thấy sản phẩm nào được chọn để thanh toán.");
      return;
    }

    setErrorMsg("");

    createOrder(
      {
        shippingAddress,
        phoneNumber,
        note,
        paymentMethod,
        selectedCartItemIds,
      },
      {
        onSuccess: (res) => {
          const orderData = res?.data;
          if (orderData?.paymentUrl) {
            window.location.href = orderData.paymentUrl;
          } else {
            router.push(`/orders/${orderData?.orderId || ""}?success=true`);
          }
        },
        onError: (err: any) => {
          setErrorMsg(
            err?.response?.data?.message ||
              "Đặt hàng thất bại. Vui lòng thử lại!",
          );
        },
      },
    );
  };

  if (isCartLoading) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 py-10 sm:py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 lg:pb-10">
      <Link
        href="/cart"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-amber-800 mb-4 sm:mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại giỏ hàng</span>
      </Link>

      <h1 className="text-xl sm:text-3xl font-serif font-bold text-gray-900 mb-6">
        Thanh Toán Đơn Hàng
      </h1>

      {errorMsg && (
        <div className="p-3.5 mb-6 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl sm:rounded-2xl">
          {errorMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmitOrder}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
      >
        {/* Cột Trái: Thông tin người nhận & Thanh toán */}
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          {/* 1. Thông tin người nhận */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base sm:text-lg font-serif font-bold text-gray-900 flex items-center space-x-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-800" />
              <span>Thông Tin Nhận Hàng</span>
            </h2>

            <div className="space-y-3.5 sm:space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Số điện thoại nhận hàng{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="0912345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Địa chỉ giao hàng chi tiết{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full p-3 text-xs sm:text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ghi chú đơn hàng (Tùy chọn)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Lưu ý cho người giao hàng, khung giờ nhận hàng..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Phương thức thanh toán */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base sm:text-lg font-serif font-bold text-gray-900 flex items-center space-x-2">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-amber-800" />
              <span>Phương Thức Thanh Toán</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* COD */}
              <label
                onClick={() => setPaymentMethod(PaymentMethod.COD)}
                className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border cursor-pointer transition flex items-center space-x-3 ${
                  paymentMethod === PaymentMethod.COD
                    ? "border-amber-800 bg-amber-50/20 ring-1 ring-amber-800"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-amber-800 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-gray-900 block">
                    Thanh toán COD
                  </span>
                  <span className="text-[10px] text-gray-500">
                    Trả tiền mặt khi nhận hàng
                  </span>
                </div>
              </label>

              {/* PayOS */}
              <label
                onClick={() => setPaymentMethod(PaymentMethod.PayOS)}
                className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border cursor-pointer transition flex items-center space-x-3 ${
                  paymentMethod === PaymentMethod.PayOS
                    ? "border-amber-800 bg-amber-50/20 ring-1 ring-amber-800"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-gray-900 block">
                    Chuyển khoản VietQR (payOS)
                  </span>
                  <span className="text-[10px] text-gray-500">
                    Quét mã QR bằng App Ngân Hàng (Duyệt tự động)
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Cột Phải: Danh sách sản phẩm & Xác nhận */}
        <div className="space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm space-y-5 sm:space-y-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-gray-900">
              Sản Phẩm Thanh Toán ({checkoutItems.length})
            </h2>

            {/* Món Hàng */}
            <div className="space-y-3 max-h-60 sm:max-h-80 overflow-y-auto pr-1 divide-y divide-gray-100">
              {checkoutItems.map((item) => (
                <div
                  key={item.cartItemId || (item as any).id || item.productId}
                  className="pt-3 first:pt-0 flex items-center space-x-3"
                >
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden bg-gray-50 border shrink-0">
                    <Image
                      src={item.productImage || "/placeholder-wood.jpg"}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-gray-800 truncate">
                      {item.productName}
                    </h3>
                    <span className="text-[10px] sm:text-[11px] text-gray-500 block">
                      Số lượng: {item.quantity}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-900 shrink-0">
                    {item.totalPrice.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              ))}
            </div>

            {/* Bảng Chi Phí */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span className="font-semibold text-gray-900">
                  {totalAmount.toLocaleString("vi-VN")} đ
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí giao hàng:</span>
                <span className="font-semibold text-emerald-600">Miễn phí</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm font-bold text-gray-900 pt-2 border-t">
                <span>Tổng cộng:</span>
                <span className="text-base sm:text-lg text-amber-900">
                  {totalAmount.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>

            {/* Desktop Submit Button */}
            <button
              type="submit"
              disabled={isCreatingOrder || checkoutItems.length === 0}
              className="hidden lg:flex w-full py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-xl shadow-lg shadow-amber-900/20 transition items-center justify-center space-x-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isCreatingOrder ? "Đang xử lý..." : "Đặt Hàng ngay"}</span>
            </button>
          </div>
        </div>

        {/* Floating Bottom Bar cho Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-2xl z-40 flex items-center justify-between space-x-3">
          <div>
            <span className="text-[10px] text-gray-500 block">
              Tổng thanh toán:
            </span>
            <span className="text-base font-bold text-amber-900">
              {totalAmount.toLocaleString("vi-VN")} đ
            </span>
          </div>
          <button
            type="submit"
            disabled={isCreatingOrder || checkoutItems.length === 0}
            className="px-5 py-3 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5 disabled:opacity-50 shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isCreatingOrder ? "Đang xử lý..." : "Đặt Hàng ngay"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
          <Loader2 className="w-8 h-8 text-amber-800 animate-spin" />
          <p className="text-xs font-semibold text-amber-900">
            Đang tải trang thanh toán...
          </p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
