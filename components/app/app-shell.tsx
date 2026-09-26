"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { appNav } from "@/lib/config";
import { Icon } from "@/components/ui/icons";
import { useAppData } from "@/components/app/data-provider";
import { createClient } from "@/lib/supabase/client";

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname.startsWith(href);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data, hydrated, loadError } = useAppData();
  const date = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric" }).format(new Date());

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/sign-in");
    router.refresh();
  }

  if (!hydrated) {
    return <div className="native-auth-loading" role="status" aria-live="polite"><span className="wordmark">UNKILLABLE</span><span>Syncing your system…</span></div>;
  }

  if (loadError) {
    return <div className="native-auth-loading" role="alert"><span className="wordmark">UNKILLABLE</span><span>{loadError}</span><button className="button" onClick={() => router.refresh()}>Try again</button></div>;
  }

  return <div className={`app-body${data.settings.reducedMotion ? " reduce-motion" : ""}`}>
    <div className="app-shell">
      <aside className="app-sidebar" aria-label="App navigation">
        <div className="sidebar-brand"><Link className="wordmark" href="/app">UNKILLABLE<span className="wordmark-mark" /></Link></div>
        <nav className="sidebar-nav">
          {appNav.map((item) => <Link className={`sidebar-link${isActive(pathname,item.href) ? " active" : ""}`} href={item.href} key={item.href}><Icon name={item.icon}/>{item.label}</Link>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-user"><span className="avatar">{data.settings.displayName.slice(0,2).toUpperCase()}</span><span><strong>{data.settings.displayName}</strong><span>Free plan</span></span></div>
          <button className="sidebar-link" onClick={() => void signOut()}><Icon name="logout"/>Sign out</button>
        </div>
      </aside>
      <div className="app-main">
        <header className="app-topbar"><div className="demo-topbar-left"><span className="date">{date}</span><span className="demo-mode-badge">CLOUD SYNC</span></div><div style={{display:"flex",alignItems:"center",gap:10}}><span className="eyebrow" style={{margin:0}}>Stay in motion.</span><Link className="icon-button" href="/app/settings" aria-label="Settings"><Icon name="settings"/></Link></div></header>
        <main id="main-content" className="app-content">{children}</main>
      </div>
      <nav className="mobile-bottom-nav" aria-label="Mobile app navigation">
        {appNav.slice(0,5).map((item) => <Link className={isActive(pathname,item.href) ? "active" : ""} href={item.href} key={item.href}><Icon name={item.icon}/><span>{item.label}</span></Link>)}
      </nav>
    </div>
  </div>;
}
