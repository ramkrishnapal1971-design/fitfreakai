import type { ReactNode } from "react";

export function PageHead({ title, sub, right }: { title: ReactNode; sub?: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
        {sub && <p className="mt-2 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass rounded-2xl p-5 ${className}`}>{children}</div>;
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <Panel>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-gradient">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Panel>
  );
}

export function Btn({ children, variant = "primary", className = "", ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50";
  return variant === "primary" ? (
    <button {...p} className={`${base} text-primary-foreground hover:opacity-90 ${className}`} style={{ backgroundImage: "var(--gradient-violet)" }}>{children}</button>
  ) : (
    <button {...p} className={`${base} glass hover:text-lavender ${className}`}>{children}</button>
  );
}

export const field = "w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm outline-none focus:border-lavender/60 focus:ring-2 focus:ring-primary/30";

export function Empty({ children }: { children: ReactNode }) {
  return <Panel className="py-12 text-center text-sm text-muted-foreground">{children}</Panel>;
}

export function Bar({ value }: { value: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundImage: "var(--gradient-violet)" }} />
    </div>
  );
}
