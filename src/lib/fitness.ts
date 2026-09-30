import exercisesData from "./exercises.json";
import mealsData from "./meals.json";

export type Exercise = { id: string; name: string; sets: number; reps: number; durationMinutes: number; image?: string; done?: boolean };
export type Meal = { id: string; name: string; calories: number; protein: number; carbs: number; fats: number; image?: string; taken?: boolean };
export type DailyPlan = { day: number; calories: number; macros: Macros; exercises: Exercise[]; meals: Meal[]; isRestDay: boolean };
export type Macros = { protein: number; carbs: number; fats: number };

export const GOAL_TYPES = [
  { value: "build_muscle", label: "Build Muscle", emoji: "💪", desc: "Add lean mass with structured strength work" },
  { value: "lose_weight", label: "Lose Weight", emoji: "🔥", desc: "Burn fat with a sustainable deficit" },
  { value: "gain_weight", label: "Gain Weight", emoji: "📈", desc: "Build size with a clean calorie surplus" },
  { value: "endurance", label: "Build Endurance", emoji: "🏃", desc: "Boost stamina and cardio capacity" },
  { value: "maintain", label: "Maintain Fitness", emoji: "⚖️", desc: "Stay consistent and keep what you've built" },
] as const;

export const PACES = [
  { value: "slow", label: "Steady", desc: "Gentle and sustainable" },
  { value: "normal", label: "Balanced", desc: "Recommended pace" },
  { value: "fast", label: "Aggressive", desc: "Faster, more demanding" },
] as const;

export const ACTIVITY = [
  { value: "sedentary", label: "Sedentary", f: 1.2 },
  { value: "light", label: "Lightly active", f: 1.375 },
  { value: "moderate", label: "Moderately active", f: 1.55 },
  { value: "active", label: "Active", f: 1.725 },
  { value: "very_active", label: "Very active", f: 1.9 },
] as const;

export const goalLabel = (v?: string | null) => GOAL_TYPES.find((g) => g.value === v)?.label ?? v ?? "—";

export type ProfileLike = { age?: number | null; gender?: string | null; height?: number | null; current_weight?: number | null; activity_level?: string | null };

export function bmi(p: ProfileLike) {
  if (!p.height || !p.current_weight) return null;
  const m = Number(p.height) / 100;
  return +(Number(p.current_weight) / (m * m)).toFixed(1);
}
export function bmiCategory(b: number | null) {
  if (b == null) return null;
  if (b < 18.5) return "Underweight";
  if (b < 25) return "Normal weight";
  if (b < 30) return "Overweight";
  return "Obese";
}
export function tdee(p: ProfileLike) {
  if (!p.height || !p.current_weight || !p.age || !p.gender) return null;
  const w = Number(p.current_weight), h = Number(p.height), a = Number(p.age);
  const bmr = p.gender === "male" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
  const f = ACTIVITY.find((x) => x.value === p.activity_level)?.f ?? 1.2;
  return Math.round(bmr * f);
}

const RATIOS: Record<string, Macros> = {
  lose_weight: { protein: 0.3, carbs: 0.4, fats: 0.3 },
  gain_weight: { protein: 0.25, carbs: 0.5, fats: 0.25 },
  maintain: { protein: 0.25, carbs: 0.5, fats: 0.25 },
  build_muscle: { protein: 0.35, carbs: 0.4, fats: 0.25 },
  endurance: { protein: 0.2, carbs: 0.6, fats: 0.2 },
};

export function goalTargets(p: ProfileLike, type: string, pace: string) {
  const base = tdee(p) ?? 2000;
  const delta = pace === "fast" ? 700 : pace === "slow" ? 300 : 500;
  const cals = type === "lose_weight" ? base - delta : type === "gain_weight" || type === "build_muscle" ? base + Math.round(delta / 2) : base;
  const r = RATIOS[type] ?? RATIOS["maintain"]!;
  return {
    daily_calories: Math.max(1200, cals),
    macros: { protein: Math.round((cals * r.protein) / 4), carbs: Math.round((cals * r.carbs) / 4), fats: Math.round((cals * r.fats) / 9) },
  };
}

export function durationWeeks(current?: number | null, target?: number | null, pace = "normal") {
  if (!current || !target) return null;
  const perWeek = pace === "fast" ? 1 : pace === "slow" ? 0.25 : 0.5;
  return Math.max(1, Math.ceil(Math.abs(Number(current) - Number(target)) / perWeek));
}

const uid = () => Math.random().toString(36).slice(2, 10);
const shuffle = <T,>(a: T[]) => [...a].sort(() => 0.5 - Math.random());
const SPLIT = ["chest", "back", "legs", "cardio", "fullbody", "shoulders", "rest"];
const GROUP: Record<string, RegExp> = { chest: /bench|push/i, back: /deadlift|row|pull/i, legs: /squat|leg|lunge/i, cardio: /jog|cycl|jump|hiit|run/i, fullbody: /plank|yoga|burpee/i, shoulders: /shoulder|press/i };

type Raw = { name: string; tags: string[]; sets?: number; reps?: number; durationMinutes?: number; image?: string; calories?: number; protein?: number; carbs?: number; fats?: number };
export function generateWeek(goal: { type: string; pace: string; daily_calories?: number | null; macros?: Macros | null }): DailyPlan[] {
  const ex = (exercisesData as Raw[]).filter((e) => e.tags.includes(goal.type) || e.tags.includes(goal.pace));
  const ms = (mealsData as Raw[]).filter((m) => m.tags.includes(goal.type) || m.tags.includes(goal.pace));
  const exPool = ex.length ? ex : (exercisesData as Raw[]);
  const mealPool = ms.length ? ms : (mealsData as Raw[]);
  return Array.from({ length: 7 }, (_, i) => {
    const kind = SPLIT[i]!;
    const pool = kind === "rest" ? [] : exPool.filter((e) => GROUP[kind]!.test(e.name));
    const chosen = kind === "rest" ? [] : shuffle(pool.length >= 2 ? pool : exPool).slice(0, 2);
    return {
      day: i + 1,
      calories: goal.daily_calories ?? 2000,
      macros: goal.macros ?? { protein: 100, carbs: 200, fats: 70 },
      isRestDay: chosen.length === 0,
      exercises: chosen.map((e) => ({ id: uid(), name: e.name, sets: e.sets as number, reps: e.reps as number, durationMinutes: e.durationMinutes as number, image: e.image as string, done: false })),
      meals: shuffle(mealPool).slice(0, 3).map((m) => ({ id: uid(), name: m.name, calories: m.calories as number, protein: m.protein as number, carbs: m.carbs as number, fats: m.fats as number, image: m.image as string, taken: false })),
    };
  });
}

export type PlanRow = { id: string; start_date: string; daily_plans: unknown; week_number: number; goal_id: string | null; created_at: string };
export type DayProgress = { date: string; completed: boolean; exDone: number; exTotal: number; mealDone: number; mealTotal: number };

export const iso = (d: Date) => d.toISOString().slice(0, 10);

export function progressFromPlans(plans: PlanRow[]): DayProgress[] {
  const out: DayProgress[] = [];
  for (const p of plans) {
    for (const d of (p.daily_plans as DailyPlan[]) ?? []) {
      const date = new Date(p.start_date + "T00:00:00Z");
      date.setUTCDate(date.getUTCDate() + d.day - 1);
      const exDone = d.exercises.filter((e) => e.done).length;
      const mealDone = d.meals.filter((m) => m.taken).length;
      out.push({ date: iso(date), exDone, exTotal: d.exercises.length, mealDone, mealTotal: d.meals.length, completed: exDone === d.exercises.length && mealDone === d.meals.length && (d.exercises.length + d.meals.length) > 0 });
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

export function streaks(days: DayProgress[]) {
  const done = new Set(days.filter((d) => d.completed).map((d) => d.date));
  let longest = 0, run = 0, prev: string | null = null;
  for (const d of [...done].sort()) {
    if (prev) {
      const diff = (Date.parse(d) - Date.parse(prev)) / 864e5;
      run = diff === 1 ? run + 1 : 1;
    } else run = 1;
    longest = Math.max(longest, run);
    prev = d;
  }
  let current = 0;
  const cur = new Date();
  if (!done.has(iso(cur))) cur.setUTCDate(cur.getUTCDate() - 1);
  while (done.has(iso(cur))) { current++; cur.setUTCDate(cur.getUTCDate() - 1); }
  return { current, longest };
}

export function coinsFrom(days: DayProgress[]) {
  return days.reduce((s, d) => s + d.exDone * 5 + d.mealDone * 2 + (d.completed ? 10 : 0), 0);
}

export function todayIndex(plan: PlanRow) {
  const diff = Math.floor((Date.parse(iso(new Date())) - Date.parse(plan.start_date)) / 864e5);
  return diff >= 0 && diff < 7 ? diff : null;
}
