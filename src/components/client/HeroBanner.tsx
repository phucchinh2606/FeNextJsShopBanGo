"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Award } from "lucide-react";

export const HeroBanner = () => {
  return (
    <div className="relative bg-amber-950 text-white overflow-hidden">
      {/* Background Image với hiệu ứng Overlay mờ */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-amber-950 via-amber-950/80 to-transparent" />

      {/* Hero Content Main */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-800/60 border border-amber-600/40 text-amber-200 text-xs font-semibold tracking-wide uppercase">
            <span>Tinh hoa gỗ Việt</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-amber-50 leading-tight">
            Nội Thất Gỗ Mỹ Nghệ <br />
            <span className="text-amber-500">Đẳng Cấp & Sang Trọng</span>
          </h1>

          <p className="text-base sm:text-lg text-amber-100/80 leading-relaxed font-light">
            Chế tác hoàn toàn từ gỗ tự nhiên nguyên khối. Mang lại không gian
            sống ấm cúng, trường tồn cùng thời gian và đậm chất nghệ thuật cho
            ngôi nhà của bạn.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-amber-900/50 transition transform hover:-translate-y-0.5"
            >
              <span>Xem Sản Phẩm</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-amber-900/40 hover:bg-amber-900/60 border border-amber-700/50 text-amber-100 font-medium text-sm rounded-xl transition"
            >
              Về Chúng Tôi
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Badges bên dưới Banner */}
      <div className="relative border-t border-amber-900/60 bg-amber-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4 p-2">
              <div className="w-12 h-12 rounded-xl bg-amber-900/80 border border-amber-700/50 flex items-center justify-center text-amber-400 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-100">
                  Gỗ Tự Nhiên 100%
                </h4>
                <p className="text-xs text-amber-300/70">
                  Cam kết chất lượng gỗ cao cấp
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-2">
              <div className="w-12 h-12 rounded-xl bg-amber-900/80 border border-amber-700/50 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-100">
                  Bảo Hành Dài Hạn
                </h4>
                <p className="text-xs text-amber-300/70">
                  Bảo hành mối mọt & cong vênh
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-2">
              <div className="w-12 h-12 rounded-xl bg-amber-900/80 border border-amber-700/50 flex items-center justify-center text-amber-400 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-100">
                  Giao Lắp Tận Nơi
                </h4>
                <p className="text-xs text-amber-300/70">
                  Vận chuyển toàn quốc an toàn
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
