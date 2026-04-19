import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, KeyRound, AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import { formatMXN } from "@/lib/pricing";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2 } from "lucide-react";

interface Stats {
  monthRevenue: number;
  totalRevenue: number;
  pendingOrders: number;
  totalCustomers: number;
  expiringCount: number;
  productCount: number;
  recentSales: { date: string; total: number }[];
  byCategory: { name: string; value: number }[];
}

const PIE_COLORS = ["hsl(165 35% 56%)", "hsl(22 65% 70%)", "hsl(38 75% 65%)", "hsl(195 30% 50%)", "hsl(42 70% 60%)", "hsl(0 60% 60%)"];

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const [ordersRes, customersRes, credsRes, productsRes] = await Promise.all([
          supabase.from("orders").select("*"),
          supabase.from("customers").select("id", { count: "exact", head: true }),
          supabase.from("delivered_credentials").select("expires_at"),
          supabase.from("products").select("id", { count: "exact", head: true }),
        ]);

        const orders = ordersRes.data ?? [];
        const monthRevenue = orders
          .filter((o) => new Date(o.created_at) >= monthStart && (o.status === "pagado" || o.status === "entregado"))
          .reduce((s, o) => s + Number(o.total_mxn), 0);

        const totalRevenue = orders
          .filter((o) => o.status === "pagado" || o.status === "entregado")
          .reduce((s, o) => s + Number(o.total_mxn), 0);

        const pendingOrders = orders.filter((o) => o.status === "pendiente").length;

        const now = new Date();
        const in7days = new Date();
        in7days.setDate(now.getDate() + 7);
        const expiringCount = (credsRes.data ?? []).filter((c) => {
          const exp = new Date(c.expires_at);
          return exp >= now && exp <= in7days;
        }).length;

        // Last 7 days
        const recentSales: { date: string; total: number }[] = [];
        for (let i = 6; i >= 0; i--) {
          const day = startOfDay(subDays(new Date(), i));
          const next = new Date(day);
          next.setDate(next.getDate() + 1);
          const total = orders
            .filter((o) => {
              const d = new Date(o.created_at);
              return d >= day && d < next && (o.status === "pagado" || o.status === "entregado");
            })
            .reduce((s, o) => s + Number(o.total_mxn), 0);
          recentSales.push({ date: format(day, "d MMM", { locale: es }), total });
        }

        // By category from items
        const catTotals = new Map<string, number>();
        orders.forEach((o) => {
          if (o.status !== "pagado" && o.status !== "entregado") return;
          (o.items as any[]).forEach((it) => {
            const cat = it.category ?? "Otros";
            catTotals.set(cat, (catTotals.get(cat) ?? 0) + Number(it.subtotal ?? 0));
          });
        });
        const byCategory = Array.from(catTotals.entries()).map(([name, value]) => ({ name, value }));

        setStats({
          monthRevenue,
          totalRevenue,
          pendingOrders,
          totalCustomers: customersRes.count ?? 0,
          expiringCount,
          productCount: productsRes.count ?? 0,
          recentSales,
          byCategory,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const cards = [
    { label: "Ventas del mes", value: formatMXN(stats.monthRevenue), icon: TrendingUp, color: "text-success bg-success/10" },
    { label: "Ingresos totales", value: formatMXN(stats.totalRevenue), icon: DollarSign, color: "text-primary bg-primary/10" },
    { label: "Pedidos pendientes", value: stats.pendingOrders.toString(), icon: ShoppingCart, color: "text-warning bg-warning/10" },
    { label: "Clientes", value: stats.totalCustomers.toString(), icon: Users, color: "text-accent-foreground bg-accent/30" },
    { label: "Productos activos", value: stats.productCount.toString(), icon: Package, color: "text-primary bg-primary/10" },
    { label: "Por vencer (7 días)", value: stats.expiringCount.toString(), icon: AlertTriangle, color: "text-destructive bg-destructive/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard 🐨</h1>
        <p className="text-muted-foreground">Resumen general de Koalas Software.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-border/60 shadow-soft">
            <CardContent className="p-4">
              <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="font-display text-lg font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="font-display text-base">Ventas últimos 7 días</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.recentSales}>
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                  formatter={(v: number) => formatMXN(v)}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="font-display text-base">Ingresos por categoría</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {stats.byCategory.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Aún no hay ventas confirmadas.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.byCategory} dataKey="value" nameKey="name" outerRadius={90} label>
                    {stats.byCategory.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatMXN(v)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
