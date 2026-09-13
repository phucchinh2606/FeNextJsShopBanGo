"use client";

import { use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/src/components/client/Header";
import { Footer } from "@/src/components/client/Footer";
import { useGetOrderById } from "@/src/hooks/useOrder";
import { OrderStatus, PaymentStatus, OrderDto } from "@/src/types";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  PackageCheck,
} from "lucide-react";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const isSuccessRedirect = searchParams.get("success") === "true";

  const { data: orderResponse, isLoading } = useGetOrderById(id);
  const order: OrderDto | undefined = orderResponse?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-64 bg-gray-200 rounded-3xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-16 text-center space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            Không tìm thấy đơn hàng
          </h2>
          <Link
            href="/orders"
            className="inline-block px-6 py-2.5 bg-amber-800 text-white text-xs font-semibold rounded-xl"
          >
            Quay lại danh sách đơn hàng
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Banner Đặt hàng thành công */}
        {isSuccessRedirect && (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl flex items-center space-x-4">
            <PackageCheck className="w-10 h-10 text-emerald-600 shrink-0" />
            <div>
              <h2 className="text-base font-bold text-emerald-900">
                Đặt hàng thành công!
              </h2>
              <p className="text-xs text-emerald-700 mt-0.5">
                Cảm ơn bạn đã tin tưởng mua sắm đồ gỗ tại store. Chúng tôi sẽ
                sớm liên hệ xác nhận và giao hàng.
              </p>
            </div>
          </div>
        )}

        <Link
          href="/orders"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-500 hover:text-amber-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách đơn hàng</span>
        </Link>

        {/* Chi tiết Đơn Hàng */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-8">
          {/* Top Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900">
                Mã Đơn: #{order.orderId.substring(0, 8).toUpperCase()}
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Ngày đặt: {new Date(order.orderDate).toLocaleString("vi-VN")}
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="bg-gray-50 p-4 rounded-2xl space-y-2 border border-gray-100">
              <div className="flex items-center space-x-2 font-bold text-gray-900">
                <MapPin className="w-4 h-4 text-amber-800" />
                <span>Thông Tin Nhận Hàng</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {order.shippingAddress}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl space-y-2 border border-gray-100">
              <div className="flex items-center space-x-2 font-bold text-gray-900">
                <CreditCard className="w-4 h-4 text-amber-800" />
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
                  {order.paymentStatus === PaymentStatus.Paid
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </span>
              </p>
            </div>
          </div>

          {/* Table Items */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-900">
              Danh sách sản phẩm
            </h2>
            <div className="divide-y divide-gray-100">
              {order.orderDetails.map((item) => (
                <div
                  key={item.orderDetailId}
                  className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs"
                >
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {item.productName}
                    </h3>
                    <p className="text-gray-400">
                      Đơn giá: {item.unitPrice.toLocaleString("vi-VN")} đ x{" "}
                      {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-amber-900">
                    {item.totalPrice.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total amount */}
          <div className="border-t border-gray-100 pt-6 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-700">
              Tổng Thành Tiền:
            </span>
            <span className="text-2xl font-serif font-bold text-amber-900">
              {order.totalAmount.toLocaleString("vi-VN")} đ
            </span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
