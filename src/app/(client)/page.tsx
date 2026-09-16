import { FeaturedCategories } from "@/src/components/client/FeaturedCategories";
import { FeaturedProducts } from "@/src/components/client/FeaturedProducts";
import { HeroBanner } from "@/src/components/client/HeroBanner";

export default function HomePage() {
  return (
    <div className="space-y-8 sm:space-y-12 lg:space-y-16 pb-10 sm:pb-16">
      {/* Banner chính */}
      <HeroBanner />

      {/* Danh mục nổi bật */}
      <FeaturedCategories />

      {/* Sản phẩm nổi bật */}
      <FeaturedProducts />
    </div>
  );
}
