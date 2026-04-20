
Voy a mejorar la velocidad de la web sin tocar diseño, sonidos ni funcionalidad.

## Análisis rápido

Revisé el código y veo varias oportunidades claras de optimización:

1. **Bundle gigante**: Todo el panel admin (`/koalas-añoñoso-control-7g3x9k2m/*`) se carga aunque el visitante solo entre al home. Son 6 páginas admin + dependencias pesadas que el cliente normal nunca usa.
2. **Logo de 3MB**: El logo PNG pesa demasiado, bloquea el render inicial.
3. **Productos sin caché**: Cada vez que se monta `<Shop />` re-pide los productos a Supabase. No usa React Query (que ya está instalado).
4. **Sin preconnect a Supabase**: El primer request a la base de datos pierde 100-300ms en handshake DNS+TLS.
5. **Imágenes de productos sin lazy loading explícito** ni dimensiones, causando layout shift.
6. **Listeners de scroll/pointer del welcome sound** se mantienen activos hasta el primer gesto (menor pero acumula).

## Plan de optimización (sin tocar diseño ni features)

### 1. Code-splitting de rutas admin
Convertir `Auth`, `AdminLayout` y todas las páginas admin a `React.lazy()` con `<Suspense>`. El bundle inicial bajará ~40-60%.

```text
Bundle inicial actual:  ~1.2 MB
Bundle inicial objetivo: ~500-600 KB
```

### 2. React Query para productos
Migrar `use-products.ts` a `useQuery` con `staleTime: 5min`. Si el usuario navega y vuelve, no re-pide. Cache compartida entre componentes.

### 3. Comprimir logo
Comprimir `koalas-logo.png` (3MB → <150KB en WebP) manteniendo la misma calidad visual. Mismo nombre de archivo, sin cambios en componentes.

### 4. Preconnect + DNS-prefetch en `index.html`
Agregar `<link rel="preconnect">` al endpoint Supabase para acelerar el primer fetch ~150ms.

### 5. Lazy loading de imágenes de productos
Añadir `loading="lazy"` y `decoding="async"` en `<ProductCard />` para que solo carguen las visibles.

### 6. Optimización menor del welcome sound
Usar `{ once: true, passive: true }` y un solo listener compuesto en lugar de 4 por separado (microoptimización pero más limpio).

### 7. Dedupe ya configurado
`vite.config.ts` ya tiene dedupe correcto, no se toca.

## Lo que NO se toca

- Diseño, colores, animaciones, layout
- Sonidos hippie ni el sistema de audio
- Funcionalidad del carrito, checkout, chat IA
- Panel admin, RLS, encriptación de credenciales
- URL secreta del admin
- Precios ni lógica de pricing

## Archivos a modificar

- `src/App.tsx` — lazy imports + Suspense con un fallback minimalista (mismo bg)
- `src/hooks/use-products.ts` — migrar a React Query
- `src/components/storefront/ProductCard.tsx` — `loading="lazy"` en `<img>`
- `index.html` — preconnect a Supabase + preload del logo optimizado
- `src/pages/Index.tsx` — limpieza menor de listeners
- `public/koalas-logo.webp` (nuevo) o sobrescribir el PNG comprimido

## Resultado esperado

- **Tiempo a primer producto visible**: -40 a -60%
- **Bundle JS inicial**: -50%
- **LCP (logo)**: -2 segundos en conexiones lentas
- **Re-renders al volver al home**: instantáneo (cache)
