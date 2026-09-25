import Link from "next/link";
import { AuthForm } from "@/components/app/auth-form";

export function AuthShell({ mode }: { mode: "sign-in" | "sign-up" | "forgot" }) {
  return <main id="main-content" className="auth-shell">
    <section className="auth-brand" aria-label="Unkillable brand statement">
      <Link className="wordmark" href="/">UNKILLABLE<span className="wordmark-mark" /></Link>
      <div className="auth-statement"><p className="eyebrow">Built for bad days</p><h1 className="display">KEEP<br/>MOVING.</h1><p>Build the habits, recovery, and systems that make disruption less expensive.</p></div>
      <p className="eyebrow">Unkillable.app / 2026</p>
    </section>
    <section className="auth-form-wrap"><AuthForm mode={mode}/></section>
  </main>;
}
