import { useState, useEffect, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { WireNav } from "@/components/landing/WireNav";
import { WireFooter } from "@/components/landing/WireFooter";

type Mode = "signin" | "signup";

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, loading: sessionLoading } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = "Prihlásenie · Nexify";
    if (!sessionLoading && user) navigate("/", { replace: true });
  }, [user, sessionLoading, navigate]);

  const handleOAuth = async (provider: "google" | "apple") => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("OAuth zlyhal", { description: String(result.error.message ?? result.error) });
        setBusy(false);
        return;
      }
      if (result.redirected) return; // browser will navigate
      navigate("/", { replace: true });
    } catch (err) {
      toast.error("Niečo sa pokazilo");
      setBusy(false);
    }
  };

  const handleEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setBusy(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });
      if (error) {
        toast.error("Registrácia zlyhala", { description: error.message });
      } else {
        toast.success("Hotovo", { description: "Si prihlásený." });
        navigate("/", { replace: true });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error("Prihlásenie zlyhalo", { description: error.message });
      } else {
        navigate("/", { replace: true });
      }
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-background relative wire-dots">
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-4 pb-16">
        <WireNav />

        <main className="mt-12">
          <div className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase mb-3">
            // ACCESS · 10 · AUTHENTICATION GATEWAY
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-8">
            Vstup do dispečingu<span className="text-primary">.</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left value-prop */}
            <aside className="md:col-span-5 wire-border bg-[hsl(var(--wire-bg-soft))] p-6 md:p-8">
              <div className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-4">
                FIG_10A · why-login.svg
              </div>
              <p className="text-lg leading-relaxed mb-6">
                Prihlás sa a získaš prístup k <strong>live dispečingu</strong>, alertom v reálnom čase a histórii blokovaných útokov na tvoje doméne.
              </p>
              <ul className="space-y-3 font-mono text-xs">
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span>Prehľad blokovaných hrozieb za posledných 30 dní</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span>Push alerty pri kritických incidentoch</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span>Export auditných logov v PDF / CSV</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span>Priamy kanál na bezpečnostný tím</span>
                </li>
              </ul>
              <div className="mt-8 wire-border bg-background p-4">
                <div className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-2">
                  Bezpečnosť
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Heslá sú overené proti databáze HaveIBeenPwned. OAuth prebieha cez šifrovaný kanál. Žiadne tracking pixely.
                </p>
              </div>
            </aside>

            {/* Right auth card */}
            <section className="md:col-span-7 wire-border bg-background p-6 md:p-8 wire-shadow">
              <div className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-6">
                {mode === "signin" ? "// SIGN-IN" : "// SIGN-UP"}
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleOAuth("google")}
                  disabled={busy}
                  className="w-full font-mono text-sm px-4 py-3 wire-border bg-background hover:bg-[hsl(var(--wire-bg-soft))] wire-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center justify-between disabled:opacity-50"
                >
                  <span>[ Pokračovať cez Google ]</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => handleOAuth("apple")}
                  disabled={busy}
                  className="w-full font-mono text-sm px-4 py-3 bg-foreground text-background wire-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center justify-between disabled:opacity-50"
                >
                  <span>[ Pokračovať cez Apple ]</span>
                  <span>→</span>
                </button>
              </div>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 border-t border-dashed border-foreground/30" />
                <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                  alebo email
                </span>
                <div className="flex-1 border-t border-dashed border-foreground/30" />
              </div>

              <form onSubmit={handleEmail} className="space-y-4">
                <div>
                  <label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full font-mono text-sm px-3 py-2.5 wire-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="ty@firma.sk"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase block mb-2">
                    Heslo
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full font-mono text-sm px-3 py-2.5 wire-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="min. 8 znakov"
                  />
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full font-mono text-sm px-4 py-3 bg-primary text-primary-foreground wire-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center justify-between disabled:opacity-50"
                >
                  <span>
                    {busy ? "[ ... ]" : mode === "signin" ? "[ Prihlásiť sa ]" : "[ Vytvoriť účet ]"}
                  </span>
                  <span>→</span>
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-dashed border-foreground/30 text-center">
                <button
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                  className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {mode === "signin" ? (
                    <>Nemáš účet? <span className="text-primary underline">Zaregistruj sa</span></>
                  ) : (
                    <>Už máš účet? <span className="text-primary underline">Prihlás sa</span></>
                  )}
                </button>
              </div>

              <div className="mt-6 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                <Link to="/" className="hover:text-foreground transition-colors">← Späť na hlavnú</Link>
              </div>
            </section>
          </div>
        </main>

        <WireFooter />
      </div>
    </div>
  );
};

export default AuthPage;
