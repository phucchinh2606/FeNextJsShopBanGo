"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

// Dictionary ánh xạ các route segment sang tiếng Việt
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
    <nav className="flex items-center space-x-2 text-xs font-medium text-slate-500 mb-4">
      <Link
        href="/admin/dashboard"
        className="flex items-center hover:text-amber-600 transition"
      >
        <Home className="w-3.5 h-3.5 mr-1" />
        <span>Trang chủ</span>
      </Link>

      {segments.map((segment, index) => {
        const url = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        const displayName = routeNameMap[segment] || segment;

        return (
          <div key={url} className="flex items-center space-x-2">
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
