import { createFileRoute } from "@tanstack/react-router";
import { PageHead, Stat } from "@/components/dash/ui";
import { useProfile, usePlans } from "@/lib/data";
import { coinsFrom, progressFromPlans, streaks } from "@/lib/fitness";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Command Hub — FitFreak AI" }, { name: "description", content: "Your FitFreak AI dashboard." }] }),
  component: Dashboard,
});

function Dashboard() {
  const { data: profile } = useProfile();
  const { data: plans = [] } = usePlans();
  const days = progressFromPlans(plans);
  const s = streaks(days);
  return (
    <>
      <PageHead title={<>Hi, <span className="text-gradient">{profile?.name || "Athlete"}</span></>} sub="Your FitFreak command hub." />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Current streak" value={s.current} hint={`Longest ${s.longest} days`} />
        <Stat label="Coins" value={coinsFrom(days)} />
        <Stat label="Plans" value={plans.length} />
      </div>
    </>
  );
}
