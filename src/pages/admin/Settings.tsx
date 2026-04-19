import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SettingsRow {
  id: string;
  exchange_rate: number;
  multiplier_individual: number;
  multiplier_compartida: number;
  multiplier_perfil: number;
  whatsapp_number: string;
  bank_details: string;
  whatsapp_message_template: string;
  business_name: string;
  business_owner: string;
}

export default function Settings() {
  const [s, setS] = useState<SettingsRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("settings").select("*").limit(1).maybeSingle();
      if (data) setS(data as any);
      setLoading(false);
    })();
  }, []);

  async function save() {
    if (!s) return;
    setSaving(true);
    const { error } = await supabase.from("settings").update({
      exchange_rate: Number(s.exchange_rate),
      multiplier_individual: Number(s.multiplier_individual),
      multiplier_compartida: Number(s.multiplier_compartida),
      multiplier_perfil: Number(s.multiplier_perfil),
      whatsapp_number: s.whatsapp_number,
      bank_details: s.bank_details,
      whatsapp_message_template: s.whatsapp_message_template,
      business_name: s.business_name,
      business_owner: s.business_owner,
    }).eq("id", s.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Configuración guardada 🐨");
  }

  if (loading || !s) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">Ajusta precios, datos bancarios y contacto.</p>
      </div>

      <Card className="shadow-soft">
        <CardHeader><CardTitle className="font-display">Precios</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <Label>Tipo de cambio MXN/USD</Label>
            <Input type="number" step="0.01" value={s.exchange_rate} onChange={(e) => setS({ ...s, exchange_rate: Number(e.target.value) })} />
          </div>
          <div>
            <Label>Multiplicador Individual</Label>
            <Input type="number" step="0.1" value={s.multiplier_individual} onChange={(e) => setS({ ...s, multiplier_individual: Number(e.target.value) })} />
          </div>
          <div>
            <Label>Multiplicador Compartida</Label>
            <Input type="number" step="0.1" value={s.multiplier_compartida} onChange={(e) => setS({ ...s, multiplier_compartida: Number(e.target.value) })} />
          </div>
          <div>
            <Label>Multiplicador Perfil</Label>
            <Input type="number" step="0.1" value={s.multiplier_perfil} onChange={(e) => setS({ ...s, multiplier_perfil: Number(e.target.value) })} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader><CardTitle className="font-display">Datos del negocio</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Nombre del negocio</Label>
            <Input value={s.business_name} onChange={(e) => setS({ ...s, business_name: e.target.value })} />
          </div>
          <div>
            <Label>Propietario</Label>
            <Input value={s.business_owner} onChange={(e) => setS({ ...s, business_owner: e.target.value })} />
          </div>
          <div>
            <Label>WhatsApp (sólo dígitos, con lada)</Label>
            <Input value={s.whatsapp_number} onChange={(e) => setS({ ...s, whatsapp_number: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label>Datos bancarios (se incluyen en el mensaje WhatsApp)</Label>
            <Textarea rows={5} value={s.bank_details} onChange={(e) => setS({ ...s, bank_details: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label>Plantilla de mensaje</Label>
            <Textarea rows={3} value={s.whatsapp_message_template} onChange={(e) => setS({ ...s, whatsapp_message_template: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={save} disabled={saving} className="bg-gradient-primary text-primary-foreground">
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Guardar cambios
      </Button>
    </div>
  );
}
