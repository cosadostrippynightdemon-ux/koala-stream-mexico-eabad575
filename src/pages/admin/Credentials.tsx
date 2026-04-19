import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Eye, EyeOff, Copy, MessageCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { whatsappLink } from "@/lib/whatsapp";

interface CredRow {
  id: string;
  product_name: string;
  modality: string | null;
  account_email: string;
  account_password: string;
  delivered_at: string;
  expires_at: string;
  customer_name?: string;
  customer_whatsapp?: string;
  order_id: string | null;
  customer_id: string | null;
}

export default function Credentials() {
  const [creds, setCreds] = useState<CredRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [reveal, setReveal] = useState<Record<string, boolean>>({});

  async function load() {
    setLoading(true);
    const [{ data: c }, { data: customers }] = await Promise.all([
      supabase.from("delivered_credentials").select("*").order("expires_at", { ascending: true }),
      supabase.from("customers").select("id, name, whatsapp"),
    ]);
    const cmap = new Map((customers ?? []).map((x: any) => [x.id, x]));
    setCreds(
      (c ?? []).map((row: any) => ({
        ...row,
        customer_name: row.customer_id ? cmap.get(row.customer_id)?.name : undefined,
        customer_whatsapp: row.customer_id ? cmap.get(row.customer_id)?.whatsapp : undefined,
      }))
    );
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("¿Eliminar este registro de credencial?")) return;
    await supabase.from("delivered_credentials").delete().eq("id", id);
    toast.success("Eliminado");
    load();
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copiado");
  }

  const filtered = creds.filter(
    (c) =>
      !query ||
      c.product_name.toLowerCase().includes(query.toLowerCase()) ||
      c.account_email.toLowerCase().includes(query.toLowerCase()) ||
      (c.customer_name ?? "").toLowerCase().includes(query.toLowerCase())
  );

  function statusFor(expires: string) {
    const days = differenceInDays(new Date(expires), new Date());
    if (days < 0) return { label: "Vencida", color: "bg-destructive/20 text-destructive" };
    if (days <= 3) return { label: `${days}d`, color: "bg-warning/20 text-warning-foreground" };
    if (days <= 7) return { label: `${days}d`, color: "bg-accent/30 text-accent-foreground" };
    return { label: `${days}d`, color: "bg-success/20 text-success" };
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Credenciales entregadas</h1>
        <p className="text-muted-foreground">Correo y contraseña que entregaste a cada cliente, con fecha de vencimiento.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar producto, cliente, correo..." className="pl-10" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">Sin credenciales registradas.</CardContent></Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((c) => {
            const st = statusFor(c.expires_at);
            return (
              <Card key={c.id} className="shadow-soft">
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display font-semibold">{c.product_name}</h3>
                      {c.modality && <p className="text-xs text-muted-foreground">{c.modality}</p>}
                      {c.customer_name && <p className="text-xs">Para: <strong>{c.customer_name}</strong></p>}
                    </div>
                    <Badge className={`border-0 ${st.color}`}>{st.label}</Badge>
                  </div>

                  <div className="space-y-1 rounded-xl bg-muted p-3 font-mono text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">📧 {c.account_email}</span>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copy(c.account_email)}><Copy className="h-3 w-3" /></Button>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">🔒 {reveal[c.id] ? c.account_password : "••••••••"}</span>
                      <div className="flex">
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setReveal((r) => ({ ...r, [c.id]: !r[c.id] }))}>
                          {reveal[c.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copy(c.account_password)}><Copy className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Entregado: {format(new Date(c.delivered_at), "PP", { locale: es })}</span>
                    <span>Vence: {format(new Date(c.expires_at), "PP", { locale: es })}</span>
                  </div>

                  <div className="flex gap-2">
                    {c.customer_whatsapp && (
                      <Button asChild size="sm" variant="outline" className="flex-1 text-success hover:bg-success/10 hover:text-success">
                        <a href={whatsappLink(`Hola ${c.customer_name} 🐨, te recordamos que tu cuenta de ${c.product_name} vence pronto. ¿Quieres renovar?`, c.customer_whatsapp.replace(/\D/g, ""))} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="h-3 w-3" /> Renovar
                        </a>
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => remove(c.id)} className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
