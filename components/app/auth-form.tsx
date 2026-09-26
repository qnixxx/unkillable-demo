"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { impactLight } from "@/lib/native";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" | "forgot" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");

    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address.");
    if (mode !== "forgot" && password.length < 8) return setError("Password must be at least 8 characters.");
    if (mode === "sign-up" && password !== confirm) return setError("Passwords do not match.");

    setSubmitting(true);

    try {
      const supabase = createClient();
      const origin = window.location.origin;

      if (mode === "forgot") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${origin}/auth/confirm?next=/reset-password`,
        });
        if (resetError) return setError(resetError.message);
        setSent(true);
        return;
      }

      if (mode === "sign-up") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${origin}/auth/confirm?next=/onboarding`,
          },
        });

        if (signUpError) return setError(signUpError.message);

        void impactLight();

        if (data.session) {
          router.push("/onboarding");
          router.refresh();
        } else {
          setSent(true);
        }
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) return setError(signInError.message);

      void impactLight();
      router.push("/app");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  const isSignIn = mode === "sign-in";
  const isSignUp = mode === "sign-up";

  return (
    <div className="auth-form">
      <h2>{isSignIn ? "Welcome back." : isSignUp ? "Build your system." : "Reset your password."}</h2>
      <p>{isSignIn ? "Keep the system moving." : isSignUp ? "Start with a system that survives a bad day." : "We’ll email a secure recovery link if the account exists."}</p>

      {sent ? (
        <div className="card card-pad">
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>
            {isSignUp
              ? "Check your inbox and confirm your email address to finish creating your account."
              : "Check your inbox for the password recovery link."}
          </p>
          <Link className="button button-block" style={{ marginTop: 18 }} href="/sign-in">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form className="form" onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
          </div>

          {mode !== "forgot" && (
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                minLength={8}
                required
              />
            </div>
          )}

          {isSignUp && (
            <div className="field">
              <label htmlFor="confirm">Confirm password</label>
              <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required />
            </div>
          )}

          {error && <p className="form-error" role="alert">{error}</p>}

          {isSignIn && (
            <div style={{ textAlign: "right", marginTop: -8 }}>
              <Link href="/forgot-password" style={{ fontSize: 11, color: "var(--muted)" }}>
                Forgot password?
              </Link>
            </div>
          )}

          <button className="button button-primary button-block" type="submit" disabled={submitting}>
            {submitting ? "Working…" : isSignIn ? "Sign in →" : isSignUp ? "Create account →" : "Send recovery link →"}
          </button>
        </form>
      )}

      {!sent && mode !== "forgot" && (
        <div className="auth-alt">
          {isSignIn
            ? <>New here? <Link href="/sign-up">Create an account</Link></>
            : <>Already have an account? <Link href="/sign-in">Sign in</Link></>}
        </div>
      )}
    </div>
  );
}
