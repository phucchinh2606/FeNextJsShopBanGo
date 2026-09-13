import { FeaturedCategories } from "@/src/components/client/FeaturedCategories";
import { FeaturedProducts } from "@/src/components/client/FeaturedProducts";
import { HeroBanner } from "@/src/components/client/HeroBanner";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <FeaturedCategories />
      <FeaturedProducts />
    </>
  );
}
