"use client";

import { UserDto, UserRole } from "@/src/types/user";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Calendar,
  Hash,
} from "lucide-react";

interface UserDetailModalProps {
  user: UserDto | null;
  onClose: () => void;
}

export function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 bg-slate-50/80 border-b border-slate-100 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-800">
              Chi Tiết Người Dùng
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1">
          {/* Avatar & Tên chính */}
          <div className="flex items-center space-x-3.5 sm:space-x-4 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-lg sm:text-xl uppercase shadow-md shrink-0">
              {user.fullName ? user.fullName.charAt(0) : "U"}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {user.fullName || "Chưa cập nhật tên"}
              </h3>
              <p className="text-slate-500 mt-0.5 truncate text-[11px] sm:text-xs">
                {user.email}
              </p>
              <div className="mt-1.5 sm:mt-2">
                {user.role === UserRole.Admin ? (
                  <span className="inline-flex items-center space-x-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    <ShieldCheck className="w-3 h-3 shrink-0" />
                    <span>Quản Trị Viên (Admin)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <User className="w-3 h-3 shrink-0" />
                    <span>Khách Hàng (Customer)</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Chi tiết từng thuộc tính */}
          <div className="grid grid-cols-1 gap-2.5 sm:gap-3.5 pt-1">
            <div className="flex items-start space-x-3 p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Hash className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block">
                  ID Tài Khoản
                </span>
                <span className="font-mono text-slate-800 font-medium select-all break-all block">
                  {user.userId}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Mail className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block">
                  Địa chỉ Email
                </span>
                <span className="text-slate-800 font-medium break-all block">
                  {user.email}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block">
                  Số Điện Thoại
                </span>
                <span className="text-slate-800 font-medium">
                  {user.phoneNumber || "Chưa cập nhật"}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block">
                  Địa Chỉ Giao Hàng
                </span>
                <span className="text-slate-800 font-medium leading-relaxed">
                  {user.address || "Chưa cập nhật"}
                </span>
              </div>
            </div>

            {user.createdAt && (
              <div className="flex items-start space-x-3 p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block">
                    Ngày Tạo Tài Khoản
                  </span>
                  <span className="text-slate-800 font-medium">
                    {new Date(user.createdAt).toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50/80 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold text-xs transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
