"use client";

import { use, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useConfirmPayOSPayment, useGetOrderById } from "@/src/hooks/useOrder";
import { OrderStatus, PaymentStatus, OrderDto } from "@/src/types";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  PackageCheck,
  Loader2,
} from "lucide-react";

function OrderDetailContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const isSuccessRedirect = searchParams.get("success") === "true";
  const isPayOSPaymentSuccessful =
    searchParams.get("code") === "00" && searchParams.get("status") === "PAID";

  const { data: orderResponse, isLoading } = useGetOrderById(
    id,
    isSuccessRedirect,
  );
  const { mutate: confirmPayOSPayment } = useConfirmPayOSPayment();
  const order: OrderDto | undefined = orderResponse?.data;

  useEffect(() => {
    if (isSuccessRedirect && id) {
      confirmPayOSPayment(id);
    }
  }, [confirmPayOSPayment, id, isSuccessRedirect]);

  if (isLoading) {
    return (
      <div className="max-w-4xl w-full mx-auto px-4 py-12 sm:py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded-2xl sm:rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl w-full mx-auto px-4 py-16 sm:py-20 text-center space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          Không tìm thấy đơn hàng
        </h2>
        <Link
          href="/orders"
          className="inline-block px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-xl transition"
        >
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-5 sm:space-y-6">
      {/* Banner Đặt hàng thành công */}
      {isSuccessRedirect && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex items-start sm:items-center space-x-3.5 sm:space-x-4">
          <PackageCheck className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <h2 className="text-sm sm:text-base font-bold text-emerald-900">
              Đặt hàng thành công!
            </h2>
            <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
              Cảm ơn bạn đã tin tưởng mua sắm đồ gỗ tại store. Chúng tôi sẽ sớm
              liên hệ xác nhận và giao hàng.
            </p>
          </div>
        </div>
      )}

      <Link
        href="/orders"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-amber-800 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại danh sách đơn hàng</span>
      </Link>

      {/* Chi tiết Đơn Hàng */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-8 space-y-6 sm:space-y-8">
        {/* Top Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4 sm:pb-6">
          <div>
            <h1 className="text-lg sm:text-2xl font-serif font-bold text-gray-900">
              Mã Đơn: #
              {order.orderCode || order.orderId.substring(0, 8).toUpperCase()}
            </h1>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
              Ngày đặt: {new Date(order.orderDate).toLocaleString("vi-VN")}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs self-start sm:self-center bg-gray-50 px-3 py-1.5 sm:p-0 rounded-lg sm:bg-transparent">
            <span className="text-gray-500">Trạng thái:</span>
            <span className="font-bold text-amber-900">
              {order.orderStatus === OrderStatus.Pending && "Đang chờ xử lý"}
              {order.orderStatus === OrderStatus.Shipping && "Đang giao hàng"}
              {order.orderStatus === OrderStatus.Delivered && "Đã giao hàng"}
              {order.orderStatus === OrderStatus.Cancelled && "Đã hủy"}
            </span>
          </div>
        </div>

        {/* Giao hàng & Thanh toán */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-xs">
          <div className="bg-gray-50 p-4 rounded-xl sm:rounded-2xl space-y-1.5 sm:space-y-2 border border-gray-100">
            <div className="flex items-center space-x-2 font-bold text-gray-900">
              <MapPin className="w-4 h-4 text-amber-800 shrink-0" />
              <span>Thông Tin Nhận Hàng</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {order.shippingAddress}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl sm:rounded-2xl space-y-1.5 sm:space-y-2 border border-gray-100">
            <div className="flex items-center space-x-2 font-bold text-gray-900">
              <CreditCard className="w-4 h-4 text-amber-800 shrink-0" />
              <span>Thanh Toán</span>
            </div>
            <p className="text-gray-600">
              Phương thức: <strong>{order.paymentMethod}</strong>
            </p>
            <p className="text-gray-600">
              Trạng thái:{" "}
              <span
                className={`font-semibold ${
                  order.paymentStatus === PaymentStatus.Paid
                    ? "text-emerald-600"
                    : "text-amber-700"
                }`}
              >
                {order.paymentStatus === PaymentStatus.Paid ||
                isPayOSPaymentSuccessful
                  ? "Đã thanh toán"
                  : isSuccessRedirect
                    ? "Đang xác nhận thanh toán..."
                    : "Chưa thanh toán"}
              </span>
            </p>
          </div>
        </div>

        {/* Table Items */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-xs sm:text-sm font-bold text-gray-900">
            Danh sách sản phẩm ({order.orderDetails.length})
          </h2>
          <div className="divide-y divide-gray-100">
            {order.orderDetails.map((item) => (
              <div
                key={item.orderDetailId}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs gap-3"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900 truncate">
                    {item.productName}
                  </h3>
                  <p className="text-gray-400 text-[11px] sm:text-xs">
                    Đơn giá: {item.unitPrice.toLocaleString("vi-VN")} đ x{" "}
                    {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-amber-900 shrink-0">
                  {item.totalPrice.toLocaleString("vi-VN")} đ
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total amount */}
        <div className="border-t border-gray-100 pt-4 sm:pt-6 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-700">
            Tổng Thành Tiền:
          </span>
          <span className="text-xl sm:text-2xl font-serif font-bold text-amber-900">
            {order.totalAmount.toLocaleString("vi-VN")} đ
          </span>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
          <Loader2 className="w-8 h-8 text-amber-800 animate-spin" />
          <p className="text-xs font-semibold text-amber-900">
            Đang tải chi tiết đơn hàng...
          </p>
        </div>
      }
    >
      <OrderDetailContent id={id} />
    </Suspense>
  );
}
