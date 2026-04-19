import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { MessageCircle, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero">
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />

      <div className="container relative grid gap-12 py-20 md:grid-cols-2 md:py-28">
        <div className="flex flex-col justify-center gap-6 animate-fade-up">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Hecho con cariño en México 🇲🇽
          </div>

          <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-6xl">
            Cuentas <span className="text-gradient-primary">Premium</span> de
            streaming, fáciles y en pesos.
          </h1>

          <p className="max-w-lg text-lg text-muted-foreground">
            Netflix, Disney+, Max, Spotify, ChatGPT Plus y más. Pago por
            transferencia bancaria en MXN, entrega inmediata por WhatsApp y
            soporte humano cuando lo necesites.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95">
              <a href="#tienda">
                <Zap className="h-5 w-5" />
                Ver tienda
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-success/40 text-success hover:bg-success/10 hover:text-success">
              <a href={whatsappLink("Hola Koalas Software 🐨, quiero información sobre sus cuentas premium")} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                Hablar por WhatsApp
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Pago seguro
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Entrega inmediata
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              Soporte WhatsApp
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-primary/30 blur-3xl" />
          <div className="relative animate-float rounded-3xl bg-card p-8 shadow-card">
            <Logo size="xl" showText={false} className="justify-center" />
            <div className="mt-6 text-center">
              <p className="font-display text-2xl font-bold text-foreground">Koalas Software</p>
              <p className="text-sm text-muted-foreground">Streaming premium con corazón 💚</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-primary/10 p-3">
                <div className="font-display text-2xl font-bold text-primary">+50</div>
                <div className="text-xs text-muted-foreground">Servicios</div>
              </div>
              <div className="rounded-xl bg-accent/20 p-3">
                <div className="font-display text-2xl font-bold text-accent-foreground">24/7</div>
                <div className="text-xs text-muted-foreground">Soporte</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
