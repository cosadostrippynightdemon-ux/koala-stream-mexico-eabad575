import { useEffect } from "react";
import { Navbar } from "@/components/storefront/Navbar";
import { Hero } from "@/components/storefront/Hero";
import { Benefits } from "@/components/storefront/Benefits";
import { HowItWorks } from "@/components/storefront/HowItWorks";
import { Shop } from "@/components/storefront/Shop";
import { SportsSection } from "@/components/storefront/SportsSection";
import { FAQ } from "@/components/storefront/FAQ";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { ChatAssistant } from "@/components/storefront/ChatAssistant";
import { sfx } from "@/lib/sounds";

const Index = () => {
  useEffect(() => {
    // Los navegadores requieren un gesto del usuario para reproducir audio.
    // Disparamos el sonido hippie en la primera interacción (clic, scroll, tecla, touch).
    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      sfx.welcome();
      cleanup();
    };
    const cleanup = () => {
      window.removeEventListener("pointerdown", play);
      window.removeEventListener("keydown", play);
      window.removeEventListener("scroll", play);
      window.removeEventListener("touchstart", play);
    };
    window.addEventListener("pointerdown", play, { once: false });
    window.addEventListener("keydown", play, { once: false });
    window.addEventListener("scroll", play, { passive: true });
    window.addEventListener("touchstart", play, { passive: true });
    return cleanup;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Shop />
        <Hero />
        <Benefits />
        <HowItWorks />
        <SportsSection />
        <FAQ />
      </main>
      <Footer />
      <CartDrawer />
      <ChatAssistant />
    </div>
  );
};

export default Index;
