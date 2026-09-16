"use client";

import { useState } from "react";
import { useGetAdminOrders } from "@/src/hooks/useOrder";
import { OrderStatus, PaymentStatus, OrderDto } from "@/src/types";
import { OrderDetailModal } from "@/src/components/admin/OrderDetailModal";
import {
  Search,
  Filter,
  Eye,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("ALL");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("ALL");
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Parse filters sang kiểu query API
  const queryParams = {
    pageNumber,
    pageSize: 10,
    searchTerm: searchTerm || undefined,
    orderStatus:
      orderStatusFilter !== "ALL"
        ? (Number(orderStatusFilter) as OrderStatus)
        : undefined,
    paymentStatus:
      paymentStatusFilter !== "ALL"
        ? (Number(paymentStatusFilter) as PaymentStatus)
        : undefined,
  };

  const { data: response, isLoading } = useGetAdminOrders(queryParams);
  const pagedResult = response?.data;
  const orders: OrderDto[] = pagedResult?.items || [];
  const totalPages = pagedResult?.totalPages || 1;

  // Render Badge OrderStatus
  const renderOrderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
            <Clock className="w-3 h-3" />
            <span>Chờ xử lý</span>
          </span>
        );
      case OrderStatus.Shipping:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
            <Truck className="w-3 h-3" />
            <span>Đang giao</span>
          </span>
        );
      case OrderStatus.Delivered:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            <CheckCircle className="w-3 h-3" />
            <span>Đã giao</span>
          </span>
        );
      case OrderStatus.Cancelled:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
            <XCircle className="w-3 h-3" />
            <span>Đã hủy</span>
          </span>
        );
      default:
        return null;
    }
  };

  // Render Badge PaymentStatus
  const renderPaymentBadge = (status: PaymentStatus) => {
    return status === PaymentStatus.Paid ? (
      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block">
        Đã thanh toán
      </span>
    ) : (
      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 inline-block">
        Chưa thanh toán
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center space-x-2">
          <ShoppingBag className="w-5 h-5 text-amber-800 shrink-0" />
          <span>Quản Lý Đơn Hàng</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
          Danh sách toàn bộ đơn hàng khách hàng đã đặt trên hệ thống
        </p>
      </div>

      {/* Toolbar Filter & Search */}
      <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:space-x-4">
        {/* Input Tìm Kiếm */}
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo Mã đơn (OrderCode) / SĐT / Tên KH..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPageNumber(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800 outline-none"
          />
        </div>

        {/* Select Trạng thái */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
          <div className="col-span-2 sm:hidden flex items-center space-x-1 text-slate-400 text-xs font-medium pb-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Bộ lọc:</span>
          </div>
          <select
            value={orderStatusFilter}
            onChange={(e) => {
              setOrderStatusFilter(e.target.value);
              setPageNumber(1);
            }}
            className="w-full sm:w-auto p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none"
          >
            <option value="ALL">Tất cả đơn hàng</option>
            <option value={OrderStatus.Pending}>Chờ xử lý</option>
            <option value={OrderStatus.Shipping}>Đang giao</option>
            <option value={OrderStatus.Delivered}>Đã giao</option>
            <option value={OrderStatus.Cancelled}>Đã hủy</option>
          </select>

          <select
            value={paymentStatusFilter}
            onChange={(e) => {
              setPaymentStatusFilter(e.target.value);
              setPageNumber(1);
            }}
            className="w-full sm:w-auto p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none"
          >
            <option value="ALL">Tất cả thanh toán</option>
            <option value={PaymentStatus.Unpaid}>Chưa thanh toán</option>
            <option value={PaymentStatus.Paid}>Đã thanh toán</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 sm:p-6 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl w-full" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-xs text-slate-400">
            Không tìm thấy đơn hàng nào phù hợp
          </div>
        ) : (
          <>
            {/* 1. Mobile List View (Card Layout cho Màn hình nhỏ) */}
            <div className="block md:hidden divide-y divide-slate-100">
              {orders.map((order) => (
                <div key={order.orderId} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">
                        #
                        {order.orderCode ||
                          order.orderId.substring(0, 8).toUpperCase()}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div>{renderOrderStatusBadge(order.orderStatus)}</div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1">
                    <p className="text-slate-500 line-clamp-1">
                      <span className="font-medium text-slate-700">
                        Địa chỉ:{" "}
                      </span>
                      {order.shippingAddress || "N/A"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      {renderPaymentBadge(order.paymentStatus)}
                      <span className="text-[10px] text-slate-400 uppercase font-medium block mt-1">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">
                        Tổng tiền
                      </span>
                      <span className="font-bold text-amber-900 text-sm">
                        {order.totalAmount.toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOrderId(order.orderId)}
                    className="w-full mt-2 py-2 bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition border border-slate-200"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Xem & Chỉnh sửa</span>
                  </button>
                </div>
              ))}
            </div>

            {/* 2. Desktop Table View (Bảng truyền thống trên Màn hình lớn) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Mã Đơn Hàng</th>
                    <th className="p-4">Ngày Đặt</th>
                    <th className="p-4">Địa Chỉ Giao Hàng</th>
                    <th className="p-4">Thanh Toán</th>
                    <th className="p-4 text-right">Tổng Tiền</th>
                    <th className="p-4 text-center">Trạng Thái</th>
                    <th className="p-4 text-center">Thao Tác</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr
                      key={order.orderId}
                      className="hover:bg-slate-50/80 transition"
                    >
                      <td className="p-4 font-bold text-slate-900">
                        #
                        {order.orderCode ||
                          order.orderId.substring(0, 8).toUpperCase()}
                      </td>
                      <td className="p-4 text-slate-600">
                        {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="p-4 text-slate-600 max-w-xs truncate">
                        {order.shippingAddress || "N/A"}
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div>{renderPaymentBadge(order.paymentStatus)}</div>
                          <span className="text-[10px] text-slate-400 uppercase font-medium block">
                            {order.paymentMethod}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-bold text-amber-900">
                        {order.totalAmount.toLocaleString("vi-VN")} đ
                      </td>
                      <td className="p-4 text-center">
                        {renderOrderStatusBadge(order.orderStatus)}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setSelectedOrderId(order.orderId)}
                          className="p-2 text-slate-500 hover:text-amber-800 hover:bg-amber-50 rounded-xl transition"
                          title="Xem & Chỉnh sửa"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-3 sm:p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Trang <strong>{pageNumber}</strong> /{" "}
              <strong>{totalPages}</strong>
            </span>
            <div className="flex items-center space-x-1">
              <button
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber((p) => p - 1)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pageNumber >= totalPages}
                onClick={() => setPageNumber((p) => p + 1)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Chi Tiết Đơn Hàng */}
      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
}
