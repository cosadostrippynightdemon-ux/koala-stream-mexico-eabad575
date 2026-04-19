import { Zap, Coins, MessageCircle, RefreshCw, MapPin } from "lucide-react";

const items = [
  { icon: Zap, label: "Entrega inmediata" },
  { icon: Coins, label: "Pago en pesos MXN" },
  { icon: MessageCircle, label: "Soporte WhatsApp" },
  { icon: RefreshCw, label: "Renovación fácil" },
  { icon: MapPin, label: "México y Latam 🇲🇽" },
];

export function Benefits() {
  return (
    <section className="border-y border-border/60 bg-card">
      <div className="container grid grid-cols-2 gap-4 py-8 md:grid-cols-5">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center justify-center gap-2 text-sm font-medium text-foreground/80">
            <Icon className="h-5 w-5 text-primary" />
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}
