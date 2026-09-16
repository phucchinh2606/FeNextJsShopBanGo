"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  User,
  LogOut,
  PackageCheck,
  ShieldAlert,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "@/src/store/useAuthStore";

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, logout } = useAuthStore();

  // Đóng dropdown khi click bên ngoài menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="text-xs sm:text-sm font-medium text-amber-900 hover:text-amber-700 bg-amber-50 hover:bg-amber-100/80 px-3 py-2 rounded-xl transition"
      >
        Đăng nhập
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Nút bấm toggle mở Menu */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-sm">
          {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
        </div>
        <span className="hidden sm:inline-block text-xs font-semibold text-slate-700 max-w-[100px] truncate">
          {user?.fullName || "Tài khoản"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu dạng Click */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-2 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-800 truncate">
              {user?.fullName}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>

          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>Trang cá nhân</span>
            </Link>

            <Link
              href="/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
            >
              <PackageCheck className="w-4 h-4 text-slate-400" />
              <span>Đơn hàng của tôi</span>
            </Link>

            {/* Link dành cho Admin */}
            {user?.role === "admin" && (
              <Link
                href="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2.5 px-4 py-2 text-xs text-amber-800 hover:bg-amber-50 transition font-semibold"
              >
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>Trang Quản Trị</span>
              </Link>
            )}
          </div>

          <div className="border-t border-slate-100 pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition text-left"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
