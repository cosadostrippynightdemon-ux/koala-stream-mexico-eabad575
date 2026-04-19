
-- Remove permissive public insert policies
DROP POLICY IF EXISTS "Anyone can create customers" ON public.customers;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

-- Secure function for public order creation
CREATE OR REPLACE FUNCTION public.create_public_order(
  _customer_name TEXT,
  _customer_whatsapp TEXT,
  _customer_email TEXT,
  _items JSONB,
  _total_mxn NUMERIC,
  _notes TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _customer_id UUID;
  _order_id UUID;
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
  IF _total_mxn IS NULL OR _total_mxn <= 0 OR _total_mxn > 1000000 THEN
    RAISE EXCEPTION 'Total inválido';
  END IF;

  -- Find or create customer by whatsapp
  SELECT id INTO _customer_id
  FROM public.customers
  WHERE whatsapp = _customer_whatsapp
  LIMIT 1;

  IF _customer_id IS NULL THEN
    INSERT INTO public.customers (name, whatsapp, email)
    VALUES (trim(_customer_name), trim(_customer_whatsapp), NULLIF(trim(_customer_email), ''))
    RETURNING id INTO _customer_id;
  END IF;

  -- Create order
  INSERT INTO public.orders (
    customer_id, customer_name, customer_whatsapp, items, total_mxn, status, notes
  )
  VALUES (
    _customer_id, trim(_customer_name), trim(_customer_whatsapp),
    _items, _total_mxn, 'pendiente', NULLIF(trim(_notes), '')
  )
  RETURNING id INTO _order_id;

  RETURN _order_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_public_order(TEXT, TEXT, TEXT, JSONB, NUMERIC, TEXT) TO anon, authenticated;
