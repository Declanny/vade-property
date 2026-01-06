import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import WhyChooseUs from "@/components/WhyChooseUs";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { MobileSearchBar } from "@/components/MobileSearchBar";
import { CategoryTabs } from "@/components/CategoryTabs";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navbar - hidden on mobile */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* Mobile Header - visible only on mobile */}
      <div className="md:hidden sticky top-0 z-40 bg-white shadow-sm">
        <MobileSearchBar />
        <CategoryTabs />
      </div>

      {/* Main Content */}
      <div className="pt-0 md:pt-20 pb-20 md:pb-0">
        {/* Hero - hidden on mobile */}
        <div className="hidden md:block">
          <Hero />
        </div>

        <FeaturedProperties />
        <WhyChooseUs />
      </div>

      {/* Footer - hidden on mobile */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
