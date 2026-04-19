import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  KeyRound,
  Settings,
  LogOut,
  Loader2,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_BASE = "/koalas-añoñoso-control-7g3x9k2m";

const navItems = [
  { to: ADMIN_BASE, label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: `${ADMIN_BASE}/productos`, label: "Productos", icon: Package },
  { to: `${ADMIN_BASE}/pedidos`, label: "Pedidos", icon: ShoppingCart },
  { to: `${ADMIN_BASE}/clientes`, label: "Clientes", icon: Users },
  { to: `${ADMIN_BASE}/credenciales`, label: "Credenciales", icon: KeyRound },
  { to: `${ADMIN_BASE}/configuracion`, label: "Configuración", icon: Settings },
];

export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/auth");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-hero p-6 text-center">
        <ShieldAlert className="h-12 w-12 text-destructive" />
        <h1 className="font-display text-2xl font-bold">Acceso restringido</h1>
        <p className="max-w-md text-muted-foreground">
          Tu cuenta no tiene permisos de administrador. Pide al dueño de Koalas Software que te asigne el rol "admin".
        </p>
        <p className="text-xs text-muted-foreground">Tu user id: <code className="rounded bg-muted px-2 py-1">{user.id}</code></p>
        <div className="flex gap-2">
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </Button>
          <Button asChild className="bg-gradient-primary text-primary-foreground">
            <Link to="/">Ir a la tienda</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar p-4 md:flex">
        <div className="mb-6">
          <Logo size="md" />
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-smooth",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-2 border-t border-sidebar-border pt-4">
          <Button asChild variant="outline" size="sm" className="w-full justify-start">
            <Link to="/" target="_blank">
              <ExternalLink className="h-4 w-4" /> Ver tienda
            </Link>
          </Button>
          <Button onClick={handleLogout} variant="ghost" size="sm" className="w-full justify-start">
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </Button>
          <p className="px-2 text-[10px] text-muted-foreground">{user.email}</p>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="fixed top-0 z-30 flex w-full items-center justify-between border-b border-border bg-card p-3 md:hidden">
        <Logo size="sm" />
        <div className="flex gap-2 overflow-x-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium",
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/70"
                )
              }
            >
              <Icon className="h-3 w-3" />
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      <main className="flex-1 p-6 pt-20 md:p-8 md:pt-8">
        <Outlet />
      </main>
    </div>
  );
}
