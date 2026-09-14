"use client";

import { ProfileForm } from "@/src/components/profile/ProfileForm";
import { User } from "lucide-react";

export default function ClientProfilePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
          <User className="w-5 h-5 text-amber-800" />
          <span>Tài Khoản Của Tôi</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Quản lý thông tin cá nhân, địa chỉ nhận hàng và mật khẩu bảo mật
        </p>
      </div>

      <ProfileForm />
    </div>
  );
}
