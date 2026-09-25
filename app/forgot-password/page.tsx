import type { Metadata } from "next";
import { AuthShell } from "@/components/app/auth-shell";
export const metadata: Metadata = { title: "Reset password — Unkillable", robots: { index: false } };
export default function Page(){ return <AuthShell mode="forgot"/>; }
