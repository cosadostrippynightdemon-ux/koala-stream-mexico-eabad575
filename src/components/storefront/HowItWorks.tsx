import { ShoppingBag, CreditCard, KeyRound, RefreshCw } from "lucide-react";

const steps = [
  {
    icon: ShoppingBag,
    title: "1. Eliges tu cuenta",
    desc: "Selecciona el servicio, modalidad (individual, compartida o perfil) y duración (1, 3, 6 o 12 meses).",
  },
  {
    icon: CreditCard,
    title: "2. Pagas en pesos",
    desc: "Confirma tu pedido por WhatsApp y paga por transferencia bancaria en pesos mexicanos.",
  },
  {
    icon: KeyRound,
    title: "3. Recibes credenciales",
    desc: "Te enviamos correo y contraseña por WhatsApp para que disfrutes tu cuenta premium durante el tiempo contratado.",
  },
  {
    icon: RefreshCw,
    title: "4. Renuevas cuando quieras",
    desc: "Al terminar tu plan, compras un nuevo periodo y recibes un correo y contraseña nuevos. ¡Así de fácil!",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="container py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Proceso simple</p>
        <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">¿Cómo funciona?</h2>
        <p className="mt-3 text-muted-foreground">
          Sin complicaciones. Compra, paga y disfruta tu streaming premium en minutos.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {steps.map(({ icon: Icon, title, desc }, i) => (
          <div
            key={title}
            className="group relative flex flex-col gap-4 rounded-3xl bg-gradient-card p-6 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-card"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
            <span className="absolute right-4 top-4 font-display text-5xl font-bold text-primary/10">
              {i + 1}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
