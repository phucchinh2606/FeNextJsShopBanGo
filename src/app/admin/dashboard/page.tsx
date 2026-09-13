"use client";

import { useState } from "react";
import {
  useGetDashboardSummary,
  useGetRevenueChart,
  useGetTopProducts,
  useGetRecentOrders,
} from "@/src/hooks/useDashboard";
import { RevenueChart } from "@/src/components/admin/RevenueChart";
import { TopProductsWidget } from "@/src/components/admin/TopProductsWidget";
import { RecentOrdersWidget } from "@/src/components/admin/RecentOrdersWidget";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<"day" | "month" | "year">("month");

  // API Hooks
  const { data: summaryRes, isLoading: isSummaryLoading } =
    useGetDashboardSummary();
  const { data: chartRes, isLoading: isChartLoading } = useGetRevenueChart({
    period,
  });
  const { data: topProductsRes, isLoading: isTopLoading } =
    useGetTopProducts(5);
  const { data: recentOrdersRes, isLoading: isRecentLoading } =
    useGetRecentOrders(5);

  const summary = summaryRes?.data;
  const chartData = chartRes?.data;
  const topProducts = topProductsRes?.data || [];
  const recentOrders = recentOrdersRes?.data || [];

  if (isSummaryLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-100 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Tổng Quan Hệ Thống</h1>
        <p className="text-xs text-slate-500 mt-1">
          Báo cáo thống kê doanh thu, đơn hàng và sản phẩm cửa hàng đồ gỗ
        </p>
      </div>

      {/* 1. KHO THỐNG KÊ (SUMMARY CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Doanh thu */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-900 block">
              Tổng Doanh Thu
            </span>
            <span className="text-xl font-bold text-amber-950 mt-1 block">
              {(summary?.totalRevenue || 0).toLocaleString("vi-VN")} đ
            </span>
          </div>
          <div className="p-3 bg-amber-500 text-white rounded-xl shadow-md">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Tổng Đơn hàng */}
        <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-900 block">
              Tổng Đơn Hàng
            </span>
            <span className="text-xl font-bold text-blue-950 mt-1 block">
              {summary?.totalOrders || 0}
            </span>
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1">
              <span>Chờ: {summary?.pendingOrders || 0}</span>
              <span>•</span>
              <span>Xong: {summary?.completedOrders || 0}</span>
            </div>
          </div>
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Sản phẩm */}
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-900 block">
              Tổng Sản Phẩm
            </span>
            <span className="text-xl font-bold text-emerald-950 mt-1 block">
              {summary?.totalProducts || 0}
            </span>
            {summary?.lowStockProducts ? (
              <span className="text-[11px] font-semibold text-rose-600 flex items-center space-x-1 mt-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Sắp hết hàng: {summary.lowStockProducts}</span>
              </span>
            ) : (
              <span className="text-[11px] text-emerald-700 mt-1 block">
                Kho hàng ổn định
              </span>
            )}
          </div>
          <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Khách hàng */}
        <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-purple-900 block">
              Tổng Khách Hàng
            </span>
            <span className="text-xl font-bold text-purple-950 mt-1 block">
              {summary?.totalCustomers || 0}
            </span>
          </div>
          <div className="p-3 bg-purple-600 text-white rounded-xl shadow-md">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. BIỂU ĐỒ DOANH THU */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-amber-800" />
            <h2 className="text-sm font-bold text-slate-800">
              Báo Cáo Doanh Thu
            </h2>
          </div>
          <div className="flex items-center space-x-1 bg-white border border-slate-200 p-1 rounded-xl text-xs font-semibold">
            {(["day", "month", "year"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg transition capitalize ${
                  period === p
                    ? "bg-amber-800 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {p === "day"
                  ? "Theo Ngày"
                  : p === "month"
                    ? "Theo Tháng"
                    : "Theo Năm"}
              </button>
            ))}
          </div>
        </div>

        <RevenueChart
          dataItems={chartData?.dataItems}
          isLoading={isChartLoading}
        />
      </div>

      {/* 3. DƯỚI: TOP SẢN PHẨM & ĐƠN HÀNG GẦN ĐÂY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TopProductsWidget products={topProducts} isLoading={isTopLoading} />
        <RecentOrdersWidget orders={recentOrders} isLoading={isRecentLoading} />
      </div>
    </div>
  );
}
