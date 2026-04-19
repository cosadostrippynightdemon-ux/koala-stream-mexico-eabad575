import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Modality } from "@/lib/pricing";
import { calculatePriceMXN, type PricingSettings, DEFAULT_SETTINGS } from "@/lib/pricing";

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string | null;
  image_url: string | null;
  base_price_usd: number;
  modalities: Modality[];
  durations: number[];
  active: boolean;
  featured: boolean;
}

export interface CartItem {
  id: string; // unique combo: product+modality+duration
  product: Product;
  modality: Modality;
  duration: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
  add: (product: Product, modality: Modality, duration: number, settings: PricingSettings) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  clear: () => void;
  recalculate: (settings: PricingSettings) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "koalas_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const total = items.reduce((s, i) => s + i.subtotal, 0);
    const count = items.reduce((s, i) => s + i.quantity, 0);
    return {
      items,
      count,
      total,
      isOpen,
      setOpen,
      add: (product, modality, duration, settings) => {
        const id = `${product.id}-${modality}-${duration}`;
        const unitPrice = calculatePriceMXN(product.base_price_usd, modality, duration, settings);
        setItems((prev) => {
          const existing = prev.find((i) => i.id === id);
          if (existing) {
            return prev.map((i) =>
              i.id === id
                ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * unitPrice }
                : i
            );
          }
          return [
            ...prev,
            { id, product, modality, duration, quantity: 1, unitPrice, subtotal: unitPrice },
          ];
        });
        setOpen(true);
      },
      remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      setQuantity: (id, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((i) => i.id !== id)
            : prev.map((i) => (i.id === id ? { ...i, quantity: qty, subtotal: qty * i.unitPrice } : i))
        ),
      clear: () => setItems([]),
      recalculate: (settings) =>
        setItems((prev) =>
          prev.map((i) => {
            const unitPrice = calculatePriceMXN(i.product.base_price_usd, i.modality, i.duration, settings);
            return { ...i, unitPrice, subtotal: unitPrice * i.quantity };
          })
        ),
    };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export { DEFAULT_SETTINGS };
