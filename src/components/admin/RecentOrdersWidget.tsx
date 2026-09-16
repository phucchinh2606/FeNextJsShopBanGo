"use client";

import Link from "next/link";
import { RecentOrderDto, OrderStatus, PaymentStatus } from "@/src/types";
import {
  ArrowRight,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface RecentOrdersWidgetProps {
  orders?: RecentOrderDto[];
  isLoading?: boolean;
}

export const RecentOrdersWidget = ({
  orders = [],
  isLoading,
}: RecentOrdersWidgetProps) => {
  const renderOrderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return (
          <span className="inline-flex items-center space-x-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
            <span>Chờ xử lý</span>
          </span>
        );
      case OrderStatus.Shipping:
        return (
          <span className="inline-flex items-center space-x-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
            <span>Đang giao</span>
          </span>
        );
      case OrderStatus.Delivered:
        return (
          <span className="inline-flex items-center space-x-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
            <span>Đã giao</span>
          </span>
        );
      case OrderStatus.Cancelled:
        return (
          <span className="inline-flex items-center space-x-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
            <span>Đã hủy</span>
          </span>
        );
      default:
        return null;
    }
  };

  const renderPaymentBadge = (status: PaymentStatus) => {
    return status === PaymentStatus.Paid ? (
      <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
        Đã TT
      </span>
    ) : (
      <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
        Chưa TT
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-40 bg-slate-200 rounded animate-pulse" />
        <div className="border border-slate-100 rounded-2xl bg-white p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex justify-between items-center animate-pulse"
            >
              <div className="space-y-2 w-1/2">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
              <div className="h-6 bg-slate-200 rounded w-1/4" />
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
          <ShoppingBag className="w-4 h-4 text-amber-800 shrink-0" />
          <span>Đơn Hàng Gần Đây</span>
        </h2>
        <Link
          href="/admin/orders"
          className="text-[11px] sm:text-xs font-semibold text-amber-800 hover:text-amber-900 hover:underline flex items-center space-x-1 transition"
        >
          <span>Quản lý đơn hàng</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-sm">
        {orders.length === 0 ? (
          <div className="p-6 sm:p-8 text-center text-xs text-slate-400">
            Chưa có đơn hàng mới nào phát sinh
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.orderId}
              className="p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 hover:bg-slate-50/80 transition text-xs"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/orders?id=${order.orderId}`}
                    className="font-bold text-slate-800 hover:text-amber-800 transition truncate"
                  >
                    #{order.orderId.substring(0, 8).toUpperCase()}
                  </Link>
                  <span className="text-slate-300">•</span>
                  <span className="font-medium text-slate-700 truncate">
                    {order.customerName}
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 flex items-center flex-wrap gap-1.5 sm:gap-2">
                  <span>
                    {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                  </span>
                  <span>•</span>
                  <span>{order.totalItems} sản phẩm</span>
                  <span>•</span>
                  {renderPaymentBadge(order.paymentStatus)}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start shrink-0 pt-1 sm:pt-0 border-t sm:border-0 border-slate-50">
                <div className="font-bold text-slate-900 text-xs sm:text-sm">
                  {order.totalAmount.toLocaleString("vi-VN")} đ
                </div>
                <div>{renderOrderStatusBadge(order.orderStatus)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
