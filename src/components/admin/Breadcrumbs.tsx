"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const routeNameMap: Record<string, string> = {
  admin: "Admin",
  dashboard: "Tổng quan",
  products: "Sản phẩm",
  orders: "Đơn hàng",
  categories: "Danh mục",
  news: "Tin tức",
  create: "Thêm mới",
  edit: "Chỉnh sửa",
};

export const Breadcrumbs = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center space-x-1.5 sm:space-x-2 text-[11px] sm:text-xs font-medium text-slate-500 mb-4 overflow-x-auto whitespace-nowrap pb-1 no-scrollbar">
      <Link
        href="/admin/dashboard"
        className="flex items-center hover:text-amber-600 transition shrink-0"
      >
        <Home className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
        <span>Trang chủ</span>
      </Link>

      {segments.map((segment, index) => {
        const url = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        const displayName = routeNameMap[segment] || segment;

        return (
          <div
            key={url}
            className="flex items-center space-x-1.5 sm:space-x-2 shrink-0"
          >
            <ChevronRight className="w-3 h-3 text-slate-400" />
            {isLast ? (
              <span className="text-slate-800 font-semibold">
                {displayName}
              </span>
            ) : (
              <Link href={url} className="hover:text-amber-600 transition">
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};
