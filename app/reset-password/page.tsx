import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/app/reset-password-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Set new password — Unkillable", robots: { index: false } };

export default function Page() {
  return (
    <main id="main-content" className="auth-shell">
      <section className="auth-form-wrap" style={{ margin: "0 auto" }}>
        <div className="auth-form">
          <p className="eyebrow">Account recovery</p>
          <h2>Choose a new password.</h2>
          <p>Your recovery session is temporary. Save the new password to continue.</p>
          <ResetPasswordForm />
        </div>
      </section>
    </main>
  );
}
