import { FeaturedCategories } from "../components/client/FeaturedCategories";
import { FeaturedProducts } from "../components/client/FeaturedProducts";
import { Footer } from "../components/client/Footer";
import { Header } from "../components/client/Header";
import { HeroBanner } from "../components/client/HeroBanner";
import { LatestNews } from "../components/client/LatestNews";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <FeaturedCategories />
        <FeaturedProducts />
        <LatestNews />
      </main>
      <Footer />
    </div>
  );
}
