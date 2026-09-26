import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <main id="main-content" className="auth-shell">
      <section className="auth-form-wrap" style={{ margin: "0 auto" }}>
        <div className="auth-form">
          <p className="eyebrow">Authentication</p>
          <h2>That link could not be verified.</h2>
          <p>It may have expired or already been used. Request a new link and try again.</p>
          <Link className="button button-primary button-block" href="/sign-in">
            Back to sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
