"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useGetMyProfile,
  useUpdateMyProfile,
  useChangePassword,
} from "@/src/hooks/useAuth";
import { UserRole } from "@/src/types/user";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  ShieldCheck,
  Calendar,
  Save,
  KeyRound,
  Loader2,
} from "lucide-react";

export function ProfileForm() {
  const { data: profileRes, isLoading } = useGetMyProfile();
  const updateProfileMutation = useUpdateMyProfile();
  const changePasswordMutation = useChangePassword();

  const profileData = profileRes?.data;

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    if (profileData) {
      setFullName(profileData.fullName || "");
      setPhoneNumber(profileData.phoneNumber || "");
      setAddress(profileData.address || "");
    }
  }, [profileData]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên.");
      return;
    }

    updateProfileMutation.mutate(
      { fullName, phoneNumber, address },
      {
        onSuccess: (res) => {
          if (res.success) {
            toast.success("Cập nhật thông tin cá nhân thành công!");
          }
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
          );
        },
      },
    );
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Vui lòng điền đầy đủ các trường mật khẩu.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không trùng khớp.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    changePasswordMutation.mutate(
      { currentPassword, newPassword, confirmNewPassword },
      {
        onSuccess: (res) => {
          if (res.success) {
            toast.success("Đổi mật khẩu thành công!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
          }
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message ||
              "Mật khẩu hiện tại không chính xác.",
          );
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 sm:p-12 text-slate-400 space-x-2">
        <Loader2 className="w-5 h-5 animate-spin text-amber-800" />
        <span className="text-xs sm:text-sm font-medium">
          Đang tải thông tin cá nhân...
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Cột 1: Card Avatar & Tổng quan */}
      <div className="lg:col-span-1 space-y-4 sm:space-y-6">
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-sm text-center">
          <div className="relative inline-block mx-auto mb-3 sm:mb-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-700 to-amber-900 text-white flex items-center justify-center text-2xl sm:text-3xl font-bold font-serif shadow-md mx-auto">
              {profileData?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-slate-800">
            {profileData?.fullName}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 truncate">
            {profileData?.email}
          </p>

          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-center space-x-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60 inline-flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                {profileData?.role === UserRole.Admin
                  ? "Quản Trị Viên"
                  : "Khách Hàng"}
              </span>
            </span>
          </div>

          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100 text-left space-y-2 text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Tham gia:{" "}
                <strong className="text-slate-700">
                  {profileData?.createdAt
                    ? new Date(profileData.createdAt).toLocaleDateString(
                        "vi-VN",
                      )
                    : "—"}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cột 2 & 3: Form Chỉnh Sửa & Đổi Mật Khẩu */}
      <div className="lg:col-span-2 space-y-4 sm:space-y-6">
        {/* Form 1: Cập Nhật Thông Tin */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-amber-800" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-800">
              Thông Tin Cá Nhân
            </h3>
          </div>

          <form
            onSubmit={handleUpdateProfile}
            className="space-y-3 sm:space-y-4 text-xs"
          >
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Địa chỉ Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={profileData?.email || ""}
                  className="w-full pl-9 pr-4 py-2 sm:py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Họ và Tên <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập họ và tên"
                  className="w-full pl-9 pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800 text-slate-800 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Số Điện Thoại
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className="w-full pl-9 pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800 text-slate-800 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Địa Chỉ Giao Hàng
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nhập địa chỉ nhận hàng..."
                  className="w-full pl-9 pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800 text-slate-800 transition resize-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="w-full sm:w-auto justify-center px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-xl transition flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Lưu Thay Đổi</span>
              </button>
            </div>
          </form>
        </div>

        {/* Form 2: Đổi Mật Khẩu */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <KeyRound className="w-4 h-4 text-amber-800" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-800">
              Bảo Mật & Mật Khẩu
            </h3>
          </div>

          <form
            onSubmit={handleChangePassword}
            className="space-y-3 sm:space-y-4 text-xs"
          >
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Mật Khẩu Hiện Tại
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800 text-slate-800 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Mật Khẩu Mới
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mật khẩu từ 6 ký tự"
                    className="w-full pl-9 pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800 text-slate-800 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Xác Nhận Mật Khẩu Mới
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full pl-9 pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800 text-slate-800 transition"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="w-full sm:w-auto justify-center px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl transition flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
              >
                {changePasswordMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <KeyRound className="w-4 h-4" />
                )}
                <span>Cập Nhật Mật Khẩu</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
