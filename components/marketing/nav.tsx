"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { marketingNav } from "@/lib/config";

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-nav${scrolled ? " scrolled" : ""}`}>
      <div className="container nav-inner">
        <Link className="wordmark" href="/" aria-label="Unkillable home">UNKILLABLE<span className="wordmark-mark" /></Link>
        <nav className="nav-links" aria-label="Primary navigation">
          {marketingNav.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <div className="nav-actions">
          <span className="demo-nav-label">INTERACTIVE DEMO</span>
          <Link className="button button-primary" href="/app">Open product →</Link>
        </div>
      </div>
    </header>
  );
}
