import type { Metadata } from "next";
import { AuthShell } from "@/components/app/auth-shell";
export const metadata: Metadata = { title: "Sign in — Unkillable", robots: { index: false } };
export default function Page(){ return <AuthShell mode="sign-in"/>; }
