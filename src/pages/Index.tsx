import { Navbar } from "@/components/storefront/Navbar";
import { Hero } from "@/components/storefront/Hero";
import { Benefits } from "@/components/storefront/Benefits";
import { HowItWorks } from "@/components/storefront/HowItWorks";
import { Shop } from "@/components/storefront/Shop";
import { SportsSection } from "@/components/storefront/SportsSection";
import { FAQ } from "@/components/storefront/FAQ";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Benefits />
        <HowItWorks />
        <Shop />
        <SportsSection />
        <FAQ />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default Index;
