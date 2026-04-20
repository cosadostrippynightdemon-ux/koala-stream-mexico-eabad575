
## Plan: Checkout sin fricción + productos arriba + velocidad

### 1. CartDrawer — todo opcional, 1 clic a WhatsApp
`src/components/storefront/CartDrawer.tsx`:
- Hacer `name` y `whatsapp` **opcionales** en el schema Zod (igual que email).
- Etiquetas cambian a `Nombre (opcional)` y `WhatsApp (opcional)`.
- Si están vacíos: usar `"Cliente"` como nombre por defecto en el mensaje.
- El botón "Pagar por WhatsApp" funciona aunque no llenen nada — solo necesita productos en el carrito.
- Sigue mostrando total de productos + total MXN.

### 2. WhatsApp message — limpio y directo
`src/lib/whatsapp.ts`:
- Si no hay nombre, saludo genérico: `"Hola Koalas Software 🐨, quiero comprar:"`.
- Mantener lista de productos, total productos, total MXN, datos bancarios.

### 3. Productos arriba del todo (premium look)
`src/pages/Index.tsx`:
- Reordenar: `<Navbar />` → `<Shop />` → `<Hero />` → resto.
- La tienda aparece inmediatamente al entrar, sin scroll.

`src/components/storefront/Shop.tsx`:
- Quitar `bg-muted/30` y reducir `py-20` → `pt-6 pb-12` para que pegue arriba sin hueco grande.
- Mantener buscador + categorías (ya se ve premium).

### 4. Velocidad extra (sin tocar diseño)
- `src/components/storefront/ProductCard.tsx`: añadir `loading="lazy"` + `decoding="async"` + `width`/`height` en `<img>` para evitar layout shift.
- `index.html`: añadir `<link rel="preload" as="image" href="/src/assets/koalas-logo.webp">` para LCP instantáneo del logo.
- Verificar que `useProducts` ya use React Query (ya está, solo confirmar).

### Lo que NO se toca
- Sonido hippie, panel admin, RLS, encriptación de credenciales, precios, chat IA, URL secreta admin, colores ni animaciones.

### Resultado
- Cliente entra → ve productos al instante → 2 clics para comprar (agregar + WhatsApp) → mensaje listo en su WhatsApp con total y datos bancarios. Sin formularios obligatorios.

### Archivos a modificar
1. `src/components/storefront/CartDrawer.tsx`
2. `src/lib/whatsapp.ts`
3. `src/pages/Index.tsx`
4. `src/components/storefront/Shop.tsx`
5. `src/components/storefront/ProductCard.tsx`
6. `index.html`
