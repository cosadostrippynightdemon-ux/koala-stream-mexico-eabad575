
# Koalas Software — Tienda de Streaming Premium 🐨

Voy a construir una landing + tienda de streaming digital inspirada en ConnectTV pero **adaptada 100% al mercado mexicano**, con la identidad visual de tu marca Koalas Software (paleta del logo: verde menta, durazno suave, crema, toques dorados) y un panel admin súper completo.

## 🎨 Identidad Visual Koalas Software
- **Colores principales**: verde menta/agua (#A8D8C9), durazno (#F5C9A8), crema cálida (#FBF6EC), gris-azul suave (#7A9BA8), acentos dorados sutiles.
- **Tipografía**: títulos con tipografía manuscrita/redondeada cálida (estilo del logo), cuerpo con sans-serif moderno.
- **Estilo**: acuarela suave, pétalos/hojas decorativas como elementos sutiles, mucho aire, sensación premium-tierna.
- **Logo Koalas Software** visible en navbar, hero y footer.
- **Tagline**: "Cuidando el milagro de la vida con tecnología".

## 🏪 Estructura del sitio público (una sola página + panel admin)

### 1. Navbar
- Logo + nombre Koalas Software
- Enlaces: Inicio · Tienda · Streaming · Combos · Categorías · Contacto
- Botón WhatsApp +52 968 245 4083
- Ícono carrito con contador

### 2. Hero
- Mensaje principal: "Cuentas Premium de Streaming para México 🇲🇽"
- Subtexto: entrega digital inmediata, soporte por WhatsApp, pago por transferencia en pesos.
- CTAs: "Ver Tienda" y "WhatsApp"

### 3. Tira de beneficios
Entrega inmediata · Pago en MXN · Soporte WhatsApp · Renovación fácil · 100% México y Latam

### 4. **Cómo funciona** (sección clave que pediste)
4 pasos visuales:
1. Eliges tu cuenta y duración (1, 3, 6 o 12 meses).
2. Pagas por transferencia en pesos mexicanos.
3. Recibes correo + contraseña por WhatsApp para usar tu cuenta premium.
4. Al terminar tu tiempo, compras nuevo plan y recibes credenciales nuevas.

### 5. Tienda completa
Grid de tarjetas con todos los servicios del catálogo (Netflix, Disney+, Max, Prime Video, Apple TV, Paramount+, Vix, ChatGPT Plus, Spotify, Deezer, YouTube Premium, Crunchyroll, DirectTV Go, Claro Video, CapCut Pro, Canva Pro, Combos deportivos, etc. — los ~50+ que vi en ConnectTV).

**Cada tarjeta** muestra:
- Imagen, nombre, categoría
- Selector de modalidad (las 3 que pediste con tu fórmula):
  - **Pantalla individual** → precio base USD × **4** × 20 MXN (cuádruple ganancia, como pediste "el triple o 4 veces", elijo 4×)
  - **Cuenta compartida (varias pantallas)** → precio base × **2** × 20 MXN (doble)
  - **Precio base / perfil** → precio base × 20 MXN (referencia)
- Selector de duración: 1, 3, 6, 12 meses
- Precio en **$ MXN** grande
- Botón "Agregar al carrito"

### 6. Filtros y orden
Por categoría (Streaming, Música, IA, Deportes, Anime, Combos, Software), por precio, por nombre.

### 7. Sección Deportes
Vitrina especial: Champions, LaLiga, Premier, F1, MotoGP, NFL, NBA, UFC, Box.

### 8. Estrenos
Carrusel visual de pósters de películas y series destacadas.

### 9. Preguntas frecuentes
¿Es legal? ¿Funciona en México? ¿Cuánto tarda la entrega? ¿Qué pasa si la cuenta falla? ¿Puedo renovar?

### 10. Carrito lateral (Sheet)
- Lista de productos, modalidad, duración, cantidad
- Total en MXN
- Botón "Pagar por WhatsApp" → abre `wa.me/529682454083` con mensaje pre-llenado:
  ```
  Hola Koalas Software 🐨, quiero comprar:
  • Netflix Pantalla Individual - 1 mes - $XXX MXN
  • Disney+ Compartida - 3 meses - $XXX MXN
  TOTAL: $XXXX MXN
  Pago por transferencia bancaria.
  ```

### 11. Footer
Marca Koalas Software · "Creada por: Luis Javier Esquinca Rodríguez" · WhatsApp +52 968 245 4083 · Redes · Aviso de privacidad

---

## 🔐 Panel Admin "Pro y Avanzado" (`/admin`)

Login con email/contraseña (Lovable Cloud Auth + tabla `user_roles` con rol `admin`, RLS estricta).

### Dashboard principal
KPIs en tarjetas: ventas del mes (MXN), pedidos pendientes, clientes activos, cuentas próximas a vencer, ingreso total, top productos.
Gráficas: ventas por día, ingresos por categoría, top 10 productos.

### 📦 Productos
- CRUD completo: imagen, nombre, categoría, descripción, precio base USD, activo/inactivo, modalidades disponibles, duraciones disponibles.
- Editor de tipo de cambio global (default 20 MXN) y multiplicadores (×4 individual, ×2 compartida).
- Activar/desactivar productos rápido.

### 🛒 Pedidos
- Lista con filtros (pendiente, pagado, entregado, vencido).
- Cada pedido: cliente, productos, total MXN, fecha, estado, link WhatsApp directo.
- Cambiar estado, marcar como pagado, marcar como entregado.

### 👥 Clientes
- Lista de clientes con: nombre, WhatsApp, email, total comprado, número de pedidos, estado.
- Ficha de cliente con historial completo.

### 🔑 Credenciales entregadas (la parte que pediste)
- Por cada pedido entregado, registras: correo y contraseña que diste, fecha de entrega, fecha de vencimiento (calculada por duración).
- Tabla con búsqueda: cliente, producto, credencial, vence el…
- **Alertas visuales**: cuentas que vencen en 3 días (amarillo), vencidas (rojo).
- Botón "Renovar" que abre WhatsApp del cliente con mensaje recordatorio.

### 📊 Reportes
- Ventas por periodo, exportar a CSV.
- Productos más vendidos.
- Clientes top.

### ⚙️ Configuración
- Tipo de cambio MXN.
- Multiplicadores de precio.
- Datos bancarios para transferencia (mostrados al cliente al confirmar).
- Mensaje de WhatsApp configurable.
- Datos de contacto.

### 🔔 Recordatorios
- Vista de cuentas por vencer en los próximos 7 días.
- Generador de mensaje WhatsApp masivo para renovación.

---

## 🗄️ Backend (Lovable Cloud)

Tablas:
- `products` (id, nombre, categoría, imagen, precio_base_usd, activo, modalidades, duraciones)
- `orders` (id, cliente_id, total_mxn, estado, items_json, fecha)
- `customers` (id, nombre, whatsapp, email, notas)
- `delivered_credentials` (id, order_id, customer_id, product_id, email_cuenta, password_cuenta, fecha_entrega, fecha_vencimiento, estado)
- `settings` (tipo_cambio, multiplicador_individual, multiplicador_compartida, datos_bancarios, mensaje_wa)
- `user_roles` (user_id, role) con `has_role()` security definer y RLS estricta — solo admins acceden al panel.

---

## 📋 Notas importantes
- **No clonaré imágenes ni copy textual** de ConnectTV. Usaré el mismo *catálogo de servicios* (Netflix, Disney+, etc. son productos reales conocidos) con descripciones propias en español mexicano y placeholders/iconos genéricos para las portadas (tú podrás subir imágenes reales después desde el admin).
- Precios calculados con **fórmula tuya**: USD × multiplicador (4 o 2) × 20 MXN. Editable desde el admin.
- WhatsApp `+52 968 245 4083` integrado en navbar, hero, cada producto y carrito.
- Footer con tu autoría: "Koalas Software · Creada por Luis Javier Esquinca Rodríguez".
- Logo que enviaste se usará en navbar, hero y footer.

Al aprobar este plan, activo Lovable Cloud, creo las tablas, subo tu logo a `src/assets`, y construyo todo. 🐨💚
