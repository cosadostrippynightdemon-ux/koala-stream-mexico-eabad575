
-- ============================================================
-- 1) SETTINGS: hide sensitive fields from public
-- ============================================================

-- Drop the public SELECT policy
DROP POLICY IF EXISTS "Anyone can view settings" ON public.settings;

-- Admins can still view full settings
CREATE POLICY "Admins can view full settings"
ON public.settings FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Public-safe view (no bank_details, no business_owner)
CREATE OR REPLACE VIEW public.public_settings
WITH (security_invoker = on) AS
SELECT
  id,
  business_name,
  whatsapp_number,
  whatsapp_message_template,
  exchange_rate,
  multiplier_individual,
  multiplier_compartida,
  multiplier_perfil,
  created_at,
  updated_at
FROM public.settings;

GRANT SELECT ON public.public_settings TO anon, authenticated;

-- We need a permissive policy on settings allowing the view to read
-- (security_invoker means caller's permissions apply). Add a policy that
-- exposes ONLY non-sensitive scalar columns isn't possible at row level,
-- so we instead allow SELECT of safe columns by granting via the view
-- using a SECURITY DEFINER function for the view's underlying read.
-- Simpler: add a permissive policy but restrict the view's columns.
-- Since security_invoker=on, the caller still needs SELECT on the table.
-- Use a SECURITY DEFINER function instead for safer separation:

DROP VIEW IF EXISTS public.public_settings;

CREATE OR REPLACE FUNCTION public.get_public_settings()
RETURNS TABLE (
  business_name text,
  whatsapp_number text,
  whatsapp_message_template text,
  exchange_rate numeric,
  multiplier_individual numeric,
  multiplier_compartida numeric,
  multiplier_perfil numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    business_name,
    whatsapp_number,
    whatsapp_message_template,
    exchange_rate,
    multiplier_individual,
    multiplier_compartida,
    multiplier_perfil
  FROM public.settings
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_settings() TO anon, authenticated;

-- ============================================================
-- 2) USER_ROLES: explicit deny for non-admin INSERT/UPDATE/DELETE
-- ============================================================

-- Restrictive policy: only admins can INSERT into user_roles
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update roles"
ON public.user_roles
AS RESTRICTIVE
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
AS RESTRICTIVE
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- 3) ENCRYPT delivered_credentials.account_password at rest
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

-- Add an encrypted column
ALTER TABLE public.delivered_credentials
  ADD COLUMN IF NOT EXISTS account_password_enc bytea;

-- Internal function holding the encryption key (rotate by altering this).
-- Stored as a function body so the literal isn't queryable as data.
CREATE OR REPLACE FUNCTION public._cred_key()
RETURNS text
LANGUAGE sql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'k0al4s_s0ftw4r3_cr3d_v1_2026_aZ9pQ7xL3mN8'::text;
$$;
REVOKE ALL ON FUNCTION public._cred_key() FROM PUBLIC, anon, authenticated;

-- Migrate existing plaintext into encrypted column
UPDATE public.delivered_credentials
SET account_password_enc = pgp_sym_encrypt(account_password, public._cred_key())
WHERE account_password_enc IS NULL AND account_password IS NOT NULL;

-- Drop plaintext column
ALTER TABLE public.delivered_credentials DROP COLUMN account_password;

-- Trigger to keep encryption transparent on insert/update via a virtual setter
-- We expose admin-only RPCs to write/read.
CREATE OR REPLACE FUNCTION public.admin_save_credential(
  _id uuid,
  _order_id uuid,
  _customer_id uuid,
  _product_name text,
  _modality text,
  _account_email text,
  _account_password text,
  _expires_at timestamptz,
  _notes text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _new_id uuid;
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  IF _id IS NULL THEN
    INSERT INTO public.delivered_credentials (
      order_id, customer_id, product_name, modality,
      account_email, account_password_enc, expires_at, notes
    )
    VALUES (
      _order_id, _customer_id, _product_name, _modality,
      _account_email, pgp_sym_encrypt(_account_password, public._cred_key()),
      _expires_at, _notes
    )
    RETURNING id INTO _new_id;
    RETURN _new_id;
  ELSE
    UPDATE public.delivered_credentials
    SET order_id = _order_id,
        customer_id = _customer_id,
        product_name = _product_name,
        modality = _modality,
        account_email = _account_email,
        account_password_enc = pgp_sym_encrypt(_account_password, public._cred_key()),
        expires_at = _expires_at,
        notes = _notes,
        updated_at = now()
    WHERE id = _id;
    RETURN _id;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_save_credential(uuid,uuid,uuid,text,text,text,text,timestamptz,text) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_get_credentials()
RETURNS TABLE (
  id uuid,
  order_id uuid,
  customer_id uuid,
  product_name text,
  modality text,
  account_email text,
  account_password text,
  expires_at timestamptz,
  delivered_at timestamptz,
  notes text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;
  RETURN QUERY
  SELECT
    dc.id, dc.order_id, dc.customer_id, dc.product_name, dc.modality,
    dc.account_email,
    CASE
      WHEN dc.account_password_enc IS NOT NULL
      THEN pgp_sym_decrypt(dc.account_password_enc, public._cred_key())
      ELSE NULL
    END AS account_password,
    dc.expires_at, dc.delivered_at, dc.notes, dc.created_at, dc.updated_at
  FROM public.delivered_credentials dc
  ORDER BY dc.delivered_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_get_credentials() TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_delete_credential(_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;
  DELETE FROM public.delivered_credentials WHERE id = _id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.admin_delete_credential(uuid) TO authenticated;

-- ============================================================
-- 4) RECOMPUTE order total server-side + return bank_details
-- ============================================================

DROP FUNCTION IF EXISTS public.create_public_order(text, text, text, jsonb, numeric, text);

CREATE OR REPLACE FUNCTION public.create_public_order(
  _customer_name text,
  _customer_whatsapp text,
  _customer_email text,
  _items jsonb,
  _notes text
)
RETURNS TABLE (order_id uuid, total_mxn numeric, bank_details text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _customer_id uuid;
  _order_id uuid;
  _item jsonb;
  _product RECORD;
  _settings RECORD;
  _modality text;
  _duration int;
  _quantity int;
  _unit_price numeric;
  _line_total numeric;
  _server_total numeric := 0;
  _multiplier numeric;
  _bank text;
BEGIN
  -- Basic validation
  IF _customer_name IS NULL OR length(trim(_customer_name)) = 0 OR length(_customer_name) > 200 THEN
    RAISE EXCEPTION 'Nombre inválido';
  END IF;
  IF _customer_whatsapp IS NULL OR length(trim(_customer_whatsapp)) < 8 OR length(_customer_whatsapp) > 30 THEN
    RAISE EXCEPTION 'WhatsApp inválido';
  END IF;
  IF _items IS NULL OR jsonb_array_length(_items) = 0 OR jsonb_array_length(_items) > 50 THEN
    RAISE EXCEPTION 'Items inválidos';
  END IF;

  SELECT * INTO _settings FROM public.settings LIMIT 1;
  IF _settings IS NULL THEN
    RAISE EXCEPTION 'Configuración faltante';
  END IF;

  -- Recompute total from real product catalog
  FOR _item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    _modality := _item->>'modality';
    _duration := COALESCE((_item->>'duration')::int, 1);
    _quantity := COALESCE((_item->>'quantity')::int, 1);

    IF _quantity < 1 OR _quantity > 50 THEN
      RAISE EXCEPTION 'Cantidad inválida';
    END IF;
    IF _duration NOT IN (1,3,6,12) THEN
      RAISE EXCEPTION 'Duración inválida';
    END IF;
    IF _modality NOT IN ('individual','compartida','perfil') THEN
      RAISE EXCEPTION 'Modalidad inválida';
    END IF;

    SELECT * INTO _product FROM public.products
      WHERE id = (_item->>'product_id')::uuid AND active = true;
    IF _product IS NULL THEN
      RAISE EXCEPTION 'Producto no disponible';
    END IF;

    -- Pricing rules mirror src/lib/pricing.ts:
    -- individual: fixed 80 MXN/month for all products
    -- compartida: base_price_usd * multiplier_compartida * exchange_rate (per month)
    -- perfil:     base_price_usd * multiplier_perfil     * exchange_rate (per month)
    IF _modality = 'individual' THEN
      _unit_price := round(80 * _duration);
    ELSE
      _multiplier := CASE _modality
        WHEN 'compartida' THEN _settings.multiplier_compartida
        WHEN 'perfil' THEN _settings.multiplier_perfil
      END;
      _unit_price := round(_product.base_price_usd * _multiplier * _settings.exchange_rate * _duration);
    END IF;

    _line_total := _unit_price * _quantity;
    _server_total := _server_total + _line_total;
  END LOOP;

  IF _server_total <= 0 OR _server_total > 1000000 THEN
    RAISE EXCEPTION 'Total inválido';
  END IF;

  -- Find/create customer
  SELECT id INTO _customer_id
  FROM public.customers WHERE whatsapp = trim(_customer_whatsapp) LIMIT 1;

  IF _customer_id IS NULL THEN
    INSERT INTO public.customers (name, whatsapp, email)
    VALUES (trim(_customer_name), trim(_customer_whatsapp), NULLIF(trim(_customer_email), ''))
    RETURNING id INTO _customer_id;
  END IF;

  INSERT INTO public.orders (
    customer_id, customer_name, customer_whatsapp, items, total_mxn, status, notes
  )
  VALUES (
    _customer_id, trim(_customer_name), trim(_customer_whatsapp),
    _items, _server_total, 'pendiente', NULLIF(trim(_notes), '')
  )
  RETURNING id INTO _order_id;

  _bank := _settings.bank_details;

  RETURN QUERY SELECT _order_id, _server_total, _bank;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_public_order(text, text, text, jsonb, text) TO anon, authenticated;

-- ============================================================
-- 5) Chat rate limit table
-- ============================================================

CREATE TABLE IF NOT EXISTS public.chat_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_rate_limits_ip_time
  ON public.chat_rate_limits (ip_hash, created_at DESC);

ALTER TABLE public.chat_rate_limits ENABLE ROW LEVEL SECURITY;

-- No public access; only service role (used by the edge function) can read/write.
-- Admins can view for monitoring.
CREATE POLICY "Admins can view rate limits"
ON public.chat_rate_limits FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
