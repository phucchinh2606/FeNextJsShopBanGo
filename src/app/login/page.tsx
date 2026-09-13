"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/src/components/client/Header";
import { Footer } from "@/src/components/client/Footer";
import { useLogin } from "@/src/hooks/useAuth";
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Vui lòng nhập đầy đủ Email và Mật khẩu.");
      return;
    }

    setErrorMsg("");

    login(
      { email, password },
      {
        onSuccess: (res) => {
          if (res.success) {
            router.push("/");
          } else {
            setErrorMsg(res.message || "Đăng nhập thất bại. Vui lòng thử lại!");
          }
        },
        onError: (err: any) => {
          setErrorMsg(
            err?.response?.data?.message ||
              "Email hoặc mật khẩu không chính xác!",
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex items-center justify-center max-w-7xl w-full mx-auto px-4 py-12">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
              Đăng Nhập
            </h1>
            <p className="text-xs text-gray-500">
              Chào mừng bạn quay trở lại với Cửa hàng Đồ Gỗ Mỹ Nghệ
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Địa chỉ Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="nguyenvana@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mật khẩu <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-xl shadow-lg shadow-amber-900/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{isPending ? "Đang xử lý..." : "Đăng Nhập"}</span>
            </button>
          </form>

          <div className="text-center border-t border-gray-100 pt-4 text-xs text-gray-500">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="font-bold text-amber-800 hover:underline"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
