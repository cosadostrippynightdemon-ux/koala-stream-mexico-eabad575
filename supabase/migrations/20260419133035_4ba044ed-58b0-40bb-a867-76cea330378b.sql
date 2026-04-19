
-- =========================
-- ROLES
-- =========================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================
-- TIMESTAMP TRIGGER
-- =========================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================
-- PRODUCTS
-- =========================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  base_price_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  modalities JSONB NOT NULL DEFAULT '["individual","compartida","perfil"]'::jsonb,
  durations JSONB NOT NULL DEFAULT '[1,3,6,12]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can view all products"
  ON public.products FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- CUSTOMERS
-- =========================
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create customers"
  ON public.customers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view customers"
  ON public.customers FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update customers"
  ON public.customers FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete customers"
  ON public.customers FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- ORDERS
-- =========================
CREATE TYPE public.order_status AS ENUM ('pendiente', 'pagado', 'entregado', 'vencido', 'cancelado');

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_whatsapp TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_mxn NUMERIC(10,2) NOT NULL DEFAULT 0,
  status order_status NOT NULL DEFAULT 'pendiente',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete orders"
  ON public.orders FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- DELIVERED CREDENTIALS
-- =========================
CREATE TABLE public.delivered_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  modality TEXT,
  account_email TEXT NOT NULL,
  account_password TEXT NOT NULL,
  delivered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.delivered_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage credentials"
  ON public.delivered_credentials FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_credentials_updated_at
  BEFORE UPDATE ON public.delivered_credentials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- SETTINGS
-- =========================
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_rate NUMERIC(10,4) NOT NULL DEFAULT 20.0,
  multiplier_individual NUMERIC(5,2) NOT NULL DEFAULT 4.0,
  multiplier_compartida NUMERIC(5,2) NOT NULL DEFAULT 2.0,
  multiplier_perfil NUMERIC(5,2) NOT NULL DEFAULT 1.0,
  whatsapp_number TEXT NOT NULL DEFAULT '529682454083',
  bank_details TEXT NOT NULL DEFAULT 'Banco: BBVA\nTitular: Luis Javier Esquinca Rodríguez\nCLABE: (configurar)\nCuenta: (configurar)',
  whatsapp_message_template TEXT NOT NULL DEFAULT 'Hola Koalas Software 🐨, quiero comprar:',
  business_name TEXT NOT NULL DEFAULT 'Koalas Software',
  business_owner TEXT NOT NULL DEFAULT 'Luis Javier Esquinca Rodríguez',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view settings"
  ON public.settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can update settings"
  ON public.settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert settings"
  ON public.settings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed single settings row
INSERT INTO public.settings (id) VALUES (gen_random_uuid());

-- =========================
-- AUTO-CREATE 'user' ROLE ON SIGNUP
-- =========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================
-- SEED PRODUCTS (catálogo de streaming)
-- =========================
INSERT INTO public.products (name, category, description, base_price_usd, sort_order, featured) VALUES
('Netflix Premium', 'Streaming', 'Acceso a Netflix Premium 4K UHD. Películas, series y documentales.', 4.50, 1, true),
('Disney+ Premium', 'Streaming', 'Disney+, Marvel, Star Wars, Pixar y National Geographic en 4K.', 3.50, 2, true),
('Max (HBO Max)', 'Streaming', 'Series originales HBO, Warner, DC y películas exclusivas.', 3.00, 3, true),
('Prime Video', 'Streaming', 'Amazon Prime Video con series y películas originales.', 2.50, 4, false),
('Apple TV+', 'Streaming', 'Series y películas originales de Apple en calidad 4K.', 2.50, 5, false),
('Paramount+', 'Streaming', 'Catálogo de Paramount, MTV, Nickelodeon y CBS.', 2.00, 6, false),
('ViX Premium', 'Streaming', 'Telenovelas, fútbol y entretenimiento en español.', 2.00, 7, false),
('Crunchyroll Premium', 'Anime', 'El catálogo de anime más grande del mundo, sin anuncios.', 2.50, 8, true),
('Spotify Premium', 'Música', 'Música sin anuncios, descargas offline y calidad alta.', 2.50, 9, true),
('YouTube Premium', 'Música', 'YouTube y YouTube Music sin anuncios + descargas.', 3.00, 10, false),
('Deezer Premium', 'Música', 'Música ilimitada en alta calidad, sin anuncios.', 2.00, 11, false),
('ChatGPT Plus', 'IA', 'Acceso a GPT-4, generación de imágenes y herramientas avanzadas.', 5.00, 12, true),
('Canva Pro', 'Software', 'Diseño profesional, plantillas premium y herramientas IA.', 2.50, 13, false),
('CapCut Pro', 'Software', 'Edición de video profesional con efectos y plantillas premium.', 2.00, 14, false),
('DirecTV Go', 'Streaming', 'TV en vivo, deportes, películas y series on demand.', 4.00, 15, false),
('Claro Video', 'Streaming', 'Películas, series y deportes en español.', 2.00, 16, false),
('Combo Deportes Premium', 'Deportes', 'Champions, LaLiga, Premier, F1, NFL, NBA en un solo combo.', 8.00, 17, true),
('Combo Streaming Total', 'Combos', 'Netflix + Disney+ + Max + Prime Video. ¡El combo más completo!', 10.00, 18, true),
('Combo Música Total', 'Combos', 'Spotify + YouTube Premium + Deezer en un solo paquete.', 5.00, 19, false),
('IPTV Premium México', 'Streaming', 'Más de 5,000 canales en vivo, deportes, películas y series.', 5.00, 20, true);
