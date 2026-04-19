export type Modality = "individual" | "compartida" | "perfil";

export interface PricingSettings {
  exchange_rate: number;
  multiplier_individual: number;
  multiplier_compartida: number;
  multiplier_perfil: number;
}

export const DEFAULT_SETTINGS: PricingSettings = {
  exchange_rate: 1,
  multiplier_individual: 1,
  multiplier_compartida: 1,
  multiplier_perfil: 0.6,
};

/** Precio fijo MXN por mes para modalidad "Pantalla individual" en TODOS los productos. */
export const INDIVIDUAL_FIXED_MXN = 80;

export function getMultiplier(settings: PricingSettings, modality: Modality): number {
  switch (modality) {
    case "individual":
      return settings.multiplier_individual;
    case "compartida":
      return settings.multiplier_compartida;
    case "perfil":
      return settings.multiplier_perfil;
  }
}

export function modalityLabel(modality: Modality): string {
  switch (modality) {
    case "individual":
      return "Pantalla individual";
    case "compartida":
      return "Cuenta compartida";
    case "perfil":
      return "Perfil básico";
  }
}

/**
 * Cálculo de precio MXN.
 * - "individual": precio fijo $80 MXN/mes (igual para todos los productos).
 * - "compartida": precio MXN mensual del producto (ya está a mitad de precio en BD).
 * - "perfil": 60% del precio mensual.
 */
export function calculatePriceMXN(
  basePriceMxnMonthly: number,
  modality: Modality,
  durationMonths: number,
  settings: PricingSettings = DEFAULT_SETTINGS
): number {
  let monthly: number;
  if (modality === "individual") {
    monthly = INDIVIDUAL_FIXED_MXN;
  } else {
    const multiplier = getMultiplier(settings, modality);
    monthly = basePriceMxnMonthly * multiplier * settings.exchange_rate;
  }
  return Math.round(monthly * durationMonths);
}

export function formatMXN(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function durationLabel(months: number): string {
  if (months === 1) return "1 mes";
  if (months === 12) return "1 año";
  return `${months} meses`;
}
