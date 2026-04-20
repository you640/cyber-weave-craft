import { useState, useEffect, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WireNav } from "@/components/landing/WireNav";
import { WireFooter } from "@/components/landing/WireFooter";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = "Nové heslo · Nexify";
    // Supabase parses the recovery token from URL hash and emits PASSWORD_RECOVERY
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
    // also check existing session (link already consumed)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Heslo musí mať aspoň 8 znakov");
      return;
    }
    if (password !== confirm) {
      toast.error("Heslá sa nezhodujú");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error("Nepodarilo sa zmeniť heslo", { description: error.message });
      return;
    }
    toast.success("Heslo zmenené", { description: "Si prihlásený." });
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background relative wire-dots">
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-4 pb-16">
        <WireNav />

        <main className="mt-12 max-w-xl mx-auto">
          <div className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase mb-3">
            // ACCESS · 10B · PASSWORD RECOVERY
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-8">
            Nastav nové heslo<span className="text-primary">.</span>
          </h1>

          <section className="wire-border bg-background p-6 md:p-8 wire-shadow">
            {!ready ? (
              <div className="font-mono text-xs text-muted-foreground py-8 text-center">
                [ overujem reset link... ]
                <div className="mt-4 text-[10px] tracking-[0.2em] uppercase">
                  Ak link nefunguje, vyžiadaj si nový z{" "}
                  <Link to="/auth" className="text-primary underline">
                    /auth
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase block mb-2">
                    Nové heslo
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full font-mono text-sm px-3 py-2.5 wire-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="min. 8 znakov"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase block mb-2">
                    Potvrdiť heslo
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full font-mono text-sm px-3 py-2.5 wire-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="zopakuj heslo"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full font-mono text-sm px-4 py-3 bg-primary text-primary-foreground wire-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center justify-between disabled:opacity-50"
                >
                  <span>{busy ? "[ ... ]" : "[ Uložiť nové heslo ]"}</span>
                  <span>→</span>
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-dashed border-foreground/30 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              <Link to="/" className="hover:text-foreground transition-colors">
                ← Späť na hlavnú
              </Link>
            </div>
          </section>
        </main>

        <WireFooter />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
