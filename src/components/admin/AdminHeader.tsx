"use client";

import { useLogout } from "@/src/hooks/useAuth";
import { useAuthStore } from "@/src/store/useAuthStore";
import { Menu, LogOut, User, Shield } from "lucide-react";

interface AdminHeaderProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const AdminHeader = ({ isOpen, setIsOpen }: AdminHeaderProps) => {
  const { user } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Nút Toggle Sidebar trên Mobile / Desktop */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold text-slate-700 hidden sm:inline-block">
          Hệ thống Quản lý Bán hàng Đồ Gỗ
        </span>
      </div>

      {/* Thông tin Admin & Logout */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 border-r border-slate-200 pr-4">
          <div className="w-9 h-9 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-sm">
            {user?.fullName ? (
              user.fullName.charAt(0).toUpperCase()
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-800 flex items-center space-x-1">
              <span>{user?.fullName || "Admin User"}</span>
              <Shield className="w-3 h-3 text-amber-600" />
            </div>
            <div className="text-[11px] text-slate-500">{user?.email}</div>
          </div>
        </div>

        {/* Nút Đăng xuất */}
        <button
          onClick={() => logout()}
          disabled={isPending}
          className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
          title="Đăng xuất khỏi Admin"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline-block">Đăng xuất</span>
        </button>
      </div>
    </header>
  );
};
