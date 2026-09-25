"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createLocalSession } from "@/lib/session";
import { impactLight } from "@/lib/native";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" | "forgot" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address.");
    if (mode === "forgot") { setSent(true); return; }
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (mode === "sign-up" && password !== confirm) return setError("Passwords do not match.");
    createLocalSession();
    void impactLight();
    if (mode === "sign-up") {
      window.localStorage.removeItem("unkillable:data:v1");
      router.push("/onboarding");
    } else {
      router.push("/app");
    }
    router.refresh();
  }

  function demo() {
    createLocalSession();
    void impactLight();
    router.push("/app");
    router.refresh();
  }

  const isSignIn = mode === "sign-in";
  const isSignUp = mode === "sign-up";
  return (
    <div className="auth-form">
      <h2>{isSignIn ? "Welcome back." : isSignUp ? "Build your system." : "Reset your password."}</h2>
      <p>{isSignIn ? "Keep the streak alive." : isSignUp ? "Start with a system that survives a bad day." : "We’ll send reset instructions if an account exists."}</p>
      {sent ? (
        <div className="card card-pad"><p style={{margin:0,fontSize:13,lineHeight:1.6}}>Check your inbox. In this local demo, no email is sent; connect the auth adapter to Supabase to enable delivery.</p><Link className="button button-block" style={{marginTop:18}} href="/sign-in">Back to sign in</Link></div>
      ) : (
        <form className="form" onSubmit={submit} noValidate>
          <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></div>
          {mode !== "forgot" && <div className="field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete={isSignUp ? "new-password" : "current-password"} minLength={6} required /></div>}
          {isSignUp && <div className="field"><label htmlFor="confirm">Confirm password</label><input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={6} required /></div>}
          {error && <p className="form-error" role="alert">{error}</p>}
          {isSignIn && <div style={{textAlign:"right",marginTop:-8}}><Link href="/forgot-password" style={{fontSize:11,color:"var(--muted)"}}>Forgot password?</Link></div>}
          <button className="button button-primary button-block" type="submit">{isSignIn ? "Sign in →" : isSignUp ? "Start building →" : "Send reset link →"}</button>
        </form>
      )}
      {!sent && mode !== "forgot" && <>
        <div className="auth-alt">{isSignIn ? <>New here? <Link href="/sign-up">Create an account</Link></> : <>Already have an account? <Link href="/sign-in">Sign in</Link></>}</div>
        <div className="auth-demo"><strong style={{color:"var(--text)"}}>Demo mode</strong><br/>Authentication is adapter-ready and uses a local session cookie in this build. <button onClick={demo} className="button button-sm" style={{marginTop:10,width:"100%"}}>Open populated demo</button></div>
      </>}
    </div>
  );
}
