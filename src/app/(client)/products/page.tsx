"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";
import { useGetCategories } from "@/src/hooks/useCategory";
import { useGetProducts } from "@/src/hooks/useProduct";
import { ProductCard } from "@/src/components/client/ProductCard";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryIdFromUrl = searchParams.get("categoryId");

  // States quản lý bộ lọc & phân trang
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [isDescending, setIsDescending] = useState<boolean>(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const pageSize = 12;

  // Cập nhật selectedCategory khi URL thay đổi
  useEffect(() => {
    if (categoryIdFromUrl) {
      setSelectedCategory(categoryIdFromUrl);
    }
  }, [categoryIdFromUrl]);

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

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setPageNumber(1);
  };

  // Component render giao diện Bộ Lọc
  const FilterSection = () => (
    <div className="space-y-6">
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
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-700 focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Lọc theo Danh mục */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Danh mục
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
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
              setMinPrice(e.target.value ? Number(e.target.value) : undefined);
              setPageNumber(1);
            }}
            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-700"
          />
          <input
            type="number"
            placeholder="Đến"
            value={maxPrice || ""}
            onChange={(e) => {
              setMaxPrice(e.target.value ? Number(e.target.value) : undefined);
              setPageNumber(1);
            }}
            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-700"
          />
        </div>
      </div>

      {/* Nút Xóa Lọc */}
      <button
        onClick={handleResetFilters}
        className="w-full py-2 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl transition"
      >
        Xóa tất cả bộ lọc
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Tiêu đề trang */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
          Danh Sách Sản Phẩm
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Khám phá bộ sưu tập nội thất gỗ cao cấp
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        {/* Sidebar - Bộ Lọc Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm sticky top-24">
            <FilterSection />
          </div>
        </aside>

        {/* Modal / Drawer Bộ Lọc trên Mobile */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden flex justify-end">
            <div className="bg-white w-full max-w-xs h-full p-5 overflow-y-auto space-y-4 shadow-xl animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="font-bold text-sm text-gray-900">Bộ lọc</span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterSection />
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2.5 bg-amber-800 text-white rounded-xl text-xs font-semibold mt-4"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        )}

        {/* Danh sách sản phẩm */}
        <div className="flex-1 space-y-4 sm:space-y-6">
          {/* Thanh công cụ sắp xếp & nút lọc Mobile */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center space-x-1.5 px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              <Filter className="w-3.5 h-3.5 text-amber-800" />
              <span>Bộ lọc</span>
            </button>

            <span className="text-xs text-gray-500 font-medium hidden sm:inline">
              Hiển thị {products.length} sản phẩm
            </span>

            <div className="flex items-center space-x-2 ml-auto sm:ml-0">
              <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
              <span className="text-xs font-medium text-gray-700 hidden sm:inline">
                Sắp xếp:
              </span>
              <select
                onChange={handleSortChange}
                className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-amber-700"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>

          {/* Grid Sản phẩm (2 cột trên Mobile, 3 cột trên Desktop) */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 sm:h-80 bg-gray-200 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-8 sm:p-12 rounded-2xl border border-gray-200 text-center space-y-3">
              <p className="text-gray-500 text-xs sm:text-sm">
                Không tìm thấy sản phẩm phù hợp với bộ lọc.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
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
                className="p-2 border rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-40"
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
                className="p-2 border rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
          <Loader2 className="w-8 h-8 text-amber-800 animate-spin" />
          <p className="text-xs font-semibold text-amber-900">
            Đang tải danh sách sản phẩm...
          </p>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
