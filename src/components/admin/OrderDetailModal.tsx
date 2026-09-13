"use client";

import { useState, useEffect } from "react";
import { OrderDto, OrderStatus, PaymentStatus } from "@/src/types";
import {
  useGetAdminOrderById,
  useUpdateOrderStatus,
} from "@/src/hooks/useOrder";
import {
  X,
  Package,
  User,
  MapPin,
  CreditCard,
  Clock,
  Loader2,
  CheckCircle2,
  Truck,
  XCircle,
} from "lucide-react";

interface OrderDetailModalProps {
  orderId: string | null;
  onClose: () => void;
}

export const OrderDetailModal = ({
  orderId,
  onClose,
}: OrderDetailModalProps) => {
  const { data: response, isLoading } = useGetAdminOrderById(orderId || "");
  const updateStatusMutation = useUpdateOrderStatus();

  const order: OrderDto | undefined = response?.data;

  const [selectedOrderStatus, setSelectedOrderStatus] = useState<OrderStatus>(
    OrderStatus.Pending,
  );
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState<PaymentStatus>(PaymentStatus.Unpaid);

  useEffect(() => {
    if (order) {
      setSelectedOrderStatus(order.orderStatus);
      setSelectedPaymentStatus(order.paymentStatus);
    }
  }, [order]);

  if (!orderId) return null;

  const handleSave = () => {
    updateStatusMutation.mutate(
      {
        id: orderId,
        data: {
          orderStatus: Number(selectedOrderStatus),
          paymentStatus: Number(selectedPaymentStatus),
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <span>Đơn Hàng #{orderId.substring(0, 8).toUpperCase()}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chi tiết và thiết lập trạng thái cho đơn hàng
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {isLoading || !order ? (
            <div className="py-12 flex items-center justify-center text-slate-400 space-x-2 text-xs">
              <Loader2 className="w-5 h-5 animate-spin text-amber-800" />
              <span>Đang tải thông tin đơn hàng...</span>
            </div>
          ) : (
            <>
              {/* Thông tin chung */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <User className="w-4 h-4 text-amber-800" />
                    <span>Thông Tin Khách Hàng</span>
                  </div>
                  <div className="text-slate-600">
                    <p>Mã KH: {order.userId}</p>
                    <p className="mt-1 flex items-start space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>
                        {order.shippingAddress || "Chưa cập nhật địa chỉ"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <CreditCard className="w-4 h-4 text-amber-800" />
                    <span>Thanh Toán & Thời Gian</span>
                  </div>
                  <div className="text-slate-600 space-y-1">
                    <p>
                      Hình thức:{" "}
                      <strong className="text-slate-700">
                        {order.paymentMethod}
                      </strong>
                    </p>
                    <p>
                      Ngày đặt:{" "}
                      <strong className="text-slate-700">
                        {new Date(order.orderDate).toLocaleString("vi-VN")}
                      </strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Danh sách sản phẩm trong đơn */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Package className="w-4 h-4 text-amber-800" />
                  <span>Danh Sách Sản Phẩm</span>
                </h3>
                <div className="border border-slate-200/80 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="p-3 font-semibold">Sản phẩm</th>
                        <th className="p-3 font-semibold text-center">
                          Đơn giá
                        </th>
                        <th className="p-3 font-semibold text-center">
                          Số lượng
                        </th>
                        <th className="p-3 font-semibold text-right">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {order.orderDetails?.map((item) => (
                        <tr
                          key={item.orderDetailId}
                          className="hover:bg-slate-50/50"
                        >
                          <td className="p-3 font-medium text-slate-800">
                            {item.productName}
                          </td>
                          <td className="p-3 text-center text-slate-600">
                            {item.unitPrice.toLocaleString("vi-VN")} đ
                          </td>
                          <td className="p-3 text-center text-slate-800 font-bold">
                            {item.quantity}
                          </td>
                          <td className="p-3 text-right font-bold text-amber-900">
                            {item.totalPrice.toLocaleString("vi-VN")} đ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-600">Tổng cộng đơn hàng:</span>
                    <span className="text-sm text-amber-900">
                      {order.totalAmount.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Cập nhật Trạng Thái */}
              <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/30 space-y-4">
                <h3 className="text-xs font-bold text-amber-950">
                  Cập Nhật Trạng Thái Đơn Hàng
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select OrderStatus */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600 block">
                      Trạng Thái Giao Hàng
                    </label>
                    <select
                      value={selectedOrderStatus}
                      onChange={(e) =>
                        setSelectedOrderStatus(
                          Number(e.target.value) as OrderStatus,
                        )
                      }
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800 outline-none"
                    >
                      <option value={OrderStatus.Pending}>Chờ xử lý</option>
                      <option value={OrderStatus.Shipping}>Đang giao</option>
                      <option value={OrderStatus.Delivered}>Đã giao</option>
                      <option value={OrderStatus.Cancelled}>Đã hủy</option>
                    </select>
                  </div>

                  {/* Select PaymentStatus */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600 block">
                      Trạng Thái Thanh Toán
                    </label>
                    <select
                      value={selectedPaymentStatus}
                      onChange={(e) =>
                        setSelectedPaymentStatus(
                          Number(e.target.value) as PaymentStatus,
                        )
                      }
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800 outline-none"
                    >
                      <option value={PaymentStatus.Unpaid}>
                        Chưa thanh toán
                      </option>
                      <option value={PaymentStatus.Paid}>Đã thanh toán</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition"
          >
            Đóng
          </button>
          <button
            onClick={handleSave}
            disabled={updateStatusMutation.isPending || isLoading}
            className="px-4 py-2 text-xs font-semibold bg-amber-800 text-white hover:bg-amber-900 rounded-xl transition flex items-center space-x-1.5 disabled:opacity-50"
          >
            {updateStatusMutation.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <span>Cập Nhật Đơn Hàng</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
