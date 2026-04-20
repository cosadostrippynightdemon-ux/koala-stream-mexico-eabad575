import type { CartItem } from "@/store/cart";
import { formatMXN, modalityLabel, durationLabel } from "@/lib/pricing";

export const WHATSAPP_NUMBER = "529682454083";
export const WHATSAPP_DISPLAY = "+52 968 245 4083";

export function whatsappLink(message: string, number: string = WHATSAPP_NUMBER): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildOrderMessage(
  items: CartItem[],
  total: number,
  customerName: string,
  bankDetails: string
): string {
  const totalProducts = items.reduce((acc, i) => acc + i.quantity, 0);
  const greeting =
    customerName && customerName !== "Cliente"
      ? `Hola Koalas Software 🐨, soy ${customerName}.`
      : `Hola Koalas Software 🐨,`;
  const lines: string[] = [
    greeting,
    `Quiero comprar:`,
    ``,
  ];
  for (const item of items) {
    lines.push(
      `• ${item.product.name} — ${modalityLabel(item.modality)} — ${durationLabel(item.duration)} × ${item.quantity} = ${formatMXN(item.subtotal)}`
    );
  }
  lines.push(``);
  lines.push(`📦 *Productos: ${totalProducts}*`);
  lines.push(`💰 *TOTAL: ${formatMXN(total)} MXN*`);
  lines.push(``);
  lines.push(`📥 Pago por transferencia bancaria:`);
  lines.push(bankDetails);
  lines.push(``);
  lines.push(`En cuanto confirme el pago me envías por WhatsApp el correo y contraseña de mi cuenta premium. ¡Gracias!`);
  return lines.join("\n");
}
