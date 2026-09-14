"use client";

import Link from "next/link";
import { User, LogOut, Package, Shield, UserCheck } from "lucide-react";
import { useAuthStore } from "@/src/store/useAuthStore";

export const UserMenu = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <Link
        href="/login"
        className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-amber-800 transition"
      >
        <User className="w-5 h-5" />
        <span>Đăng nhập</span>
      </Link>
    );
  }

  // Kiểm tra vai trò Admin (Xử lý cho cả chuỗi "Admin" hoặc Enum UserRole.Admin)
  const isAdmin = user.role === "Admin" || (user.role as unknown) === 1;

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 py-2 text-sm font-medium text-gray-700 hover:text-amber-800 transition focus:outline-none">
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-bold border border-amber-300">
          {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
        </div>
        <span className="max-w-[120px] truncate">{user.fullName}</span>
      </button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 w-48 py-2 mt-1 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="px-4 py-2 border-b border-gray-100">
          <p className="text-xs text-gray-500">Tài khoản</p>
          <p className="text-sm font-semibold text-gray-800 truncate">
            {user.email}
          </p>
        </div>

        {/* Menu hiển thị riêng theo Role */}
        {isAdmin ? (
          /* Dành riêng cho Admin */
          <Link
            href="/admin/dashboard"
            className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-50 transition"
          >
            <Shield className="w-4 h-4" />
            <span>Trang Admin</span>
          </Link>
        ) : (
          /* Dành riêng cho User/Customer */
          <>
            <Link
              href="/profile"
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <UserCheck className="w-4 h-4" />
              <span>Tài khoản của tôi</span>
            </Link>

            <Link
              href="/orders"
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <Package className="w-4 h-4" />
              <span>Đơn hàng của tôi</span>
            </Link>
          </>
        )}

        <div className="border-t border-gray-100 my-1" />

        {/* Nút Đăng xuất */}
        <button
          onClick={logout}
          className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};
