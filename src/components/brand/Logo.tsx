import logo from "@/assets/koalas-logo.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizes = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
  xl: "h-24 w-24",
};

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img
        src={logo}
        alt="Logo de Koalas Software"
        className={cn(sizes[size], "rounded-full object-cover shadow-soft ring-2 ring-primary/20")}
      />
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="font-display text-lg font-bold text-foreground">Koalas Software</span>
          <span className="text-xs text-muted-foreground">Streaming Premium 🐨</span>
        </div>
      )}
    </div>
  );
}
