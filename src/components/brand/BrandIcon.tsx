/**
 * Iconos SVG inline por marca/categoría — peso mínimo, animados con CSS.
 * Diseñados para evitar logos con copyright: usamos formas, iniciales y símbolos
 * representativos en gradientes de marca de la plataforma.
 */
import { Tv, Music, Sparkles, Trophy, Film, Code2, Package } from "lucide-react";

interface BrandIconProps {
  slug: string | null | undefined;
  category: string;
  className?: string;
}

interface BrandSpec {
  bg: string; // tailwind/inline gradient
  fg: string;
  label: string;
  shape?: "play" | "rings" | "spark" | "wave" | "ball" | "ai" | "flag" | "bolt" | "scissors" | "palette";
}

const brands: Record<string, BrandSpec> = {
  netflix: { bg: "linear-gradient(135deg,#1a0000,#7a0000)", fg: "#E50914", label: "N", shape: "bolt" },
  disney: { bg: "linear-gradient(135deg,#0a1d4a,#1f4ed8)", fg: "#ffffff", label: "D+", shape: "spark" },
  max: { bg: "linear-gradient(135deg,#0a0033,#5b21b6)", fg: "#ffffff", label: "Max", shape: "wave" },
  prime: { bg: "linear-gradient(135deg,#001b30,#00A8E1)", fg: "#00A8E1", label: "Prime", shape: "play" },
  paramount: { bg: "linear-gradient(135deg,#01194a,#0064ff)", fg: "#ffffff", label: "P+", shape: "spark" },
  appletv: { bg: "linear-gradient(135deg,#000,#333)", fg: "#fff", label: "tv+", shape: "play" },
  vix: { bg: "linear-gradient(135deg,#3d0066,#ff007a)", fg: "#fff", label: "VIX", shape: "wave" },
  crunchyroll: { bg: "linear-gradient(135deg,#1a0a00,#F47521)", fg: "#fff", label: "CR", shape: "rings" },
  spotify: { bg: "linear-gradient(135deg,#003d1a,#1DB954)", fg: "#fff", label: "♪", shape: "wave" },
  youtube: { bg: "linear-gradient(135deg,#1a0000,#FF0000)", fg: "#fff", label: "▶", shape: "play" },
  deezer: { bg: "linear-gradient(135deg,#1a0033,#A238FF)", fg: "#fff", label: "≋", shape: "wave" },
  chatgpt: { bg: "linear-gradient(135deg,#0a2a26,#10A37F)", fg: "#fff", label: "AI", shape: "ai" },
  canva: { bg: "linear-gradient(135deg,#001a4d,#00C4CC)", fg: "#fff", label: "C", shape: "palette" },
  capcut: { bg: "linear-gradient(135deg,#0a0033,#FF3B5C)", fg: "#fff", label: "CC", shape: "scissors" },
  directv: { bg: "linear-gradient(135deg,#000a1a,#00A1E0)", fg: "#fff", label: "GO", shape: "ball" },
  sports: { bg: "linear-gradient(135deg,#0a0033,#facc15)", fg: "#fff", label: "⚽", shape: "ball" },
};

const categoryFallback: Record<string, BrandSpec> = {
  Streaming: { bg: "linear-gradient(135deg,#0a1a2e,#3b82f6)", fg: "#fff", label: "TV", shape: "play" },
  Música: { bg: "linear-gradient(135deg,#1a002e,#a855f7)", fg: "#fff", label: "♪", shape: "wave" },
  IA: { bg: "linear-gradient(135deg,#022c22,#10b981)", fg: "#fff", label: "AI", shape: "ai" },
  Deportes: { bg: "linear-gradient(135deg,#1a0a00,#f59e0b)", fg: "#fff", label: "⚽", shape: "ball" },
  Anime: { bg: "linear-gradient(135deg,#2e0a1a,#ec4899)", fg: "#fff", label: "★", shape: "rings" },
  Software: { bg: "linear-gradient(135deg,#0a1a2e,#06b6d4)", fg: "#fff", label: "</>", shape: "palette" },
  Combos: { bg: "linear-gradient(135deg,#2e1a00,#facc15)", fg: "#fff", label: "★", shape: "spark" },
};

function ShapeOverlay({ shape }: { shape?: BrandSpec["shape"] }) {
  switch (shape) {
    case "play":
      return (
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-20">
          <polygon points="38,30 38,70 72,50" fill="white" className="origin-center animate-[pulse_3s_ease-in-out_infinite]" />
        </svg>
      );
    case "rings":
      return (
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <circle cx="50" cy="50" r="22" fill="none" stroke="white" strokeWidth="1.5" opacity="0.35" className="animate-[ping_3s_ease-out_infinite]" />
          <circle cx="50" cy="50" r="34" fill="none" stroke="white" strokeWidth="1" opacity="0.2" className="animate-[ping_3s_ease-out_infinite_0.6s]" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          {[15, 30, 70, 85].map((x, i) => (
            <circle key={i} cx={x} cy={20 + (i % 2) * 60} r="1.5" fill="white" opacity="0.7" className={`animate-[twinkle_${2 + i * 0.4}s_ease-in-out_infinite]`} />
          ))}
        </svg>
      );
    case "wave":
      return (
        <svg viewBox="0 0 100 30" className="absolute bottom-3 left-0 h-8 w-full opacity-60">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect
              key={i}
              x={10 + i * 11}
              y={10}
              width="3"
              height="10"
              rx="1.5"
              fill="white"
              className="origin-bottom animate-[bars_1.2s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </svg>
      );
    case "ball":
      return (
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <circle cx="50" cy="50" r="14" fill="white" opacity="0.85" className="animate-[bounce-soft_2s_ease-in-out_infinite]" />
        </svg>
      );
    case "ai":
      return (
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-40">
          <path d="M30 50 Q50 20 70 50 Q50 80 30 50 Z" fill="none" stroke="white" strokeWidth="1.5" className="animate-[spin_8s_linear_infinite] origin-center" />
        </svg>
      );
    case "scissors":
      return (
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-30">
          <line x1="20" y1="20" x2="80" y2="80" stroke="white" strokeWidth="2" />
          <line x1="80" y1="20" x2="20" y2="80" stroke="white" strokeWidth="2" />
        </svg>
      );
    case "palette":
      return (
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-50">
          {[20, 40, 60, 80].map((cx, i) => (
            <circle key={i} cx={cx} cy={50} r="5" fill="white" opacity={0.3 + i * 0.15} />
          ))}
        </svg>
      );
    case "bolt":
      return (
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-25">
          <polygon points="50,15 35,55 50,55 40,85 70,45 55,45 65,15" fill="white" />
        </svg>
      );
    default:
      return null;
  }
}

export function BrandIcon({ slug, category, className = "" }: BrandIconProps) {
  const spec = (slug && brands[slug.toLowerCase()]) || categoryFallback[category] || {
    bg: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)))",
    fg: "white",
    label: "★",
  };

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{ background: spec.bg }}
    >
      {/* glow blob */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -left-8 -bottom-8 h-28 w-28 rounded-full bg-white/5 blur-2xl" />

      <ShapeOverlay shape={spec.shape} />

      {/* Brand label */}
      <div
        className="relative z-10 select-none font-display text-3xl font-black drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
        style={{ color: spec.fg, textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
      >
        {spec.label}
      </div>

      {/* shine sweep on hover */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />
    </div>
  );
}

export const FallbackCategoryIcon = { Tv, Music, Sparkles, Trophy, Film, Code2, Package };
