import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import { GetRevenueChartQuery } from "../types";

export const DASHBOARD_QUERY_KEY = ["admin-dashboard"];

// Hook lấy các con số thống kê tổng quan
export const useGetDashboardSummary = () => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "summary"],
    queryFn: () => dashboardService.getSummary(),
  });
};

// Hook lấy dữ liệu biểu đồ doanh thu
export const useGetRevenueChart = (params?: GetRevenueChartQuery) => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "revenue-chart", params],
    queryFn: () => dashboardService.getRevenueChart(params),
  });
};

// Hook lấy danh sách top sản phẩm bán chạy
export const useGetTopProducts = (limit: number = 5) => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "top-products", limit],
    queryFn: () => dashboardService.getTopProducts(limit),
  });
};

// Hook lấy danh sách các đơn hàng mới đặt gần đây
export const useGetRecentOrders = (limit: number = 5) => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "recent-orders", limit],
    queryFn: () => dashboardService.getRecentOrders(limit),
  });
};
