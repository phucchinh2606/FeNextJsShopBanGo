import axiosClient from "./axiosClient";
import {
  ApiResponse,
  CancelOrderCommand,
  CreateOrderCommand,
  GetAdminOrdersQuery,
  OrderDto,
  PagedResult,
  UpdateOrderStatusCommand,
} from "../types";

export const orderService = {
  // --- CLIENT ENDPOINTS (/api/Order) ---

  // POST: /api/Order/checkout (Tạo đơn hàng)
  createOrder: async (
    data: CreateOrderCommand,
  ): Promise<ApiResponse<OrderDto>> => {
    return await axiosClient.post("/Order/checkout", data);
  },

  // GET: /api/Order/my-orders (Lấy đơn hàng cá nhân)
  getMyOrders: async (): Promise<ApiResponse<OrderDto[]>> => {
    return await axiosClient.get("/Order/my-orders");
  },

  // GET: /api/Order/{id} (Chi tiết đơn hàng phía Client)
  getOrderById: async (id: string): Promise<ApiResponse<OrderDto>> => {
    return await axiosClient.get(`/Order/${id}`);
  },

  // PUT: /api/Order/{id}/cancel (Khách hàng hủy đơn)
  cancelOrder: async (
    id: string,
    data?: CancelOrderCommand,
  ): Promise<ApiResponse<OrderDto>> => {
    return await axiosClient.put(`/Order/${id}/cancel`, data || {});
  },

  // --- ADMIN ENDPOINTS (/api/admin/orders) ---

  // GET: /api/admin/orders (Lấy danh sách đơn hàng toàn hệ thống)
  getAdminOrders: async (
    params?: GetAdminOrdersQuery,
  ): Promise<ApiResponse<PagedResult<OrderDto>>> => {
    return await axiosClient.get("/admin/orders", { params });
  },

  // GET: /api/admin/orders/{id} (Admin xem chi tiết bất kỳ đơn hàng nào)
  getAdminOrderById: async (id: string): Promise<ApiResponse<OrderDto>> => {
    return await axiosClient.get(`/admin/orders/${id}`);
  },

  // PUT: /api/admin/orders/{id}/status (Admin cập nhật trạng thái đơn/thanh toán)
  updateOrderStatus: async (
    id: string,
    data: UpdateOrderStatusCommand,
  ): Promise<ApiResponse<OrderDto>> => {
    return await axiosClient.put(`/admin/orders/${id}/status`, data);
  },
};
