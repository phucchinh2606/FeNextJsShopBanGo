"use client";

import { useState } from "react";

import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetCategories } from "@/src/hooks/useCategory";
import { useGetProducts } from "@/src/hooks/useProduct";
import { Header } from "@/src/components/client/Header";
import { ProductCard } from "@/src/components/client/ProductCard";
import { Footer } from "@/src/components/client/Footer";

export default function ProductsPage() {
  // States quản lý bộ lọc & phân trang
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [isDescending, setIsDescending] = useState<boolean>(true);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 12;

  // Lấy dữ liệu danh mục & sản phẩm
  const { data: categoryData } = useGetCategories();
  const categories = categoryData?.data || [];

  const { data: productData, isLoading } = useGetProducts({
    searchTerm: searchTerm || undefined,
    categoryId: selectedCategory || undefined,
    minPrice,
    maxPrice,
    sortBy,
    isDescending,
    pageNumber,
    pageSize,
  });

  const products = productData?.data?.items || [];
  const totalPages = productData?.data?.totalPages || 1;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "price-asc") {
      setSortBy("price");
      setIsDescending(false);
    } else if (value === "price-desc") {
      setSortBy("price");
      setIsDescending(true);
    } else {
      setSortBy("createdAt");
      setIsDescending(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tiêu đề trang */}
        <div className="mb-6">
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Danh Sách Sản Phẩm
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Khám phá bộ sưu tập nội thất gỗ cao cấp
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Bộ Lọc */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-6">
              <div className="flex items-center space-x-2 font-bold text-gray-900 border-b border-gray-100 pb-3">
                <Filter className="w-4 h-4 text-amber-800" />
                <span>Bộ Lọc Tìm Kiếm</span>
              </div>

              {/* Lọc theo từ khóa */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Tìm kiếm
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tên sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPageNumber(1);
                    }}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-700 focus:outline-none"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Lọc theo Danh mục */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Danh mục
                </label>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setPageNumber(1);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedCategory === ""
                        ? "bg-amber-800 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Tất cả danh mục
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.categoryId}
                      onClick={() => {
                        setSelectedCategory(cat.categoryId);
                        setPageNumber(1);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        selectedCategory === cat.categoryId
                          ? "bg-amber-800 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {cat.categoryName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lọc theo Khoảng Giá */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Khoảng giá (VNĐ)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={minPrice || ""}
                    onChange={(e) => {
                      setMinPrice(
                        e.target.value ? Number(e.target.value) : undefined,
                      );
                      setPageNumber(1);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-700"
                  />
                  <input
                    type="number"
                    placeholder="Đến"
                    value={maxPrice || ""}
                    onChange={(e) => {
                      setMaxPrice(
                        e.target.value ? Number(e.target.value) : undefined,
                      );
                      setPageNumber(1);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-700"
                  />
                </div>
              </div>

              {/* Nút Xóa Lọc */}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setMinPrice(undefined);
                  setMaxPrice(undefined);
                  setPageNumber(1);
                }}
                className="w-full py-2 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl transition"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          </aside>

          {/* Danh sách sản phẩm */}
          <div className="flex-1 space-y-6">
            {/* Thanh công cụ sắp xếp */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-gray-500 font-medium">
                Hiển thị {products.length} sản phẩm
              </span>

              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-700">
                  Sắp xếp:
                </span>
                <select
                  onChange={handleSortChange}
                  className="text-xs border border-gray-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-amber-700"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                </select>
              </div>
            </div>

            {/* Grid Sản phẩm */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 bg-gray-200 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-3">
                <p className="text-gray-500 text-sm">
                  Không tìm thấy sản phẩm phù hợp với bộ lọc.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
            )}

            {/* Thanh Phân Trang */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 pt-6">
                <button
                  disabled={pageNumber === 1}
                  onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                  className="p-2 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold px-4 text-gray-700">
                  Trang {pageNumber} / {totalPages}
                </span>
                <button
                  disabled={pageNumber === totalPages}
                  onClick={() =>
                    setPageNumber((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="p-2 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
