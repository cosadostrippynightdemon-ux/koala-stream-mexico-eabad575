import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/store/cart";
import type { Modality } from "@/lib/pricing";

export function useProducts(includeInactive = false) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      let query = supabase.from("products").select("*").order("sort_order", { ascending: true });
      if (!includeInactive) query = query.eq("active", true);
      const { data, error } = await query;
      if (mounted && !error && data) {
        setProducts(
          data.map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            description: p.description,
            image_url: p.image_url,
            base_price_usd: Number(p.base_price_usd),
            modalities: (p.modalities as Modality[]) ?? ["individual", "compartida", "perfil"],
            durations: (p.durations as number[]) ?? [1, 3, 6, 12],
            active: p.active,
            featured: p.featured,
          }))
        );
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [includeInactive, refreshTick]);

  return { products, loading, refresh: () => setRefreshTick((t) => t + 1) };
}
