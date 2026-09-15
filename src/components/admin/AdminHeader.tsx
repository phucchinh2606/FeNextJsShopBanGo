"use client";

import { ChevronLeft, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";

interface HeaderProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const AdminHeader = ({ isOpen, setIsOpen }: HeaderProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout(); // Xóa cookie & localStorage state
    queryClient.clear(); // Xóa toàn bộ cache dữ liệu cũ
    router.push("/"); // Tự động chuyển hướng về trang chủ
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        {/* Nút mũi tên thu/phóng */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition"
          aria-label="Toggle Sidebar"
        >
          <ChevronLeft
            className={`w-5 h-5 transition-transform duration-300 ${
              !isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <h1 className="text-sm font-bold text-slate-800">
          Hệ thống Quản lý Bán hàng Đồ Gỗ
        </h1>
      </div>

      {/* Thông tin Admin & Nút Đăng xuất */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-sm">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="hidden sm:block text-xs">
            <p className="font-bold text-slate-800">
              {user?.fullName || "Admin System"}
            </p>
            <p className="text-slate-400">{user?.email || ""}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition border border-rose-100"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </header>
  );
};
