import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: "url('/propertymain.avif')"
      }}
    >
      <Navbar />
      <Hero />
      <FeaturedProperties />
      <WhyChooseUs />
      <Footer />
    </div>
  );
}
