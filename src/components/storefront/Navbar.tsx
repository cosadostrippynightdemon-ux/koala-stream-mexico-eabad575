import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { ShoppingCart, MessageCircle, Menu, X, Volume2, VolumeX } from "lucide-react";
import { useCart } from "@/store/cart";
import { whatsappLink, WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sfx } from "@/lib/sounds";

const links = [
  { href: "#tienda", label: "Tienda" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#deportes", label: "Deportes" },
  { href: "#faq", label: "Preguntas" },
  { href: "#contacto", label: "Contacto" },
];

export function Navbar() {
  const { count, setOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [muted, setMuted] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("koalas_muted") === "1";
  });

  useEffect(() => {
    sfx.setMuted(muted);
    localStorage.setItem("koalas_muted", muted ? "1" : "0");
  }, [muted]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link to="/" aria-label="Inicio Koalas Software" className="transition-transform hover:scale-105">
          <Logo size="md" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onMouseEnter={() => sfx.tick()}
              className="text-sm font-medium text-foreground/80 transition-smooth hover:text-primary story-link"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setMuted((m) => !m); }}
            aria-label={muted ? "Activar sonidos" : "Silenciar sonidos"}
            title={muted ? "Activar sonidos" : "Silenciar sonidos"}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-primary" />}
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden border-success/40 text-success hover:bg-success/10 hover:text-success sm:inline-flex"
          >
            <a href={whatsappLink("Hola Koalas Software, me interesan sus cuentas premium 🐨", WHATSAPP_NUMBER)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setOpen(true); sfx.swoosh(); }}
            aria-label="Abrir carrito"
            className="relative transition-transform hover:scale-110"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-soft animate-pop-in">
                {count}
              </span>
            )}
          </Button>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen((o) => !o)} aria-label="Menú">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/60 bg-background md:hidden animate-fade-up">
          <nav className="container flex flex-col gap-1 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-smooth hover:bg-muted hover:text-primary"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
