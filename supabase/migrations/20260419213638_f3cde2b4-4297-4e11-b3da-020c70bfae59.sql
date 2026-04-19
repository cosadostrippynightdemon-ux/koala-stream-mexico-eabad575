
-- 1) Generate a fresh random key and store it in Vault
DO $$
DECLARE
  _new_key text;
  _old_key text;
  _existing_id uuid;
BEGIN
  -- Old hardcoded key (must match the one previously in _cred_key())
  _old_key := 'k0al4s_s0ftw4r3_cr3d_v1_2026_aZ9pQ7xL3mN8';

  -- Generate a strong random base64 key
  _new_key := encode(extensions.gen_random_bytes(48), 'base64');

  -- Upsert into Vault under a known name
  SELECT id INTO _existing_id FROM vault.secrets WHERE name = 'cred_encryption_key' LIMIT 1;
  IF _existing_id IS NULL THEN
    PERFORM vault.create_secret(_new_key, 'cred_encryption_key', 'Symmetric key for delivered_credentials.account_password_enc');
  ELSE
    PERFORM vault.update_secret(_existing_id, _new_key);
  END IF;

  -- Re-encrypt every existing row from the OLD key to the NEW key
  UPDATE public.delivered_credentials
  SET account_password_enc = pgp_sym_encrypt(
    pgp_sym_decrypt(account_password_enc, _old_key),
    _new_key
  )
  WHERE account_password_enc IS NOT NULL;
END
$$;

-- 2) Rewrite _cred_key() to read from Vault instead of holding the literal
CREATE OR REPLACE FUNCTION public._cred_key()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, vault
AS $$
  SELECT decrypted_secret
  FROM vault.decrypted_secrets
  WHERE name = 'cred_encryption_key'
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public._cred_key() FROM PUBLIC, anon, authenticated;
