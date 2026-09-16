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
    logout();
    queryClient.clear();
    router.push("/");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition"
          aria-label="Toggle Sidebar"
        >
          <ChevronLeft
            className={`w-5 h-5 transition-transform duration-300 ${
              !isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <h1 className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[150px] sm:max-w-none">
          Hệ thống Quản lý Bán hàng
        </h1>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="hidden md:block text-xs">
            <p className="font-bold text-slate-800 truncate max-w-[120px]">
              {user?.fullName || "Admin System"}
            </p>
            <p className="text-slate-400 truncate max-w-[120px]">
              {user?.email || ""}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition border border-rose-100"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Đăng xuất</span>
        </button>
      </div>
    </header>
  );
};
