import { motion } from "motion/react";
import { Card, GlowOrb, Reveal, Section, SectionHead } from "@/components/site/ui";

const problems = [
  {
    n: "01",
    title: "Static Plans",
    body: "Predefined routines don't always adapt to changing performance, goals or daily condition.",
  },
  {
    n: "02",
    title: "No Real-Time Form Feedback",
    body: "Users can repeat incorrect movements without knowing what needs improvement.",
  },
  {
    n: "03",
    title: "Limited Personalization",
    body: "Different bodies, goals and performance levels need different guidance.",
  },
  {
    n: "04",
    title: "Camera Privacy Concerns",
    body: "Sensitive body images and workout videos can create privacy concerns when processing happens in the cloud.",
  },
  {
    n: "05",
    title: "Motivation Drops",
    body: "Repeating the same routine without meaningful feedback can make consistency difficult.",
  },
];

const cycle = ["PLAN", "PERFORM", "ANALYZE", "ADAPT", "REWARD"];

export function Problem() {
  return (
    <Section id="problem">
      <GlowOrb className="right-[-10%] top-0 size-[26rem]" />
      <SectionHead
        eyebrow="The Problem"
        title={
          <>
            Fitness Has Changed.
            <br />
            But Most Fitness Apps <span className="text-gradient">Haven&apos;t.</span>
          </>
        }
      />

      <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {problems.map((p, i) => (
          <Reveal key={p.n} index={i}>
            <Card className="h-full">
              <p className="font-display text-4xl font-extrabold text-primary/40">{p.n}</p>
              <h3 className="mt-4 text-xl font-semibold">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function Solution() {
  return (
    <Section id="solution" className="border-y border-border">
      <div aria-hidden className="grid-floor absolute inset-0 opacity-40" />
      <SectionHead
        eyebrow="The Solution"
        title={
          <>
            Meet <span className="text-gradient">FitFreak AI</span>
          </>
        }
        subtitle="From static routines to an adaptive fitness ecosystem."
      />

      <div className="relative mt-20 grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div aria-hidden className="spin-slow absolute inset-0 rounded-full border border-dashed border-lavender/25" />
            {cycle.map((step, i) => {
              const angle = (i / cycle.length) * Math.PI * 2 - Math.PI / 2;
              return (
                <motion.div
                  key={step}
                  className="glass-strong absolute rounded-xl px-4 py-2.5 font-display text-xs font-bold tracking-[0.14em]"
                  style={{
                    left: `${50 + Math.cos(angle) * 40}%`,
                    top: `${50 + Math.sin(angle) * 40}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  animate={{ opacity: [0.5, 1, 0.5], scale: [0.97, 1.05, 0.97] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.8 }}
                >
                  {step}
                </motion.div>
              );
            })}
            <div className="absolute inset-[30%] grid place-items-center rounded-full glass-strong text-center">
              <p className="font-display text-sm font-bold leading-tight">
                CONTINUOUS
                <br />
                <span className="text-lavender">FEEDBACK LOOP</span>
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal index={1}>
          <p className="text-lg leading-relaxed text-muted-foreground">
            FitFreak AI combines personalized planning, exercise intelligence, progress analysis and
            gamification into one continuous feedback loop.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {[
              "Your data",
              "AI",
              "Personalized plan",
              "Your performance",
              "AI feedback",
              "Updated plan",
            ].map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <span className="glass rounded-full px-4 py-2 text-sm">{s}</span>
                {i < 5 ? <span className="text-lavender">→</span> : null}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
