"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetMyOrders, useCancelOrder } from "@/src/hooks/useOrder";
import { OrderStatus, OrderDto } from "@/src/types";
import {
  Package,
  Eye,
  XCircle,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from "lucide-react";

export default function MyOrdersPage() {
  const { data: ordersResponse, isLoading } = useGetMyOrders();
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  const orders: OrderDto[] = ordersResponse?.data || [];

  // Filter state
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Modal Cancel State
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null,
  );
  const [cancelReason, setCancelReason] = useState("");

  // Lọc danh sách theo status
  const filteredOrders = orders.filter((order) => {
    if (selectedStatus === "ALL") return true;
    return order.orderStatus === Number(selectedStatus);
  });

  const handleConfirmCancel = () => {
    if (!cancellingOrderId) return;
    cancelOrder(
      { id: cancellingOrderId, data: { cancelReason } },
      {
        onSuccess: () => {
          setCancellingOrderId(null);
          setCancelReason("");
        },
      },
    );
  };

  // Helper render status badge
  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Đang chờ xử lý</span>
          </span>
        );
      case OrderStatus.Shipping:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
            <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Đang giao hàng</span>
          </span>
        );
      case OrderStatus.Delivered:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Đã giao thành công</span>
          </span>
        );
      case OrderStatus.Cancelled:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
            <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Đã hủy</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-serif font-bold text-gray-900">
            Đơn Hàng Của Tôi
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Theo dõi lịch sử và trạng thái các đơn hàng đồ gỗ mỹ nghệ
          </p>
        </div>

        {/* Bộ lọc trạng thái (Cuộn ngang linh hoạt trên Mobile) */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1 md:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { label: "Tất cả", value: "ALL" },
            { label: "Đang xử lý", value: OrderStatus.Pending.toString() },
            { label: "Đang giao", value: OrderStatus.Shipping.toString() },
            { label: "Đã giao", value: OrderStatus.Delivered.toString() },
            { label: "Đã hủy", value: OrderStatus.Cancelled.toString() },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition shrink-0 ${
                selectedStatus === tab.value
                  ? "bg-amber-800 text-white shadow-md shadow-amber-900/10"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Nội dung danh sách */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-36 sm:h-40 bg-gray-200 rounded-2xl sm:rounded-3xl animate-pulse"
            />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-8 sm:p-12 rounded-2xl sm:rounded-3xl border border-gray-100 text-center space-y-4">
          <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto" />
          <h2 className="text-base sm:text-lg font-bold text-gray-800">
            Không tìm thấy đơn hàng
          </h2>
          <p className="text-xs text-gray-500">
            Bạn chưa có đơn hàng nào thuộc trạng thái này.
          </p>
          <Link
            href="/products"
            className="inline-block px-5 py-2.5 bg-amber-800 text-white text-xs font-semibold rounded-xl hover:bg-amber-900 transition"
          >
            Mua Sắm Ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6 space-y-4"
            >
              {/* Header card */}
              <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-0.5 sm:gap-0">
                  <span className="font-bold text-gray-900">
                    Đơn hàng #
                    {order.orderCode ||
                      order.orderId.substring(0, 8).toUpperCase()}
                  </span>
                  <span className="text-gray-400 flex items-center space-x-1 text-[11px] sm:text-xs">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>
                      {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                    </span>
                  </span>
                </div>
                <div>{renderStatusBadge(order.orderStatus)}</div>
              </div>

              {/* Items preview */}
              <div className="space-y-2.5">
                {order.orderDetails.map((detail) => (
                  <div
                    key={detail.orderDetailId}
                    className="flex items-center justify-between text-xs gap-2"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-800 shrink-0" />
                      <span className="font-semibold text-gray-800 truncate">
                        {detail.productName}
                      </span>
                      <span className="text-gray-400 shrink-0">
                        x{detail.quantity}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 shrink-0">
                      {detail.totalPrice.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer card */}
              <div className="border-t border-gray-100 pt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center justify-between sm:justify-start sm:space-x-2">
                  <span className="text-gray-500">Tổng tiền thanh toán:</span>
                  <strong className="text-sm sm:text-base font-bold text-amber-900">
                    {order.totalAmount.toLocaleString("vi-VN")} đ
                  </strong>
                </div>

                <div className="flex items-center space-x-2.5 w-full sm:w-auto">
                  <Link
                    href={`/orders/${order.orderId}`}
                    className="flex-1 sm:flex-none justify-center px-4 py-2 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center space-x-1 text-center"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Chi Tiết</span>
                  </Link>

                  {/* Chỉ cho phép Hủy khi đơn ở trạng thái Pending */}
                  {order.orderStatus === OrderStatus.Pending && (
                    <button
                      onClick={() => setCancellingOrderId(order.orderId)}
                      className="flex-1 sm:flex-none justify-center px-4 py-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold hover:bg-rose-100 transition flex items-center space-x-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Hủy Đơn</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Xác Nhận Hủy Đơn */}
      {cancellingOrderId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center space-x-2.5 text-rose-600">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                Xác nhận hủy đơn hàng
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không
              thể hoàn tác.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Lý do hủy (Không bắt buộc)
              </label>
              <textarea
                rows={3}
                placeholder="Nhập lý do hủy đơn..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2.5 text-xs font-semibold pt-1">
              <button
                disabled={isCancelling}
                onClick={() => {
                  setCancellingOrderId(null);
                  setCancelReason("");
                }}
                className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition"
              >
                Quay lại
              </button>
              <button
                disabled={isCancelling}
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition shadow-md shadow-rose-600/20 disabled:opacity-50"
              >
                {isCancelling ? "Đang xử lý..." : "Xác nhận Hủy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
