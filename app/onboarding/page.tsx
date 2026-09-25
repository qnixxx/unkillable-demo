import type { Metadata } from "next";
import { OnboardingFlow } from "@/components/app/onboarding-flow";
export const metadata: Metadata = { title: "Build your system — Unkillable", robots: { index: false } };
export default function Page(){ return <OnboardingFlow/>; }
