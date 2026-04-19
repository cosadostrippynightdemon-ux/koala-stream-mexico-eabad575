import { Logo } from "@/components/brand/Logo";
import { Watermark } from "@/components/brand/Watermark";
import { MessageCircle, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { whatsappLink, WHATSAPP_DISPLAY } from "@/lib/whatsapp";

const sponsors = [
  "Lovable",
  "Google Studio",
  "Gemini",
  "Android Studio",
  "GitHub",
  "Supabase",
  "HybridgeHub México",
  "Google México",
];

export function Footer() {
  return (
    <footer id="contacto" className="border-t border-border/60 bg-muted/40">
      {/* Tira de patrocinadores con marquee */}
      <div className="border-b border-border/60 bg-card/60 py-4 overflow-hidden">
        <p className="container mb-3 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
          Tecnología que nos respalda
        </p>
        <div className="relative flex overflow-hidden">
          <div className="flex shrink-0 animate-[shimmer_25s_linear_infinite] gap-10 pr-10 [animation-name:marquee]">
            {[...sponsors, ...sponsors].map((s, i) => (
              <span key={i} className="whitespace-nowrap font-display text-sm font-semibold text-foreground/70">
                ✦ {s}
              </span>
            ))}
          </div>
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </div>

      <div className="container grid gap-10 py-14 md:grid-cols-3">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <Watermark size={56} opacity={0.85} />
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            Cuentas premium de streaming, música, IA y software. Hecho con cariño desde México 💚
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">Navegación</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#tienda" className="transition-smooth hover:text-primary">Tienda</a></li>
            <li><a href="#como-funciona" className="transition-smooth hover:text-primary">Cómo funciona</a></li>
            <li><a href="#deportes" className="transition-smooth hover:text-primary">Deportes</a></li>
            <li><a href="#faq" className="transition-smooth hover:text-primary">Preguntas frecuentes</a></li>
            <li><Link to="/admin" className="transition-smooth hover:text-primary">Acceso administrador</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">Contacto</h4>
          <a
            href={whatsappLink("Hola Koalas Software 🐨")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-semibold text-success transition-smooth hover:bg-success/20"
          >
            <MessageCircle className="h-4 w-4" />
            {WHATSAPP_DISPLAY}
          </a>
          <p className="text-xs text-muted-foreground">
            Atención por WhatsApp todos los días.
          </p>
        </div>
      </div>

      <div className="border-t border-border/60 bg-card">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-center text-xs text-muted-foreground md:flex-row md:text-left">
          <p>
            © {new Date().getFullYear()} Koalas Software · Todos los derechos reservados.
          </p>
          <p className="inline-flex items-center gap-1">
            Hecho con <Heart className="h-3 w-3 fill-destructive text-destructive" /> en México 🇲🇽
          </p>
        </div>
      </div>
    </footer>
  );
}

