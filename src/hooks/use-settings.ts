import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_SETTINGS, type PricingSettings } from "@/lib/pricing";

export interface FullSettings extends PricingSettings {
  id?: string;
  whatsapp_number: string;
  bank_details: string;
  whatsapp_message_template: string;
  business_name: string;
  business_owner: string;
}

export const DEFAULT_FULL_SETTINGS: FullSettings = {
  ...DEFAULT_SETTINGS,
  whatsapp_number: "529682454083",
  bank_details: "Banco: BBVA\nTitular: Luis Javier Esquinca Rodríguez\nCLABE: (configurar)\nCuenta: (configurar)",
  whatsapp_message_template: "Hola Koalas Software 🐨, quiero comprar:",
  business_name: "Koalas Software",
  business_owner: "Luis Javier Esquinca Rodríguez",
};

export function useSettings() {
  const [settings, setSettings] = useState<FullSettings>(DEFAULT_FULL_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      // Try admin-level full read first (works only for admins via RLS).
      const { data: full } = await supabase.from("settings").select("*").limit(1).maybeSingle();
      if (mounted && full) {
        setSettings({
          id: full.id,
          exchange_rate: Number(full.exchange_rate),
          multiplier_individual: Number(full.multiplier_individual),
          multiplier_compartida: Number(full.multiplier_compartida),
          multiplier_perfil: Number(full.multiplier_perfil),
          whatsapp_number: full.whatsapp_number,
          bank_details: full.bank_details,
          whatsapp_message_template: full.whatsapp_message_template,
          business_name: full.business_name,
          business_owner: full.business_owner,
        });
        setLoading(false);
        return;
      }

      // Public visitors: only safe fields via RPC. bank_details stays empty
      // and is delivered by create_public_order at checkout time.
      const { data: pub } = await (supabase.rpc as any)("get_public_settings");
      const row = Array.isArray(pub) ? pub[0] : pub;
      if (mounted && row) {
        setSettings((prev) => ({
          ...prev,
          exchange_rate: Number(row.exchange_rate),
          multiplier_individual: Number(row.multiplier_individual),
          multiplier_compartida: Number(row.multiplier_compartida),
          multiplier_perfil: Number(row.multiplier_perfil),
          whatsapp_number: row.whatsapp_number,
          whatsapp_message_template: row.whatsapp_message_template,
          business_name: row.business_name,
          bank_details: "",
        }));
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { settings, setSettings, loading };
}
