"use client";

import { ProfileForm } from "@/src/components/profile/ProfileForm";
import { UserCheck } from "lucide-react";

export default function AdminProfilePage() {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center space-x-2">
          <UserCheck className="w-5 h-5 text-amber-800 shrink-0" />
          <span>Hồ Sơ Quản Trị Viên</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
          Quản lý thông tin tài khoản và mật khẩu truy cập hệ thống
        </p>
      </div>

      {/* Form Cập Nhật Profile */}
      <ProfileForm />
    </div>
  );
}
