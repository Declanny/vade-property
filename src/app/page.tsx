import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Properties from "@/components/Properties";
import Services from "@/components/Services";
import About from "@/components/About";
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
      <Properties />
      <Services />
      <About />
      <Footer />
    </div>
  );
}
