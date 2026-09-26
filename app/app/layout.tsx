import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppDataProvider } from "@/components/app/data-provider";
import { AppShell } from "@/components/app/app-shell";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "App — Unkillable",
  robots: { index: false, follow: false },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: claimsData, error } = await supabase.auth.getClaims();

  if (error || !claimsData?.claims) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_complete")
    .maybeSingle();

  if (!profile?.onboarding_complete) redirect("/onboarding");

  return (
    <AppDataProvider>
      <AppShell>{children}</AppShell>
    </AppDataProvider>
  );
}
