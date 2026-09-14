"use client";

import { ProfileForm } from "@/src/components/profile/ProfileForm";
import { UserCheck } from "lucide-react";

export default function AdminProfilePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
          <UserCheck className="w-5 h-5 text-amber-800" />
          <span>Hồ Sơ Quản Trị Viên</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Quản lý thông tin tài khoản và mật khẩu truy cập hệ thống
        </p>
      </div>

      <ProfileForm />
    </div>
  );
}
