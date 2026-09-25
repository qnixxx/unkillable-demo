"use client";

import { useEffect, useState } from "react";
import { createLocalSession } from "@/lib/session";

/**
 * Investor demo guard: keeps the app route structure intact while removing
 * authentication friction. Production auth can replace this component later.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    createLocalSession();
    setReady(true);
  }, []);

  if (!ready) return <div className="native-auth-loading" role="status" aria-live="polite"><span className="wordmark">UNKILLABLE</span><span>Loading the product demo…</span></div>;
  return children;
}
