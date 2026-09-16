"use client";

import { ProfileForm } from "@/src/components/profile/ProfileForm";
import { User } from "lucide-react";

export default function ClientProfilePage() {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      {/* Header trang thông tin cá nhân */}
      <div className="border-b border-gray-100 pb-4">
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 flex items-center space-x-2.5">
          <User className="w-5 h-5 sm:w-6 sm:h-6 text-amber-800 shrink-0" />
          <span>Tài Khoản Của Tôi</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Quản lý thông tin cá nhân, địa chỉ nhận hàng và mật khẩu bảo mật
        </p>
      </div>

      {/* Form cập nhật thông tin */}
      <ProfileForm />
    </div>
  );
}
