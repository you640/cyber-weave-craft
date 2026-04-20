// Recovery codes for MFA. Generated client-side, hashed before storage.

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion

const randomChar = () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

/** Format: XXXX-XXXX (8 chars, ~40 bits entropy per code) */
export const generateRecoveryCode = (): string => {
  const chars = Array.from({ length: 8 }, randomChar).join("");
  return `${chars.slice(0, 4)}-${chars.slice(4)}`;
};

export const generateRecoveryCodes = (count = 8): string[] =>
  Array.from({ length: count }, generateRecoveryCode);

/** SHA-256 hex digest. Codes are normalized (uppercase, no dashes) before hashing. */
export const hashRecoveryCode = async (code: string): Promise<string> => {
  const normalized = code.replace(/-/g, "").toUpperCase().trim();
  const buf = new TextEncoder().encode(normalized);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};
