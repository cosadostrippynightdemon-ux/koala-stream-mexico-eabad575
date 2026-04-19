import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, MessageCircle, Eye, KeyRound, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatMXN, modalityLabel, durationLabel } from "@/lib/pricing";
import { whatsappLink } from "@/lib/whatsapp";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface OrderRow {
  id: string;
  customer_name: string;
  customer_whatsapp: string;
  items: any[];
  total_mxn: number;
  status: string;
  notes: string | null;
  created_at: string;
  customer_id: string | null;
}

const statusOptions = ["todos", "pendiente", "pagado", "entregado", "vencido", "cancelado"];

const statusBadge: Record<string, string> = {
  pendiente: "bg-warning/20 text-warning-foreground",
  pagado: "bg-primary/20 text-primary",
  entregado: "bg-success/20 text-success",
  vencido: "bg-destructive/20 text-destructive",
  cancelado: "bg-muted text-muted-foreground",
};

export default function Orders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todos");
  const [viewing, setViewing] = useState<OrderRow | null>(null);
  const [credOrder, setCredOrder] = useState<OrderRow | null>(null);
  const [credEmail, setCredEmail] = useState("");
  const [credPassword, setCredPassword] = useState("");
  const [credProductIdx, setCredProductIdx] = useState(0);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data ?? []) as any);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function changeStatus(id: string, status: string) {
    const { error } = await supabase.from("orders").update({ status: status as any }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Estado actualizado");
    load();
  }

  async function deleteOrder(id: string) {
    if (!confirm("¿Eliminar este pedido?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Eliminado");
    load();
  }

  async function deliverCredentials() {
    if (!credOrder || !credEmail.trim() || !credPassword.trim()) {
      toast.error("Llena todos los campos");
      return;
    }
    const item = credOrder.items[credProductIdx];
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + (Number(item.duration) || 1));

    const { error } = await (supabase.rpc as any)("admin_save_credential", {
      _id: null,
      _order_id: credOrder.id,
      _customer_id: credOrder.customer_id,
      _product_name: item.product_name,
      _modality: item.modality,
      _account_email: credEmail.trim(),
      _account_password: credPassword.trim(),
      _expires_at: expiresAt.toISOString(),
      _notes: null,
    });

    if (error) return toast.error(error.message);

    await supabase.from("orders").update({ status: "entregado" as any }).eq("id", credOrder.id);

    toast.success("Credenciales registradas y pedido marcado como entregado 🐨");
    setCredOrder(null);
    setCredEmail("");
    setCredPassword("");
    load();
  }

  const filtered = orders.filter((o) => filter === "todos" || o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Pedidos</h1>
          <p className="text-muted-foreground">Gestiona los pedidos de tus clientes.</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">Sin pedidos.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <Card key={o.id} className="shadow-soft">
              <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold">{o.customer_name}</span>
                    <Badge className={`border-0 ${statusBadge[o.status] ?? ""}`}>{o.status}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(o.created_at), "PPp", { locale: es })} · {o.customer_whatsapp} · {o.items.length} producto(s)
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg font-bold text-primary">{formatMXN(Number(o.total_mxn))}</span>
                  <Select value={o.status} onValueChange={(v) => changeStatus(o.id, v)}>
                    <SelectTrigger className="h-9 w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statusOptions.filter((s) => s !== "todos").map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="outline" onClick={() => setViewing(o)}><Eye className="h-4 w-4" /></Button>
                  <Button size="icon" variant="outline" onClick={() => { setCredOrder(o); setCredProductIdx(0); }}>
                    <KeyRound className="h-4 w-4" />
                  </Button>
                  <Button asChild size="icon" variant="outline" className="text-success hover:bg-success/10">
                    <a href={whatsappLink(`Hola ${o.customer_name}, soy Koalas Software 🐨 sobre tu pedido.`, o.customer_whatsapp.replace(/\D/g, ""))} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => deleteOrder(o.id)} className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View order */}
      <Dialog open={!!viewing} onOpenChange={(v) => !v && setViewing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="font-display">Detalle del pedido</DialogTitle></DialogHeader>
          {viewing && (
            <div className="space-y-3">
              <div><span className="text-xs text-muted-foreground">Cliente:</span> <strong>{viewing.customer_name}</strong></div>
              <div><span className="text-xs text-muted-foreground">WhatsApp:</span> {viewing.customer_whatsapp}</div>
              <div><span className="text-xs text-muted-foreground">Fecha:</span> {format(new Date(viewing.created_at), "PPp", { locale: es })}</div>
              <div className="space-y-2 rounded-xl bg-muted p-3">
                {viewing.items.map((it: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{it.product_name} — {modalityLabel(it.modality)} — {durationLabel(it.duration)} ×{it.quantity}</span>
                    <strong>{formatMXN(Number(it.subtotal))}</strong>
                  </div>
                ))}
                <div className="flex justify-between border-t border-border pt-2 font-display font-bold">
                  <span>Total</span><span>{formatMXN(Number(viewing.total_mxn))}</span>
                </div>
              </div>
              {viewing.notes && (
                <div><span className="text-xs text-muted-foreground">Notas:</span> {viewing.notes}</div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Deliver credentials */}
      <Dialog open={!!credOrder} onOpenChange={(v) => !v && setCredOrder(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Entregar credenciales</DialogTitle></DialogHeader>
          {credOrder && (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">Cliente: <strong>{credOrder.customer_name}</strong></div>
              <div>
                <label className="text-xs font-semibold">Producto</label>
                <Select value={String(credProductIdx)} onValueChange={(v) => setCredProductIdx(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {credOrder.items.map((it: any, i: number) => (
                      <SelectItem key={i} value={String(i)}>{it.product_name} — {modalityLabel(it.modality)} — {durationLabel(it.duration)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold">Correo de la cuenta</label>
                <input className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={credEmail} onChange={(e) => setCredEmail(e.target.value)} placeholder="cuenta@ejemplo.com" />
              </div>
              <div>
                <label className="text-xs font-semibold">Contraseña</label>
                <input className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={credPassword} onChange={(e) => setCredPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <Button onClick={deliverCredentials} className="w-full bg-gradient-primary text-primary-foreground">
                Registrar y marcar como entregado
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
