-- Recovery codes for MFA. Stored as SHA-256 hashes, never plaintext.
CREATE TABLE public.mfa_recovery_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  code_hash TEXT NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mfa_recovery_codes_user ON public.mfa_recovery_codes(user_id) WHERE used_at IS NULL;
CREATE UNIQUE INDEX idx_mfa_recovery_codes_hash ON public.mfa_recovery_codes(user_id, code_hash);

ALTER TABLE public.mfa_recovery_codes ENABLE ROW LEVEL SECURITY;

-- Users can view their own codes (to see how many remain — never the plaintext)
CREATE POLICY "Users can view own recovery codes"
ON public.mfa_recovery_codes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own codes (during enroll)
CREATE POLICY "Users can insert own recovery codes"
ON public.mfa_recovery_codes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own codes (regenerate)
CREATE POLICY "Users can delete own recovery codes"
ON public.mfa_recovery_codes
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- No UPDATE policy — codes are immutable. Marking used_at is done via SECURITY DEFINER function.

-- Function to mark a recovery code as used (called from edge function via service role)
CREATE OR REPLACE FUNCTION public.consume_recovery_code(_user_id UUID, _code_hash TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _id UUID;
BEGIN
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
$$;