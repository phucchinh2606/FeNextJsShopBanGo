import {
  ApiResponse,
  DashboardSummaryDto,
  GetRevenueChartQuery,
  RecentOrderDto,
  RevenueChartDto,
  TopProductDto,
} from "../types";
import axiosClient from "./axiosClient";

export const dashboardService = {
  // GET: /api/admin/dashboard/summary (Lấy thống kê tổng quan)
  getSummary: async (): Promise<ApiResponse<DashboardSummaryDto>> => {
    return await axiosClient.get("/admin/dashboard/summary");
  },

  // GET: /api/admin/dashboard/revenue-chart (Lấy dữ liệu biểu đồ doanh thu)
  getRevenueChart: async (
    params?: GetRevenueChartQuery,
  ): Promise<ApiResponse<RevenueChartDto>> => {
    return await axiosClient.get("/admin/dashboard/revenue-chart", { params });
  },

  // GET: /api/admin/dashboard/top-products (Lấy danh sách sản phẩm bán chạy)
  getTopProducts: async (
    limit: number = 5,
  ): Promise<ApiResponse<TopProductDto[]>> => {
    return await axiosClient.get("/admin/dashboard/top-products", {
      params: { limit },
    });
  },

  // GET: /api/admin/dashboard/recent-orders (Lấy danh sách đơn hàng gần đây)
  getRecentOrders: async (
    limit: number = 5,
  ): Promise<ApiResponse<RecentOrderDto[]>> => {
    return await axiosClient.get("/admin/dashboard/recent-orders", {
      params: { limit },
    });
  },
};
