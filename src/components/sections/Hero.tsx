import { motion } from "motion/react";
import { CtaButton, GlowOrb, Particles } from "@/components/site/ui";

const floatingCards = [
  { label: "FORM SCORE", value: "94%", pos: "left-[-6%] top-[16%]", delay: 0 },
  { label: "REP COUNT", value: "12", pos: "right-[-4%] top-[34%]", delay: 0.8 },
  { label: "XP EARNED", value: "+50", pos: "left-[-2%] bottom-[16%]", delay: 1.6 },
  { label: "POSTURE", value: "GOOD", pos: "right-[2%] bottom-[8%]", delay: 2.4 },
];

function PoseFigure() {
  const joints: Array<[number, number]> = [
    [100, 34],
    [100, 66],
    [70, 84],
    [130, 84],
    [56, 124],
    [144, 124],
    [100, 140],
    [80, 150],
    [120, 150],
    [74, 206],
    [126, 206],
    [70, 258],
    [130, 258],
  ];
  const bones: Array<[number, number]> = [
    [0, 1],
    [1, 2],
    [1, 3],
    [2, 4],
    [3, 5],
    [1, 6],
    [6, 7],
    [6, 8],
    [7, 9],
    [8, 10],
    [9, 11],
    [10, 12],
  ];

  return (
    <svg viewBox="0 0 200 290" className="h-full w-full">
      <defs>
        <linearGradient id="boneGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--lavender)" />
          <stop offset="100%" stopColor="var(--primary)" />
        </linearGradient>
      </defs>
      {bones.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={joints[a]![0]}
          y1={joints[a]![1]}
          x2={joints[b]![0]}
          y2={joints[b]![1]}
          stroke="url(#boneGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 + i * 0.07, ease: "easeOut" }}
        />
      ))}
      {joints.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r="4.5"
          fill="var(--neon)"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.25, 1] }}
          transition={{ duration: 0.6, delay: 1 + i * 0.05 }}
        />
      ))}
    </svg>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden px-5 pt-28 pb-16 md:px-10">
      <div aria-hidden className="hero-aura absolute inset-0" />
      <div aria-hidden className="grid-floor absolute inset-0 opacity-70" />
      <div
        aria-hidden
        className="beam-sweep absolute -top-1/3 left-0 h-[180%] w-40 bg-lavender/10 blur-3xl"
      />
      <Particles count={22} />
      <GlowOrb className="left-[-10%] top-[10%] size-[32rem]" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.65rem] font-semibold tracking-[0.24em] text-lavender"
          >
            <span className="size-1.5 rounded-full bg-neon" />
            AI-POWERED FITNESS ECOSYSTEM
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-7 text-[clamp(2.4rem,6.4vw,4.75rem)] font-extrabold leading-[0.98]"
          >
            TRAIN <span className="text-gradient glow-text">SMARTER.</span>
            <br />
            MOVE BETTER.
            <br />
            BECOME YOUR BEST.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            FitFreak AI combines adaptive fitness planning, AI coaching, real-time exercise analysis,
            gamification and privacy-first technology into one intelligent fitness ecosystem.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <CtaButton href="#ecosystem">Explore FitFreak AI</CtaButton>
            <CtaButton href="#ai" variant="ghost">
              See How Our AI Works
            </CtaButton>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-10 font-display text-xs tracking-[0.2em] text-muted-foreground"
          >
            YOUR FITNESS. YOUR AI. YOUR PRIVACY.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative mx-auto aspect-square w-full max-w-lg"
        >
          <div aria-hidden className="spin-slow absolute inset-4 rounded-full border border-lavender/20" />
          <div
            aria-hidden
            className="spin-slow absolute inset-12 rounded-full border border-dashed border-primary/40"
            style={{ animationDirection: "reverse" }}
          />
          <div className="glass-strong absolute inset-[16%] rounded-[2rem] p-6">
            <div className="flex h-full items-center justify-center">
              <div className="float-soft h-full max-h-72">
                <PoseFigure />
              </div>
            </div>
            <div className="absolute inset-x-6 bottom-5 flex items-end gap-1">
              {[6, 14, 9, 22, 12, 28, 16, 34, 20, 26, 11, 18].map((h, i) => (
                <motion.span
                  key={i}
                  className="flex-1 rounded-t bg-neon/70"
                  animate={{ height: [h, h * 2.1, h] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.1 }}
                  style={{ height: h }}
                />
              ))}
            </div>
          </div>

          {floatingCards.map((c) => (
            <motion.div
              key={c.label}
              className={`glass-strong absolute ${c.pos} rounded-xl px-4 py-3`}
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, delay: c.delay, ease: "easeInOut" }}
            >
              <p className="text-[0.6rem] tracking-[0.18em] text-muted-foreground">{c.label}</p>
              <p className="font-display text-lg font-bold text-lavender">{c.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
