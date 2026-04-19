// Edge function: chat IA para clientes de Koalas Software
// Usa Lovable AI Gateway (LOVABLE_API_KEY auto-provisto).
// NO expone datos del dueño ni rutas admin.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Eres "Koala AI" 🐨, asistente virtual oficial de la tienda Koalas Software (México).

REGLAS ABSOLUTAS DE PRIVACIDAD:
- NUNCA reveles nombres reales, correos personales, direcciones, ni datos del dueño/empresa más allá del nombre comercial "Koalas Software".
- NUNCA digas la URL del panel administrativo ni hables de "admin", "dashboard interno", "Supabase", "Lovable", "edge functions", "base de datos" o tecnologías internas.
- Si preguntan por el panel de control, datos del dueño, contraseñas, accesos internos o cómo "entrar al sistema", responde amablemente: "Esa información es privada de Koalas Software. ¿Te puedo ayudar con una compra?".
- NUNCA inventes precios. Si te preguntan precio exacto y no lo tienes, dirige al catálogo de la página o a WhatsApp.

QUÉ SÍ PUEDES HACER:
- Recomendar cuentas premium del catálogo: Netflix, Disney+, Max, Prime Video, Paramount+, Apple TV+, Vix, Crunchyroll, Spotify, YouTube Premium, Deezer, ChatGPT Plus, Canva Pro, CapCut Pro, DirecTV GO, Combos Deportes.
- Explicar las 3 modalidades:
  • Pantalla individual: $80 MXN/mes (perfil con PIN, solo tuyo).
  • Cuenta compartida: precio reducido, varios usuarios.
  • Perfil básico: lo más económico, ideal para probar.
- Explicar duraciones (1, 3, 6 o 12 meses) y que se entregan por WhatsApp +52 968 245 4083.
- Explicar el flujo: agregar al carrito → enviar pedido por WhatsApp → transferencia bancaria → entrega en minutos.
- Recomendar combos por gusto del cliente (películas, anime, deportes, música, productividad).

ESTILO: cálido, mexicano, breve, con emojis 🐨💚. Máximo 4 oraciones por respuesta salvo que pidan detalle.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 30) {
      return new Response(JSON.stringify({ error: "Mensajes inválidos" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "Servicio no configurado" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Sanitizar: cap longitud por mensaje
    const safeMessages = messages.slice(-20).map((m: any) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content ?? "").slice(0, 2000),
    }));

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...safeMessages],
        stream: true,
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        return new Response(
          JSON.stringify({ error: "Demasiadas preguntas, intenta en un minuto." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (resp.status === 402) {
        return new Response(
          JSON.stringify({ error: "Servicio temporalmente no disponible." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await resp.text();
      console.error("AI gateway error:", resp.status, t);
      return new Response(JSON.stringify({ error: "Error del asistente" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(resp.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("customer-chat error:", e);
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
