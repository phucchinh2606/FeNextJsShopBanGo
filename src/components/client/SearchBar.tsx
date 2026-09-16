"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/products");
    }
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="relative flex items-center w-full">
        <input
          type="text"
          placeholder="Tìm kiếm nội thất gỗ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-1.5 sm:py-2 pl-3.5 pr-14 text-xs sm:text-sm text-gray-900 bg-gray-50/80 border border-gray-200 rounded-full focus:outline-none focus:border-amber-700 focus:bg-white focus:ring-1 focus:ring-amber-700 transition"
        />

        <div className="absolute right-1.5 flex items-center space-x-0.5">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full focus:outline-none"
              aria-label="Xóa từ khóa"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}

          <button
            type="submit"
            className="p-1.5 text-gray-500 hover:text-amber-800 rounded-full focus:outline-none transition"
            aria-label="Tìm kiếm"
          >
            <Search className="w-4 h-4 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </form>
  );
};
