"use client";

import { RevenueChartItemDto } from "@/src/types";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface RevenueChartProps {
  dataItems?: RevenueChartItemDto[];
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data: RevenueChartItemDto = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-2.5 sm:p-3 rounded-xl shadow-xl text-[11px] sm:text-xs space-y-1 border border-slate-700">
        <p className="font-bold text-slate-300">{label}</p>
        <p className="text-amber-400 font-semibold">
          Doanh thu: {data.revenue.toLocaleString("vi-VN")} đ
        </p>
        <p className="text-slate-400">Đơn hàng: {data.orderCount} đơn</p>
      </div>
    );
  }
  return null;
};

export const RevenueChart = ({
  dataItems = [],
  isLoading,
}: RevenueChartProps) => {
  if (isLoading) {
    return (
      <div className="h-56 sm:h-72 bg-slate-100 rounded-xl animate-pulse" />
    );
  }

  if (!dataItems || dataItems.length === 0) {
    return (
      <div className="h-56 sm:h-72 flex items-center justify-center text-xs text-slate-400 border border-dashed rounded-xl">
        Chưa có dữ liệu thống kê doanh thu
      </div>
    );
  }

  const formatYAxis = (value: number) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
    return value.toString();
  };

  return (
    <div className="w-full h-56 sm:h-72 pt-2 sm:pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dataItems}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 10 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={formatYAxis}
            tick={{ fill: "#64748b", fontSize: 10 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="revenue"
            fill="#92400e"
            radius={[6, 6, 0, 0]}
            maxBarSize={35}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
