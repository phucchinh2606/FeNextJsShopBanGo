"use client";

import Link from "next/link";
import { SearchBar } from "./SearchBar";
import { UserMenu } from "./UserMenu";
import { ShoppingBag } from "lucide-react";
import { useGetCart } from "@/src/hooks/useCart";

export const Header = () => {
  const { data: cartResponse } = useGetCart();
  const cart = cartResponse?.data;
  const totalItems = cart?.totalItems || 0;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tight text-amber-900 font-serif">
                WOOD<span className="text-amber-600">STORE</span>
              </span>
            </Link>
          </div>

          {/* Navigation Bar */}
          <nav className="hidden md:flex space-x-8">
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

          {/* SearchBar */}
          <div className="hidden lg:block flex-1 max-w-xs mx-4">
            <SearchBar />
          </div>

          {/* Right Action Icons (Cart Badge & User Menu) */}
          <div className="flex items-center space-x-6">
            {/* Cart Icon with Badge */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-amber-800 transition"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-amber-700 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};
