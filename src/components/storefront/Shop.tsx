import { useMemo, useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "./ProductCard";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

const ALL = "Todos";

export function Shop() {
  const { products, loading } = useProducts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return [ALL, ...Array.from(set).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = category === ALL || p.category === category;
      const matchQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.description ?? "").toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [products, query, category]);

  return (
    <section id="tienda" className="pt-6 pb-12">
      <div className="container">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Catálogo completo</p>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Nuestra tienda</h2>
          <p className="mt-3 text-muted-foreground">
            Cuentas premium de streaming, música, IA y software. Todos los precios en pesos mexicanos.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar Netflix, Spotify, ChatGPT..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-smooth ${
                  category === c
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-card text-foreground/70 hover:bg-muted"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-card py-16 text-center text-muted-foreground">
            No se encontraron productos.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
