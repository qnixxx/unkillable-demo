import type { Metadata } from "next";
import { AuthShell } from "@/components/app/auth-shell";
export const metadata: Metadata = { title: "Start building — Unkillable", robots: { index: false } };
export default function Page(){ return <AuthShell mode="sign-up"/>; }
