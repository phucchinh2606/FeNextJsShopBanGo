"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Newspaper,
  ChevronLeft,
  Store,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Sản phẩm",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Đơn hàng",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Danh mục",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Tin tức",
    href: "/admin/news",
    icon: Newspaper,
  },
];

export const AdminSidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-slate-900 text-slate-200 transition-all duration-300 border-r border-slate-800 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
        <Link
          href="/admin/dashboard"
          className="flex items-center space-x-3 overflow-hidden"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center font-bold text-white shrink-0">
            W
          </div>
          {isOpen && (
            <span className="font-bold text-lg text-white font-serif tracking-wider whitespace-nowrap">
              WOOD <span className="text-amber-500">ADMIN</span>
            </span>
          )}
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Toggle Sidebar"
        >
          <ChevronLeft
            className={`w-5 h-5 transition-transform duration-300 ${!isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Navigation Menu */}
      <div className="py-4 px-3 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-amber-600 text-white shadow-md shadow-amber-900/40"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
              title={!isOpen ? item.title : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {isOpen && (
                <span className="whitespace-nowrap">{item.title}</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Link to Client Shop */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-800 bg-slate-900">
        <Link
          href="/"
          className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
          title={!isOpen ? "Về trang bán hàng" : undefined}
        >
          <Store className="w-5 h-5 shrink-0" />
          {isOpen && <span className="whitespace-nowrap">Xem Cửa Hàng</span>}
        </Link>
      </div>
    </aside>
  );
};
