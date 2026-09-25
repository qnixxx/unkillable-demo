import type { Metadata } from "next";
import { AppDataProvider } from "@/components/app/data-provider";
import { AppShell } from "@/components/app/app-shell";
import { AuthGuard } from "@/components/app/auth-guard";

export const metadata: Metadata = { title: "App — Unkillable", robots: { index: false, follow: false } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthGuard><AppDataProvider><AppShell>{children}</AppShell></AppDataProvider></AuthGuard>;
}
