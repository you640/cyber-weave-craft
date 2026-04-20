
-- 1) Tighten profiles SELECT policy
DROP POLICY IF EXISTS "Profiles viewable by authenticated users" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2) Prevent privilege escalation on user_roles
-- Remove direct INSERT/DELETE policies; force changes through a SECURITY DEFINER function
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

-- Trusted helper: only existing admins can grant roles
CREATE OR REPLACE FUNCTION public.admin_grant_role(_target_user uuid, _role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can grant roles';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (_target_user, _role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Trusted helper: only existing admins can revoke roles, and they cannot revoke their own admin role
CREATE OR REPLACE FUNCTION public.admin_revoke_role(_target_user uuid, _role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can revoke roles';
  END IF;

  IF _role = 'admin'::app_role AND _target_user = auth.uid() THEN
    RAISE EXCEPTION 'Admins cannot revoke their own admin role';
  END IF;

  DELETE FROM public.user_roles
  WHERE user_id = _target_user AND role = _role;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_grant_role(uuid, app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_revoke_role(uuid, app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_grant_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_revoke_role(uuid, app_role) TO authenticated;
