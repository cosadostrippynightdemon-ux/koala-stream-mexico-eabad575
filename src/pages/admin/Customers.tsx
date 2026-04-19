import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MessageCircle, Search, Mail } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatMXN } from "@/lib/pricing";

interface CustomerRow {
  id: string;
  name: string;
  whatsapp: string;
  email: string | null;
  notes: string | null;
  created_at: string;
  totalSpent: number;
  orderCount: number;
}

export default function Customers() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      const [{ data: cust }, { data: orders }] = await Promise.all([
        supabase.from("customers").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select("customer_id, total_mxn, status"),
      ]);
      const stats = new Map<string, { total: number; count: number }>();
      (orders ?? []).forEach((o) => {
        if (!o.customer_id) return;
        const cur = stats.get(o.customer_id) ?? { total: 0, count: 0 };
        cur.count += 1;
        if (o.status === "pagado" || o.status === "entregado") cur.total += Number(o.total_mxn);
        stats.set(o.customer_id, cur);
      });
      setCustomers(
        (cust ?? []).map((c: any) => ({
          ...c,
          totalSpent: stats.get(c.id)?.total ?? 0,
          orderCount: stats.get(c.id)?.count ?? 0,
        }))
      );
      setLoading(false);
    })();
  }, []);

  const filtered = customers.filter(
    (c) =>
      !query ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.whatsapp.includes(query) ||
      (c.email ?? "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Clientes</h1>
        <p className="text-muted-foreground">Lista de clientes registrados.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre, WhatsApp..." className="pl-10" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Card key={c.id} className="shadow-soft">
              <CardContent className="space-y-2 p-4">
                <div>
                  <h3 className="font-display font-semibold">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">Cliente desde {format(new Date(c.created_at), "PP", { locale: es })}</p>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageCircle className="h-3 w-3" /> {c.whatsapp}
                  </div>
                  {c.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3 w-3" /> {c.email}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-border pt-2 text-xs">
                  <span className="text-muted-foreground">{c.orderCount} pedidos</span>
                  <span className="font-display font-bold text-primary">{formatMXN(c.totalSpent)}</span>
                </div>
                <Button asChild size="sm" variant="outline" className="w-full text-success hover:bg-success/10 hover:text-success">
                  <a href={whatsappLink(`Hola ${c.name} 🐨`, c.whatsapp.replace(/\D/g, ""))} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-3 w-3" /> WhatsApp
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Card className="md:col-span-2 lg:col-span-3"><CardContent className="py-16 text-center text-muted-foreground">Sin clientes aún.</CardContent></Card>
          )}
        </div>
      )}
    </div>
  );
}
