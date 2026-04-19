import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCart } from "@/store/cart";
import { useSettings } from "@/hooks/use-settings";
import { formatMXN, modalityLabel, durationLabel } from "@/lib/pricing";
import { buildOrderMessage, whatsappLink } from "@/lib/whatsapp";
import { Trash2, Plus, Minus, MessageCircle, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().trim().min(2, "Mínimo 2 caracteres").max(100),
  whatsapp: z.string().trim().min(8, "WhatsApp inválido").max(20),
  email: z.string().trim().email("Email inválido").max(150).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export function CartDrawer() {
  const { items, total, isOpen, setOpen, remove, setQuantity, clear } = useCart();
  const { settings } = useSettings();
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleCheckout() {
    const parsed = formSchema.safeParse({ name, whatsapp, email, notes });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (items.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }

    setSubmitting(true);
    try {
      const itemsPayload = items.map((i) => ({
        product_id: i.product.id,
        product_name: i.product.name,
        modality: i.modality,
        duration: i.duration,
        quantity: i.quantity,
        unit_price: i.unitPrice,
        subtotal: i.subtotal,
      }));

      const { error } = await supabase.rpc("create_public_order", {
        _customer_name: name,
        _customer_whatsapp: whatsapp,
        _customer_email: email || "",
        _items: itemsPayload,
        _total_mxn: total,
        _notes: notes || "",
      });

      if (error) throw error;

      const message = buildOrderMessage(items, total, name, settings.bank_details);
      const url = whatsappLink(message, settings.whatsapp_number);
      window.open(url, "_blank");

      toast.success("¡Pedido registrado! Te redirigimos a WhatsApp 🐨");
      clear();
      setName("");
      setWhatsapp("");
      setEmail("");
      setNotes("");
      setOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("No se pudo registrar el pedido. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-display">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Tu carrito
          </SheetTitle>
          <SheetDescription>Confirma tus productos y paga por WhatsApp.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <ShoppingBag className="mx-auto mb-3 h-10 w-10 opacity-30" />
              Tu carrito está vacío.
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id} className="rounded-2xl border border-border/60 bg-card p-3 shadow-soft">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-display text-sm font-semibold">{item.product.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {modalityLabel(item.modality)} · {durationLabel(item.duration)}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => remove(item.id)} aria-label="Eliminar">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="font-display text-sm font-bold text-primary">{formatMXN(item.subtotal)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-3 border-t border-border/60 bg-muted/30 p-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <Label htmlFor="cart-name" className="text-xs">Nombre *</Label>
                <Input id="cart-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
              </div>
              <div>
                <Label htmlFor="cart-wa" className="text-xs">WhatsApp *</Label>
                <Input id="cart-wa" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+52 ..." />
              </div>
            </div>
            <div>
              <Label htmlFor="cart-email" className="text-xs">Email (opcional)</Label>
              <Input id="cart-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" />
            </div>
            <div>
              <Label htmlFor="cart-notes" className="text-xs">Notas (opcional)</Label>
              <Textarea id="cart-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Alguna preferencia..." className="h-16" />
            </div>

            <div className="flex items-center justify-between border-t border-border/60 pt-3">
              <span className="text-sm font-semibold">Total</span>
              <span className="font-display text-2xl font-bold text-primary">{formatMXN(total)}</span>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={submitting}
              className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
              size="lg"
            >
              <MessageCircle className="h-5 w-5" />
              {submitting ? "Procesando..." : "Pagar por WhatsApp"}
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              Pago por transferencia bancaria · Recibes credenciales por WhatsApp
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
