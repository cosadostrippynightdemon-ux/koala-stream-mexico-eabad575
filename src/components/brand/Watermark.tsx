import logo from "@/assets/koalas-logo.png";

interface WatermarkProps {
  size?: number;
  className?: string;
  opacity?: number;
}

/**
 * Marca de agua circular giratoria del logo Koalas Software.
 * Se superpone con un anillo de texto "KOALAS SOFTWARE • OFFICIAL •" en SVG.
 */
export function Watermark({ size = 64, className = "", opacity = 0.85 }: WatermarkProps) {
  return (
    <div
      className={`pointer-events-none relative ${className}`}
      style={{ width: size, height: size, opacity }}
      aria-hidden="true"
    >
      {/* Anillo de texto giratorio */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full animate-[spin_12s_linear_infinite]"
      >
        <defs>
          <path
            id={`wm-circle-${size}`}
            d="M 50,50 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
            fill="none"
          />
        </defs>
        <text fontSize="9" fontWeight="700" fill="hsl(var(--primary))" letterSpacing="2">
          <textPath href={`#wm-circle-${size}`}>
            KOALAS SOFTWARE • OFFICIAL • KOALAS SOFTWARE • OFFICIAL •
          </textPath>
        </text>
      </svg>

      {/* Logo central también girando suave */}
      <img
        src={logo}
        alt=""
        className="absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full object-cover shadow-soft animate-[spin_18s_linear_infinite_reverse]"
      />
    </div>
  );
}
