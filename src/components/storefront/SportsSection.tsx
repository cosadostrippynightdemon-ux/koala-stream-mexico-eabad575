import { Trophy } from "lucide-react";

const sports = [
  "Champions League", "LaLiga", "Premier League",
  "Liga MX", "F1", "MotoGP",
  "NFL", "NBA", "UFC",
  "Boxeo", "MLB", "Tenis ATP",
];

export function SportsSection() {
  return (
    <section id="deportes" className="bg-gradient-accent py-20">
      <div className="container">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
            <Trophy className="h-7 w-7" />
          </div>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Deportes en vivo 🏆</h2>
          <p className="mt-3 text-foreground/70">
            Disfruta los mejores eventos deportivos del mundo desde tu casa, con calidad HD/4K.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
          {sports.map((s) => (
            <div
              key={s}
              className="rounded-2xl bg-card/80 p-4 text-center font-medium text-foreground shadow-soft backdrop-blur transition-smooth hover:-translate-y-1 hover:shadow-card"
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
