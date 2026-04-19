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
      const { data, error } = await supabase.from("settings").select("*").limit(1).maybeSingle();
      if (mounted && !error && data) {
        setSettings({
          id: data.id,
          exchange_rate: Number(data.exchange_rate),
          multiplier_individual: Number(data.multiplier_individual),
          multiplier_compartida: Number(data.multiplier_compartida),
          multiplier_perfil: Number(data.multiplier_perfil),
          whatsapp_number: data.whatsapp_number,
          bank_details: data.bank_details,
          whatsapp_message_template: data.whatsapp_message_template,
          business_name: data.business_name,
          business_owner: data.business_owner,
        });
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { settings, setSettings, loading };
}
