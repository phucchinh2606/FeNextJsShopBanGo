"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { UserMenu } from "./UserMenu";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useGetCart } from "@/src/hooks/useCart";
import { useAuthStore, normalizeRole } from "@/src/store/useAuthStore";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const { isAuthenticated, user } = useAuthStore();
  const { data: cartResponse } = useGetCart();
  const cart = cartResponse?.data;
  const totalItems = cart?.totalItems || 0;
  const isAdmin = normalizeRole(user?.role) === "Admin";

  // Xử lý khi bấm vào Giỏ hàng
  const handleCartClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Nút Hamburger cho Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-amber-800 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-amber-900 font-serif">
                WOOD<span className="text-amber-600">STORE</span>
              </span>
            </Link>
          </div>

          {/* Navigation Bar Desktop */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-amber-800 transition"
            >
              Trang chủ
            </Link>
            <Link
              href="/products"
              className="text-sm font-medium text-gray-700 hover:text-amber-800 transition"
            >
              Sản phẩm
            </Link>
            <Link
              href="/news"
              className="text-sm font-medium text-gray-700 hover:text-amber-800 transition"
            >
              Tin tức
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-amber-800 transition"
            >
              Về chúng tôi
            </Link>
          </nav>

          {/* SearchBar Desktop */}
          <div className="hidden lg:block flex-1 max-w-xs mx-4">
            <SearchBar />
          </div>

          {/* Right Action Icons (Cart & User Menu) */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            {!isAdmin && (
              <Link
                href="/cart"
                onClick={handleCartClick}
                className="relative p-2 text-gray-700 hover:text-amber-800 transition"
              >
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                {isAuthenticated && totalItems > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] sm:text-xs font-bold leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-amber-700 rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            <UserMenu />
          </div>
        </div>

        {/* Thanh tìm kiếm trên Mobile/Tablet (< 1024px) */}
        <div className="block lg:hidden pb-3">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-semibold text-gray-800 hover:text-amber-800 py-2 border-b border-gray-50"
          >
            Trang chủ
          </Link>
          <Link
            href="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-semibold text-gray-800 hover:text-amber-800 py-2 border-b border-gray-50"
          >
            Sản phẩm
          </Link>
          <Link
            href="/news"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-semibold text-gray-800 hover:text-amber-800 py-2 border-b border-gray-50"
          >
            Tin tức
          </Link>
          <Link
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-semibold text-gray-800 hover:text-amber-800 py-2"
          >
            Về chúng tôi
          </Link>
        </div>
      )}
    </header>
  );
};
