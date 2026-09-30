import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/lib/data";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: Shell,
});

const NAV = [
  { to: "/dashboard", label: "Command Hub", icon: "◈" },
] as const;

function Shell() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: profile } = useProfile();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const side = (
    <nav className="flex h-full flex-col gap-1 p-4">
      <Link to="/" className="mb-6 flex items-center gap-2.5 px-2">
        <span className="grid size-8 place-items-center rounded-lg font-display text-sm font-extrabold text-primary-foreground" style={{ backgroundImage: "var(--gradient-violet)" }}>F</span>
        <span className="font-display font-bold">FitFreak <span className="text-lavender">AI</span></span>
      </Link>
      {NAV.map((n) => (
        <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
          activeProps={{ className: "!bg-primary/15 !text-lavender" }}>
          <span className="w-4 text-center">{n.icon}</span>{n.label}
        </Link>
      ))}
      <div className="mt-auto rounded-xl border border-border p-3">
        <p className="truncate text-sm font-medium">{profile?.name || "Athlete"}</p>
        <button onClick={signOut} className="mt-2 text-xs text-muted-foreground hover:text-lavender">Sign out</button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="glass fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-border md:block">{side}</aside>
      <header className="glass sticky top-0 z-40 flex items-center justify-between px-4 py-3 md:hidden">
        <span className="font-display font-bold">FitFreak <span className="text-lavender">AI</span></span>
        <button aria-label="Menu" onClick={() => setOpen((v) => !v)} className="glass rounded-lg px-3 py-1.5 text-sm">Menu</button>
      </header>
      {open && <div className="glass-strong fixed inset-0 z-50 md:hidden"><button className="absolute right-4 top-4 text-sm" onClick={() => setOpen(false)}>Close</button>{side}</div>}
      <main className="relative md:pl-60">
        <div aria-hidden className="hero-aura pointer-events-none fixed inset-0 opacity-40" />
        <div className="relative mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-10"><Outlet /></div>
      </main>
    </div>
  );
}
