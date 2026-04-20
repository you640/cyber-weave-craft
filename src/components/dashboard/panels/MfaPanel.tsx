import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { generateRecoveryCodes, hashRecoveryCode } from "@/lib/mfa-recovery";

type Phase = "loading" | "idle" | "enrolling" | "verifying" | "showing-codes" | "enrolled";

interface FactorInfo {
  id: string;
  status: "verified" | "unverified";
  friendly_name?: string;
}

export const MfaPanel = () => {
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>("loading");
  const [factor, setFactor] = useState<FactorInfo | null>(null);
  const [enrollData, setEnrollData] = useState<{ id: string; secret: string; qr: string } | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [remainingCodes, setRemainingCodes] = useState<number>(0);
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    setPhase("loading");
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) {
      toast.error("Nepodarilo sa načítať MFA stav", { description: error.message });
      setPhase("idle");
      return;
    }
    const totp = data.totp?.find((f) => f.status === "verified") ?? data.totp?.[0];
    if (totp && totp.status === "verified") {
      setFactor({ id: totp.id, status: "verified", friendly_name: totp.friendly_name });
      // count remaining recovery codes
      const { count } = await supabase
        .from("mfa_recovery_codes")
        .select("*", { count: "exact", head: true })
        .is("used_at", null);
      setRemainingCodes(count ?? 0);
      setPhase("enrolled");
    } else {
      // clean up any stray unverified factor
      if (totp && totp.status === "unverified") {
        await supabase.auth.mfa.unenroll({ factorId: totp.id });
      }
      setFactor(null);
      setPhase("idle");
    }
  };

  useEffect(() => {
    if (user) refresh();
  }, [user?.id]);

  const startEnroll = async () => {
    setBusy(true);
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: `Nexify Admin · ${new Date().toISOString().slice(0, 10)}`,
    });
    if (error || !data) {
      toast.error("Enroll zlyhal", { description: error?.message });
      setBusy(false);
      return;
    }
    const qr = await QRCode.toDataURL(data.totp.uri, { margin: 1, width: 240 });
    setEnrollData({ id: data.id, secret: data.totp.secret, qr });
    setVerifyCode("");
    setPhase("enrolling");
    setBusy(false);
  };

  const cancelEnroll = async () => {
    if (enrollData) {
      await supabase.auth.mfa.unenroll({ factorId: enrollData.id });
    }
    setEnrollData(null);
    setPhase("idle");
  };

  const verifyAndFinish = async () => {
    if (!enrollData || verifyCode.length !== 6) return;
    setBusy(true);
    setPhase("verifying");

    const { data: challenge, error: challengeErr } = await supabase.auth.mfa.challenge({
      factorId: enrollData.id,
    });
    if (challengeErr || !challenge) {
      toast.error("Challenge zlyhal", { description: challengeErr?.message });
      setBusy(false);
      setPhase("enrolling");
      return;
    }

    const { error: verifyErr } = await supabase.auth.mfa.verify({
      factorId: enrollData.id,
      challengeId: challenge.id,
      code: verifyCode,
    });
    if (verifyErr) {
      toast.error("Nesprávny kód", { description: verifyErr.message });
      setBusy(false);
      setPhase("enrolling");
      return;
    }

    // Generate + persist recovery codes
    const codes = generateRecoveryCodes(8);
    const hashes = await Promise.all(codes.map((c) => hashRecoveryCode(c)));
    const rows = hashes.map((code_hash) => ({ user_id: user!.id, code_hash }));
    const { error: insertErr } = await supabase.from("mfa_recovery_codes").insert(rows);
    if (insertErr) {
      toast.error("Recovery kódy sa nepodarilo uložiť", { description: insertErr.message });
    }

    setRecoveryCodes(codes);
    setEnrollData(null);
    setPhase("showing-codes");
    setBusy(false);
    toast.success("MFA aktivované");
  };

  const regenerateCodes = async () => {
    if (!user) return;
    if (!confirm("Vygenerovať nové recovery kódy? Staré sa zneplatnia.")) return;
    setBusy(true);
    await supabase.from("mfa_recovery_codes").delete().eq("user_id", user.id);
    const codes = generateRecoveryCodes(8);
    const hashes = await Promise.all(codes.map((c) => hashRecoveryCode(c)));
    const rows = hashes.map((code_hash) => ({ user_id: user.id, code_hash }));
    const { error } = await supabase.from("mfa_recovery_codes").insert(rows);
    if (error) {
      toast.error("Chyba pri ukladaní", { description: error.message });
      setBusy(false);
      return;
    }
    setRecoveryCodes(codes);
    setRemainingCodes(codes.length);
    setPhase("showing-codes");
    setBusy(false);
  };

  const disableMfa = async () => {
    if (!factor || !user) return;
    if (!confirm("Vypnúť MFA? Budeš sa prihlasovať len heslom.")) return;
    setBusy(true);
    const { error } = await supabase.auth.mfa.unenroll({ factorId: factor.id });
    if (error) {
      toast.error("Nepodarilo sa vypnúť", { description: error.message });
      setBusy(false);
      return;
    }
    await supabase.from("mfa_recovery_codes").delete().eq("user_id", user.id);
    toast.success("MFA vypnuté");
    setBusy(false);
    refresh();
  };

  const downloadCodes = () => {
    const text = [
      "# Nexify Guard · MFA recovery codes",
      `# Vygenerované: ${new Date().toISOString()}`,
      `# Účet: ${user?.email ?? ""}`,
      "# Každý kód použiješ LEN RAZ. Ulož na bezpečné miesto.",
      "",
      ...recoveryCodes,
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexify-mfa-recovery-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
          // SECURITY · 12 · MFA / TOTP
        </div>
        <h1 className="font-mono text-2xl md:text-3xl mt-2 text-foreground">
          Two-factor authentication
        </h1>
        <div className="border-t border-dashed border-border mt-4" />
      </div>

      {phase === "loading" && (
        <div className="wire-border p-6 font-mono text-xs text-muted-foreground">
          [ načítavam stav ... ]
        </div>
      )}

      {phase === "idle" && (
        <div className="wire-border wire-shadow bg-background p-6 space-y-4">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
            // STATUS
          </div>
          <div className="flex items-center gap-3 font-mono text-sm">
            <span className="inline-block w-2 h-2 bg-destructive rounded-full" />
            <span>MFA neaktívne — admin účet je chránený len heslom</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Aktiváciou TOTP pridáš druhý faktor (Google Authenticator, 1Password, Authy ap.). Pri prihlasovaní
            budeš zadávať 6-miestny kód z aplikácie. Dostaneš tiež 8 jednorazových recovery kódov pre prípad straty telefónu.
          </p>
          <button
            onClick={startEnroll}
            disabled={busy}
            className="font-mono text-sm px-4 py-3 bg-primary text-primary-foreground wire-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50"
          >
            [ Aktivovať MFA → ]
          </button>
        </div>
      )}

      {phase === "enrolling" && enrollData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="wire-border wire-shadow bg-background p-6 space-y-4">
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
              // STEP 1 · SCAN QR
            </div>
            <div className="bg-white p-4 wire-border inline-block">
              <img src={enrollData.qr} alt="TOTP QR code" className="block" width={240} height={240} />
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
                Manuálny kľúč (ak nefunguje QR)
              </div>
              <code className="block font-mono text-xs break-all wire-border bg-[hsl(var(--wire-bg-soft))] p-3">
                {enrollData.secret}
              </code>
            </div>
          </div>

          <div className="wire-border wire-shadow bg-background p-6 space-y-4">
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
              // STEP 2 · VERIFY
            </div>
            <p className="text-sm text-muted-foreground">
              Otvor authenticator aplikáciu a zadaj 6-miestny kód, ktorý sa práve zobrazuje.
            </p>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              autoComplete="one-time-code"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="w-full font-mono text-2xl tracking-[0.5em] text-center px-3 py-4 wire-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2">
              <button
                onClick={verifyAndFinish}
                disabled={busy || verifyCode.length !== 6}
                className="flex-1 font-mono text-sm px-4 py-3 bg-primary text-primary-foreground wire-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50"
              >
                [ Overiť a aktivovať → ]
              </button>
              <button
                onClick={cancelEnroll}
                disabled={busy}
                className="font-mono text-sm px-4 py-3 wire-border hover:bg-[hsl(var(--wire-bg-soft))] transition-colors disabled:opacity-50"
              >
                [ Zrušiť ]
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === "verifying" && (
        <div className="wire-border p-6 font-mono text-xs text-muted-foreground">
          [ overujem ... ]
        </div>
      )}

      {phase === "showing-codes" && (
        <div className="wire-border wire-shadow bg-background p-6 space-y-4 border-l-4 border-l-primary">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
            // RECOVERY CODES · ULOŽ TERAZ
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            <strong className="text-foreground">Toto je jediná príležitosť tieto kódy vidieť.</strong> Každý kód použiješ len raz pri strate
            telefónu. Ulož ich do password managera alebo vytlač.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 wire-border bg-[hsl(var(--wire-bg-soft))] p-4">
            {recoveryCodes.map((c, i) => (
              <code key={i} className="font-mono text-sm text-center py-1 bg-background wire-border">
                {c}
              </code>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={downloadCodes}
              className="font-mono text-sm px-4 py-3 bg-foreground text-background wire-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
            >
              [ Stiahnuť .txt ]
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(recoveryCodes.join("\n"));
                toast.success("Skopírované");
              }}
              className="font-mono text-sm px-4 py-3 wire-border hover:bg-[hsl(var(--wire-bg-soft))] transition-colors"
            >
              [ Kopírovať ]
            </button>
            <button
              onClick={() => {
                setRecoveryCodes([]);
                refresh();
              }}
              className="font-mono text-sm px-4 py-3 wire-border hover:bg-[hsl(var(--wire-bg-soft))] transition-colors ml-auto"
            >
              [ Mám ich uložené → ]
            </button>
          </div>
        </div>
      )}

      {phase === "enrolled" && factor && (
        <div className="space-y-6">
          <div className="wire-border wire-shadow bg-background p-6 space-y-3">
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
              // STATUS
            </div>
            <div className="flex items-center gap-3 font-mono text-sm">
              <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>MFA aktívne · {factor.friendly_name ?? "TOTP"}</span>
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              Recovery kódy zostávajúce: <strong className="text-foreground">{remainingCodes}</strong> / 8
              {remainingCodes < 3 && (
                <span className="text-destructive ml-2">⚠ málo kódov, regeneruj</span>
              )}
            </div>
          </div>

          <div className="wire-border bg-background p-6 space-y-3">
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
              // ACTIONS
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={regenerateCodes}
                disabled={busy}
                className="font-mono text-sm px-4 py-3 wire-border hover:bg-[hsl(var(--wire-bg-soft))] transition-colors disabled:opacity-50"
              >
                [ Regenerovať recovery kódy ]
              </button>
              <button
                onClick={disableMfa}
                disabled={busy}
                className="font-mono text-sm px-4 py-3 wire-border hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-50"
              >
                [ Vypnúť MFA ]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
