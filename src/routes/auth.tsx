import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — FitFreak AI" },
      { name: "description", content: "Sign in or create your FitFreak AI account to access your adaptive fitness dashboard." },
      { property: "og:title", content: "Sign in — FitFreak AI" },
      { property: "og:description", content: "Access your FitFreak AI dashboard: goals, plans, progress and AI coach." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: "/dashboard", replace: true }); });
    const { data: sub } = supabase.auth.onAuthStateChange((e, s) => { if (e === "SIGNED_IN" && s) navigate({ to: "/dashboard", replace: true }); });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/dashboard", data: { name } } });
        if (error) throw error;
        if (!data.session) setSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) toast.error("Google sign-in failed");
  }

  const input = "w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition focus:border-lavender/60 focus:ring-2 focus:ring-primary/30";

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-5">
      <div aria-hidden className="hero-aura absolute inset-0" />
      <div aria-hidden className="grid-floor absolute inset-0 opacity-50" />
      <div className="glass-strong relative w-full max-w-md rounded-3xl p-8">
        <Link to="/" className="mb-8 flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg font-display text-sm font-extrabold text-primary-foreground" style={{ backgroundImage: "var(--gradient-violet)" }}>F</span>
          <span className="font-display font-bold">FitFreak <span className="text-lavender">AI</span></span>
        </Link>
        {sent ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Check your email</h1>
            <p className="mt-3 text-sm text-muted-foreground">We sent a confirmation link to <b className="text-foreground">{email}</b>. Click it to activate your account.</p>
            <button className="mt-6 text-sm text-lavender" onClick={() => { setSent(false); setMode("login"); }}>Back to sign in</button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{mode === "login" ? "Sign in to your FitFreak dashboard." : "Start your adaptive fitness journey."}</p>
            <button onClick={google} className="glass mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium hover:text-lavender">
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden><path fill="currentColor" d="M21.35 11.1H12v2.8h5.35c-.25 1.4-1.7 4.1-5.35 4.1a5.9 5.9 0 0 1 0-11.8c1.8 0 3 .75 3.7 1.4l2.5-2.4C16.6 3.7 14.5 2.8 12 2.8a9.2 9.2 0 1 0 0 18.4c5.3 0 8.8-3.7 8.8-9 0-.6-.05-1.05-.15-1.5z" /></svg>
              Continue with Google
            </button>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="divider-line h-px flex-1" />or<span className="divider-line h-px flex-1" /></div>
            <form onSubmit={submit} className="space-y-3">
              {mode === "signup" && <input className={input} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />}
              <input className={input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input className={input} type="password" placeholder="Password (min 6)" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button disabled={busy} className="w-full rounded-xl py-3 font-display text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60" style={{ backgroundImage: "var(--gradient-violet)" }}>
                {busy ? "Please wait…" : mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "login" ? "New to FitFreak?" : "Already have an account?"}{" "}
              <button className="text-lavender" onClick={() => setMode(mode === "login" ? "signup" : "login")}>{mode === "login" ? "Sign up" : "Sign in"}</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
