import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { PlanRow } from "./fitness";

export function useUserId() {
  return useQuery({
    queryKey: ["uid"],
    queryFn: async () => (await supabase.auth.getUser()).data.user?.id ?? null,
    staleTime: Infinity,
  }).data;
}

export function useProfile() {
  const uid = useUserId();
  return useQuery({
    queryKey: ["profile", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", uid!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useGoals() {
  const uid = useUserId();
  return useQuery({
    queryKey: ["goals", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase.from("goals").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function usePlans() {
  const uid = useUserId();
  return useQuery({
    queryKey: ["plans", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase.from("plans").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as PlanRow[];
    },
  });
}

export function useInvalidate() {
  const qc = useQueryClient();
  return (...keys: string[]) => keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
}
