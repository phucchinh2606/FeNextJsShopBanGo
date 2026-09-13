"use client";

import { useState } from "react";
import { X, Mail, Lock, User, Phone, MapPin } from "lucide-react";
import { useLogin, useRegister } from "@/src/hooks/useAuth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

export const AuthModal = ({
  isOpen,
  onClose,
  defaultTab = "login",
}: AuthModalProps) => {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const { mutate: loginMutate, isPending: isLoginPending } = useLogin();
  const { mutate: registerMutate, isPending: isRegisterPending } =
    useRegister();

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    loginMutate(
      { email, password },
      {
        onSuccess: (res) => {
          if (res.success) {
            onClose();
          } else {
            setErrorMsg(res.message || "Đăng nhập thất bại.");
          }
        },
        onError: (err) => {
          setErrorMsg(err.message || "Có lỗi xảy ra khi đăng nhập.");
        },
      },
    );
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    registerMutate(
      { fullName, email, password, phoneNumber, address },
      {
        onSuccess: (res) => {
          if (res.success) {
            setTab("login");
            setErrorMsg("Đăng ký thành công! Vui lòng đăng nhập.");
          } else {
            setErrorMsg(res.message || "Đăng ký thất bại.");
          }
        },
        onError: (err) => {
          setErrorMsg(err.message || "Có lỗi xảy ra khi đăng ký.");
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Header */}
        <div className="flex border-b border-gray-100 bg-amber-50/50">
          <button
            onClick={() => {
              setTab("login");
              setErrorMsg("");
            }}
            className={`flex-1 py-4 text-sm font-semibold transition ${
              tab === "login"
                ? "text-amber-900 border-b-2 border-amber-800 bg-white"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => {
              setTab("register");
              setErrorMsg("");
            }}
            className={`flex-1 py-4 text-sm font-semibold transition ${
              tab === "register"
                ? "text-amber-900 border-b-2 border-amber-800 bg-white"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Tạo tài khoản
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
              {errorMsg}
            </div>
          )}

          {tab === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoginPending}
                className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-medium text-sm rounded-lg shadow transition disabled:opacity-50"
              >
                {isLoginPending ? "Đang xử lý..." : "Đăng nhập"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0988..."
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Địa chỉ
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Hà Nội..."
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isRegisterPending}
                className="w-full py-2.5 mt-2 bg-amber-800 hover:bg-amber-900 text-white font-medium text-sm rounded-lg shadow transition disabled:opacity-50"
              >
                {isRegisterPending ? "Đang đăng ký..." : "Tạo tài khoản"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
