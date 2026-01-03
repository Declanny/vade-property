import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { MobileSearchBar } from "@/components/MobileSearchBar";
import { CategoryTabs } from "@/components/CategoryTabs";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Desktop Header - hidden on mobile */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Mobile Header - visible only on mobile */}
      <div className="md:hidden sticky top-0 z-40 bg-white shadow-sm">
        <MobileSearchBar />
        <CategoryTabs />
      </div>

      {/* Main content with bottom padding on mobile for nav */}
      <main className="min-h-screen pb-20 md:pb-0">{children}</main>

      {/* Desktop Footer - hidden on mobile */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </>
  );
}
