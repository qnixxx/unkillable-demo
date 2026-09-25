import Link from "next/link";

export function ContentPage({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <main id="main-content" style={{minHeight:"100vh",padding:"40px 0 90px"}}>
    <div className="container">
      <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingBottom:80}}><Link className="wordmark" href="/">UNKILLABLE<span className="wordmark-mark"/></Link><Link className="button button-sm" href="/">Back home</Link></header>
      <article style={{maxWidth:760,margin:"0 auto"}}><p className="eyebrow">{eyebrow}</p><h1 className="display" style={{fontSize:"clamp(56px,8vw,108px)",margin:"0 0 42px"}}>{title}</h1><div style={{color:"var(--muted)",fontSize:16,lineHeight:1.75}}>{children}</div></article>
    </div>
  </main>;
}
