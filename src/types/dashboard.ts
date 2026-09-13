import { OrderStatus, PaymentStatus } from "./order";

export interface DashboardSummaryDto {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
}

export interface RevenueChartItemDto {
  label: string;
  revenue: number;
  orderCount: number;
}

export interface RevenueChartDto {
  periodType: string;
  totalRevenue: number;
  dataItems: RevenueChartItemDto[];
}

export interface GetRevenueChartQuery {
  period?: "day" | "month" | "year" | string;
  fromDate?: string;
  toDate?: string;
}

export interface TopProductDto {
  productId: string;
  productName: string;
  material: string;
  price: number;
  imageUrl: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface RecentOrderDto {
  orderId: string;
  userId: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  totalItems: number;
}
