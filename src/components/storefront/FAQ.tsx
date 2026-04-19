import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "¿Cómo recibo mi cuenta?",
    a: "Una vez confirmado tu pago por transferencia, te enviamos por WhatsApp el correo y la contraseña de tu cuenta premium. La entrega es inmediata en horario activo.",
  },
  {
    q: "¿Funciona en México y Latinoamérica?",
    a: "Sí. Atendemos principalmente al mercado mexicano, pero también enviamos cuentas a toda Latinoamérica. Todos los precios están en pesos mexicanos (MXN).",
  },
  {
    q: "¿Qué pasa cuando termina mi periodo?",
    a: "Cuando se vence el tiempo que compraste, simplemente adquieres un nuevo plan y te entregamos un correo y contraseña nuevos. Así garantizamos siempre cuentas activas.",
  },
  {
    q: "¿Y si la cuenta deja de funcionar?",
    a: "No te preocupes. Si tu cuenta presenta cualquier problema durante tu periodo contratado, escríbenos por WhatsApp y te la reemplazamos sin costo extra.",
  },
  {
    q: "¿Cuáles son las formas de pago?",
    a: "Aceptamos transferencia bancaria en pesos mexicanos. Al confirmar tu pedido por WhatsApp te compartimos los datos bancarios.",
  },
  {
    q: "¿Cuál es la diferencia entre las modalidades?",
    a: "Pantalla individual: solo para ti, sin compartir. Cuenta compartida: varias pantallas/perfiles para uso simultáneo. Perfil básico: un perfil dentro de una cuenta.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="container py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Resolvemos tus dudas</p>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Preguntas frecuentes</h2>
        </div>

        <Accordion type="single" collapsible className="rounded-2xl bg-card p-2 shadow-soft">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border/60 px-4">
              <AccordionTrigger className="text-left font-display text-base font-semibold hover:text-primary">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
