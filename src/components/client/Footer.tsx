"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useGetCategories } from "@/src/hooks/useCategory";

export const Footer = () => {
  const { data: categoryResponse } = useGetCategories();
  const categories = categoryResponse?.data || [];

  return (
    <footer className="bg-amber-950 text-amber-100 border-t border-amber-900">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xl sm:text-2xl font-serif font-bold tracking-wider text-white">
              WOOD<span className="text-amber-500">STORE</span>
            </h3>
            <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed">
              Chuyên cung cấp các sản phẩm đồ gỗ mỹ nghệ, nội thất gỗ tự nhiên
              cao cấp với thiết kế tinh xảo và độ bền vượt thời gian.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-3 pt-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-900/60 flex items-center justify-center hover:bg-amber-600 hover:text-white transition"
                aria-label="Facebook"
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-900/60 flex items-center justify-center hover:bg-amber-600 hover:text-white transition"
                aria-label="Instagram"
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Cột 2: Danh mục */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Danh mục sản phẩm
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {categories.length > 0 ? (
                categories.slice(0, 5).map((cat) => (
                  <li key={cat.categoryId}>
                    <Link
                      href={`/products?categoryId=${cat.categoryId}`}
                      className="hover:text-amber-400 transition"
                    >
                      {cat.categoryName}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link
                      href="/products"
                      className="hover:text-amber-400 transition"
                    >
                      Bàn ghế phòng khách
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products"
                      className="hover:text-amber-400 transition"
                    >
                      Giường ngủ tự nhiên
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Cột 3: Chính sách */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Chính sách & Hỗ trợ
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/policy/warranty"
                  className="hover:text-amber-400 transition"
                >
                  Chính sách bảo hành gỗ
                </Link>
              </li>
              <li>
                <Link
                  href="/policy/shipping"
                  className="hover:text-amber-400 transition"
                >
                  Vận chuyển & Giao lắp
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Thông tin liên hệ
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-amber-200/80">
                  123 Làng Nghề Đồ Gỗ, Hà Nội
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-amber-200/80">0988 123 456</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-amber-200/80">contact@woodstore.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-amber-900/60 bg-amber-950/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[11px] sm:text-xs text-amber-300/60">
          <p>
            © {new Date().getFullYear()} WOODSTORE. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};
