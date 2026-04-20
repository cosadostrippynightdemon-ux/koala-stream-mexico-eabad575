import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/store/cart";
import type { Modality } from "@/lib/pricing";

async function fetchProducts(includeInactive: boolean): Promise<Product[]> {
  let query = supabase.from("products").select("*").order("sort_order", { ascending: true });
  if (!includeInactive) query = query.eq("active", true);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((p) => ({
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
  }));
}

export function useProducts(includeInactive = false) {
  const qc = useQueryClient();
  const key = ["products", { includeInactive }] as const;
  const { data, isLoading } = useQuery({
    queryKey: key,
    queryFn: () => fetchProducts(includeInactive),
    staleTime: 1000 * 60 * 5,
  });

  return {
    products: data ?? [],
    loading: isLoading,
    refresh: () => qc.invalidateQueries({ queryKey: ["products"] }),
  };
}
