import { Logo } from "@/components/brand/Logo";
import { MessageCircle, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { whatsappLink, WHATSAPP_DISPLAY } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer id="contacto" className="border-t border-border/60 bg-muted/40">
      <div className="container grid gap-10 py-14 md:grid-cols-3">
        <div className="space-y-4">
          <Logo size="md" />
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
            Creada con <Heart className="h-3 w-3 fill-destructive text-destructive" /> por{" "}
            <span className="font-semibold text-foreground">Luis Javier Esquinca Rodríguez</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
