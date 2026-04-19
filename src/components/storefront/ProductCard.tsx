import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";
import { useCart, type Product } from "@/store/cart";
import { calculatePriceMXN, formatMXN, modalityLabel, durationLabel, type Modality, INDIVIDUAL_FIXED_MXN } from "@/lib/pricing";
import { useSettings } from "@/hooks/use-settings";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { Watermark } from "@/components/brand/Watermark";
import { sfx } from "@/lib/sounds";

const categoryColors: Record<string, string> = {
  Streaming: "bg-primary/15 text-primary",
  Música: "bg-secondary text-secondary-foreground",
  IA: "bg-accent/30 text-accent-foreground",
  Deportes: "bg-warning/20 text-warning-foreground",
  Anime: "bg-destructive/15 text-destructive",
  Software: "bg-primary/15 text-primary",
  Combos: "bg-gold/20 text-gold-foreground",
};

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { add } = useCart();
  const { settings } = useSettings();
  const [modality, setModality] = useState<Modality>(product.modalities[0] ?? "individual");
  const [duration, setDuration] = useState<number>(product.durations[0] ?? 1);
  const [justAdded, setJustAdded] = useState(false);

  const catColor = categoryColors[product.category] ?? "bg-primary/15 text-primary";
  const price = calculatePriceMXN(product.base_price_usd, modality, duration, settings);
  const monthly = modality === "individual" ? INDIVIDUAL_FIXED_MXN : Math.round(price / duration);

  const handleAdd = () => {
    add(product, modality, duration, settings);
    sfx.pop();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 600);
  };

  return (
    <Card className="card-premium group flex h-full flex-col overflow-hidden border-border/60 bg-gradient-card shadow-soft">
      <div className="relative h-56 overflow-hidden">
        <BrandIcon slug={product.image_url} category={product.category} />
        {/* Marca de agua giratoria Koalas Software */}
        <div className="absolute bottom-2 right-2 z-20">
          <Watermark size={56} opacity={0.7} />
        </div>
        {product.featured && (
          <Badge className="absolute right-3 top-3 z-20 gap-1 border-0 bg-gold text-gold-foreground shadow-soft animate-badge-pulse">
            <Star className="h-3 w-3 fill-current" /> Top
          </Badge>
        )}
        {modality === "individual" && (
          <Badge className="absolute left-3 top-3 z-20 border-0 bg-success text-success-foreground shadow-soft">
            ¡$80 MXN!
          </Badge>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <Badge variant="secondary" className={`mb-2 border-0 ${catColor}`}>
            {product.category}
          </Badge>
          <h3 className="font-display text-lg font-bold leading-tight">{product.name}</h3>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">Modalidad</label>
          <div className="flex flex-wrap gap-1.5">
            {product.modalities.map((m) => (
              <button
                key={m}
                onClick={() => { setModality(m); sfx.tick(); }}
                onMouseEnter={() => sfx.tick()}
                className={`rounded-full px-3 py-1 text-[11px] font-medium transition-smooth active:scale-95 ${
                  modality === m
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {modalityLabel(m)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">Duración</label>
          <div className="flex flex-wrap gap-1.5">
            {product.durations.map((d) => (
              <button
                key={d}
                onClick={() => { setDuration(d); sfx.tick(); }}
                className={`rounded-full px-3 py-1 text-[11px] font-medium transition-smooth active:scale-95 ${
                  duration === d
                    ? "bg-accent text-accent-foreground shadow-soft"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {durationLabel(d)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</div>
            <div key={price} className="font-display text-2xl font-bold text-primary animate-pop-in">{formatMXN(price)}</div>
            <div className="text-[10px] text-muted-foreground">{formatMXN(monthly)} / mes</div>
          </div>
          <Button
            size="sm"
            onClick={handleAdd}
            className={`bg-gradient-primary text-primary-foreground transition-all hover:opacity-90 hover:scale-105 active:scale-95 ${justAdded ? "animate-pop-in" : ""}`}
          >
            <ShoppingCart className="h-4 w-4" />
            Agregar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
