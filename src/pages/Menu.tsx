import { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Loader2, Download, Image as ImageIcon, FileText, ArrowLeft, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/use-products";
import { useSettings } from "@/hooks/use-settings";
import { calculatePriceMXN, formatMXN, INDIVIDUAL_FIXED_MXN, type Modality } from "@/lib/pricing";
import logo from "@/assets/koalas-logo.webp";
import { whatsappLink, WHATSAPP_NUMBER } from "@/lib/whatsapp";

const SITE_URL = "https://koalas-software-stream-mexico.lovable.app";

export default function Menu() {
  const { products, loading } = useProducts();
  const { settings } = useSettings();
  const posterRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState<"png" | "pdf" | null>(null);

  useEffect(() => {
    document.title = "Menú de Precios — Koalas Software";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Menú de precios premium de streaming, música, IA y software de Koalas Software. Descarga la imagen o el PDF y compártelo.");
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof products>();
    products.forEach((p) => {
      const arr = map.get(p.category) ?? [];
      arr.push(p);
      map.set(p.category, arr);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [products]);

  const priceFor = (basePriceMxn: number, modality: Modality) =>
    calculatePriceMXN(basePriceMxn, modality, 1, settings);

  async function downloadPNG() {
    if (!posterRef.current) return;
    setGenerating("png");
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `menu-koalas-software-${new Date().toISOString().slice(0, 10)}.png`;
      a.click();
    } finally {
      setGenerating(null);
    }
  }

  async function downloadPDF() {
    if (!posterRef.current) return;
    setGenerating("pdf");
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
      pdf.save(`menu-koalas-software-${new Date().toISOString().slice(0, 10)}.pdf`);
    } finally {
      setGenerating(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container">
        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" /> Volver a la tienda
            </Link>
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button onClick={downloadPNG} disabled={generating !== null} className="bg-primary">
              {generating === "png" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
              Descargar imagen (PNG)
            </Button>
            <Button onClick={downloadPDF} disabled={generating !== null} variant="outline" className="border-primary text-primary">
              {generating === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              Descargar PDF
            </Button>
          </div>
        </div>

        <p className="mb-6 text-center text-sm text-muted-foreground">
          📲 Descarga la imagen o PDF y compártelo en WhatsApp, Facebook o donde quieras. Los precios se actualizan solos.
        </p>

        {/* POSTER */}
        <div className="overflow-x-auto">
          <div
            ref={posterRef}
            style={{
              width: "1080px",
              background: "linear-gradient(135deg, hsl(165 40% 92%) 0%, hsl(36 50% 96%) 50%, hsl(22 60% 92%) 100%)",
              padding: "48px",
              fontFamily: "'Inter', system-ui, sans-serif",
              color: "hsl(195 25% 22%)",
              margin: "0 auto",
              borderRadius: "24px",
              boxShadow: "0 20px 60px -20px hsl(195 30% 30% / 0.25)",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px" }}>
              <img
                src={logo}
                alt="Koalas Software"
                crossOrigin="anonymous"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  boxShadow: "0 8px 24px hsl(165 30% 50% / 0.3)",
                  border: "4px solid white",
                }}
              />
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: "48px", fontWeight: 800, margin: 0, lineHeight: 1.1, color: "hsl(165 45% 35%)" }}>
                  Koalas Software 🐨
                </h1>
                <p style={{ fontSize: "20px", margin: "8px 0 0 0", color: "hsl(195 20% 40%)", fontWeight: 500 }}>
                  Streaming Premium · Música · IA · Software
                </p>
                <p style={{ fontSize: "14px", margin: "6px 0 0 0", color: "hsl(195 15% 50%)" }}>
                  Por {settings.business_owner || "Luis Javier Esquinca Rodríguez"}
                </p>
              </div>
              <div
                style={{
                  background: "hsl(165 45% 35%)",
                  color: "white",
                  padding: "12px 20px",
                  borderRadius: "16px",
                  fontWeight: 700,
                  fontSize: "14px",
                  textAlign: "center",
                  boxShadow: "0 6px 16px hsl(165 30% 40% / 0.3)",
                }}
              >
                LISTA DE<br />PRECIOS
                <div style={{ fontSize: "11px", fontWeight: 500, marginTop: "4px", opacity: 0.9 }}>
                  {new Date().toLocaleDateString("es-MX", { month: "long", year: "numeric" })}
                </div>
              </div>
            </div>

            {/* Banner promo */}
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "16px 24px",
                marginBottom: "28px",
                display: "flex",
                justifyContent: "space-around",
                gap: "12px",
                boxShadow: "0 4px 12px hsl(195 20% 30% / 0.08)",
                fontSize: "14px",
                fontWeight: 600,
                color: "hsl(165 45% 35%)",
              }}
            >
              <span>✓ Garantía total</span>
              <span>✓ Entrega 24/7</span>
              <span>✓ Soporte directo</span>
              <span>✓ Pago seguro</span>
            </div>

            {/* Productos por categoría */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
              {grouped.map(([category, items]) => (
                <div
                  key={category}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "20px",
                    boxShadow: "0 4px 16px hsl(195 20% 30% / 0.08)",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      margin: "0 0 14px 0",
                      color: "hsl(165 45% 35%)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "2px solid hsl(165 35% 80%)",
                      paddingBottom: "8px",
                    }}
                  >
                    {category}
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {items.map((p) => (
                      <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "15px", fontWeight: 700, color: "hsl(195 25% 22%)" }}>{p.name}</div>
                          <div style={{ fontSize: "11px", color: "hsl(195 15% 50%)" }}>
                            Individual · Compartida · Perfil
                          </div>
                        </div>
                        <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                          <div style={{ fontSize: "11px", color: "hsl(195 15% 50%)", lineHeight: 1.2 }}>desde</div>
                          <div style={{ fontSize: "20px", fontWeight: 800, color: "hsl(22 75% 50%)", lineHeight: 1.1 }}>
                            {formatMXN(Math.min(
                              priceFor(p.base_price_usd, "perfil"),
                              priceFor(p.base_price_usd, "compartida"),
                              INDIVIDUAL_FIXED_MXN
                            ))}
                          </div>
                          <div style={{ fontSize: "10px", color: "hsl(195 15% 50%)" }}>/mes</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer con QR + WhatsApp */}
            <div
              style={{
                background: "hsl(165 45% 35%)",
                borderRadius: "20px",
                padding: "28px",
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "28px",
              }}
            >
              <div
                style={{
                  background: "white",
                  padding: "12px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                <QRCodeSVG value={SITE_URL} size={140} level="M" includeMargin={false} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", opacity: 0.85, marginBottom: "4px", letterSpacing: "0.1em" }}>
                  ESCANEA Y COMPRA EN LÍNEA
                </div>
                <div style={{ fontSize: "26px", fontWeight: 800, marginBottom: "12px" }}>
                  koalas-software-stream-mexico.lovable.app
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", fontWeight: 700 }}>
                  <span style={{ fontSize: "24px" }}>💬</span>
                  WhatsApp: +{settings.whatsapp_number || WHATSAPP_NUMBER}
                </div>
                <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "10px" }}>
                  Pide tu cuenta — entrega inmediata por WhatsApp · Precios en pesos mexicanos (MXN)
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "20px", fontSize: "11px", color: "hsl(195 15% 50%)" }}>
              © {new Date().getFullYear()} Koalas Software · {settings.business_owner || "Luis Javier Esquinca Rodríguez"} · Precios sujetos a cambio sin previo aviso
            </div>
          </div>
        </div>

        {/* Botón flotante de WhatsApp */}
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" className="bg-success hover:bg-success/90">
            <a href={whatsappLink("Hola Koalas Software, vi su menú de precios 🐨", settings.whatsapp_number || WHATSAPP_NUMBER)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              Pedir por WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
