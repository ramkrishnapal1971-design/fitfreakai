import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SYSTEM = `You are FitFreak AI Coach, a friendly, concise fitness and nutrition guide.
Give practical, safe, encouraging advice on workouts, form, meals, recovery, sleep and motivation.
You are not a doctor: never diagnose, never give medical treatment advice. For pain, injury, pregnancy,
eating disorders or medical conditions, recommend a qualified professional. Keep answers under 180 words unless asked for more.`;

export const sendChat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ message: z.string().trim().min(1).max(4000) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const [{ data: profile }, { data: history }, { data: goal }] = await Promise.all([
      supabase.from("profiles").select("name,age,gender,height,current_weight,target_weight,activity_level").eq("id", userId).maybeSingle(),
      supabase.from("chat_messages").select("role,content").eq("user_id", userId).order("created_at", { ascending: false }).limit(16),
      supabase.from("goals").select("type,target_weight,pace,daily_calories").eq("user_id", userId).eq("status", "active").order("created_at", { ascending: false }).limit(1).maybeSingle(),
    ]);

    await supabase.from("chat_messages").insert({ user_id: userId, role: "user", content: data.message });

    const ctx = `User profile: ${JSON.stringify(profile ?? {})}. Active goal: ${JSON.stringify(goal ?? null)}.`;
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env["LOVABLE_API_KEY"]}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM + "\n" + ctx },
          ...(history ?? []).reverse().map((m) => ({ role: m.role, content: m.content })),
          { role: "user", content: data.message },
        ],
      }),
    });
    if (!res.ok) {
      console.error("AI error", res.status, await res.text());
      const msg = res.status === 429 ? "The coach is busy right now — please try again in a moment." : res.status === 402 ? "AI credits have run out for this app." : "The coach couldn't answer right now.";
      return { reply: msg, error: true };
    }
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const reply = json.choices?.[0]?.message?.content?.trim() || "Sorry, I didn't catch that.";
    await supabase.from("chat_messages").insert({ user_id: userId, role: "assistant", content: reply });
    return { reply, error: false };
  });
