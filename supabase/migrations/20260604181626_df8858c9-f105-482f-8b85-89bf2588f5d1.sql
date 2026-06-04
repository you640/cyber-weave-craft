
-- 1. Remove user-facing INSERT policy on mfa_recovery_codes.
DROP POLICY IF EXISTS "Users can insert own recovery codes" ON public.mfa_recovery_codes;
REVOKE INSERT ON public.mfa_recovery_codes FROM authenticated, anon;

-- 2. Add caller ownership check inside consume_recovery_code.
CREATE OR REPLACE FUNCTION public.consume_recovery_code(_user_id uuid, _code_hash text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _id UUID;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> _user_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT id INTO _id
  FROM public.mfa_recovery_codes
  WHERE user_id = _user_id
    AND code_hash = _code_hash
    AND used_at IS NULL
  LIMIT 1;

  IF _id IS NULL THEN
    RETURN FALSE;
  END IF;

  UPDATE public.mfa_recovery_codes
  SET used_at = now()
  WHERE id = _id;

  RETURN TRUE;
END;
$function$;

-- 3. Revoke EXECUTE on SECURITY DEFINER functions from anon (and PUBLIC).
--    Keep authenticated where needed; trigger-only functions get fully locked down.
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.admin_grant_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_grant_role(uuid, app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.admin_revoke_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_revoke_role(uuid, app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.consume_recovery_code(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.consume_recovery_code(uuid, text) TO authenticated, service_role;

-- Trigger-only functions: nobody should call them directly via the API.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
