import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { formatMXN, calculatePriceMXN, type Modality } from "@/lib/pricing";
import { useSettings } from "@/hooks/use-settings";

interface ProductRow {
  id: string;
  name: string;
  category: string;
  description: string | null;
  base_price_usd: number;
  modalities: Modality[];
  durations: number[];
  active: boolean;
  featured: boolean;
  sort_order: number;
}

const ALL_MODALITIES: Modality[] = ["individual", "compartida", "perfil"];
const ALL_DURATIONS = [1, 3, 6, 12];

const empty = {
  name: "",
  category: "Streaming",
  description: "",
  base_price_usd: 0,
  modalities: [...ALL_MODALITIES],
  durations: [...ALL_DURATIONS],
  active: true,
  featured: false,
  sort_order: 0,
};

export default function Products() {
  const { settings } = useSettings();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(empty);
  const [editId, setEditId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("sort_order");
    setProducts((data ?? []) as any);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(empty);
    setEditId(null);
    setOpen(true);
  }

  function openEdit(p: ProductRow) {
    setEditing({ ...p, description: p.description ?? "" });
    setEditId(p.id);
    setOpen(true);
  }

  async function save() {
    if (!editing.name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    const payload = {
      name: editing.name.trim(),
      category: editing.category.trim() || "Streaming",
      description: editing.description?.trim() || null,
      base_price_usd: Number(editing.base_price_usd) || 0,
      modalities: editing.modalities,
      durations: editing.durations,
      active: editing.active,
      featured: editing.featured,
      sort_order: Number(editing.sort_order) || 0,
    };
    const { error } = editId
      ? await supabase.from("products").update(payload).eq("id", editId)
      : await supabase.from("products").insert(payload);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editId ? "Producto actualizado" : "Producto creado");
    setOpen(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Producto eliminado");
    load();
  }

  async function toggleActive(p: ProductRow) {
    await supabase.from("products").update({ active: !p.active }).eq("id", p.id);
    load();
  }

  function toggleArrayItem<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Productos</h1>
          <p className="text-muted-foreground">Administra el catálogo de cuentas premium.</p>
        </div>
        <Button onClick={openNew} className="bg-gradient-primary text-primary-foreground">
          <Plus className="h-4 w-4" /> Nuevo producto
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const sample = calculatePriceMXN(p.base_price_usd, p.modalities[0] ?? "individual", p.durations[0] ?? 1, settings);
            return (
              <Card key={p.id} className={`shadow-soft ${!p.active ? "opacity-60" : ""}`}>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1">
                        {p.featured && <Star className="h-3 w-3 fill-gold text-gold" />}
                        <h3 className="font-display font-semibold">{p.name}</h3>
                      </div>
                      <Badge variant="secondary" className="mt-1 text-[10px]">{p.category}</Badge>
                    </div>
                    <Switch checked={p.active} onCheckedChange={() => toggleActive(p)} />
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">{p.description || "Sin descripción"}</div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Base: ${p.base_price_usd} USD</span>
                    <span className="font-display font-bold text-primary">desde {formatMXN(sample)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(p)}>
                      <Pencil className="h-3 w-3" /> Editar
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => remove(p.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">{editId ? "Editar producto" : "Nuevo producto"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Nombre</Label>
                <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div>
                <Label>Categoría</Label>
                <Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
              </div>
              <div>
                <Label>Precio base (USD)</Label>
                <Input type="number" step="0.01" value={editing.base_price_usd} onChange={(e) => setEditing({ ...editing, base_price_usd: e.target.value })} />
              </div>
              <div className="col-span-2">
                <Label>Descripción</Label>
                <Textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div className="col-span-2">
                <Label>Modalidades disponibles</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ALL_MODALITIES.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setEditing({ ...editing, modalities: toggleArrayItem(editing.modalities, m) })}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        editing.modalities.includes(m) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <Label>Duraciones (meses)</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ALL_DURATIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setEditing({ ...editing, durations: toggleArrayItem(editing.durations, d) })}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        editing.durations.includes(d) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {d} {d === 1 ? "mes" : "meses"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />
                <Label>Activo</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editing.featured} onCheckedChange={(v) => setEditing({ ...editing, featured: v })} />
                <Label>Destacado</Label>
              </div>
              <div>
                <Label>Orden</Label>
                <Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save} className="bg-gradient-primary text-primary-foreground">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
