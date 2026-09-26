import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/components/app/onboarding-flow";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Build your system — Unkillable",
  robots: { index: false },
};

export default async function Page() {
  const supabase = await createClient();
  const { data: claimsData, error } = await supabase.auth.getClaims();

  if (error || !claimsData?.claims) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_complete")
    .maybeSingle();

  if (profile?.onboarding_complete) redirect("/app");

  return <OnboardingFlow />;
}
