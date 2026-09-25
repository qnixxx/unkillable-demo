import Link from "next/link";
import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/nav";
import { LiveHeroDashboard, MinimumDayDemo, ProtocolDemo } from "@/components/marketing/interactive";
import { MarketingLineChart, RadarChart } from "@/components/marketing/charts";
import { pillarDefinitions, pricing, testimonials } from "@/lib/config";
import type { Pillar } from "@/types";
import { Progress } from "@/components/ui/primitives";

export const metadata: Metadata = { alternates: { canonical: process.env.NEXT_PUBLIC_SITE_URL ?? "https://unkillable.app" } };

const marketingScores: Record<Pillar, { score: number; trend: number }> = {
  body: { score: 86, trend: 4 },
  mind: { score: 76, trend: 3 },
  discipline: { score: 91, trend: 8 },
  recovery: { score: 68, trend: -2 },
  relationships: { score: 79, trend: 5 },
  purpose: { score: 87, trend: 4 },
};

export default function HomePage() {
  const pillars = Object.keys(pillarDefinitions) as Pillar[];
  return (
    <>
      <MarketingNav />
      <main id="main-content">
        <section className="hero grid-bg">
          <div className="container hero-grid">
            <div>
              <p className="eyebrow">Resilience operating system</p>
              <h1 className="display hero-title">BECOME<br/>HARDER<br/>TO BREAK.</h1>
              <p className="hero-copy"><strong>Life will disrupt your plans.</strong><br/>Unkillable gives you a system for building the habits, discipline, recovery, and resilience that keep you moving anyway.</p>
              <div className="hero-actions">
                <Link className="button button-primary" href="/app">Open live product →</Link>
                <a className="button" href="#how-it-works">See how it works</a>
              </div>
              <p className="hero-note">Interactive front-end demo. No account required.</p>
              <p className="investor-demo-note"><span>LIVE DEMO</span> 90+ days of imperfect sample data · every interaction persists in this browser.</p>
            </div>
            <LiveHeroDashboard />
          </div>
        </section>

        <section className="section" id="method">
          <div className="container editorial-grid">
            <div>
              <p className="eyebrow">The method</p>
              <h2 className="display editorial-title">MOTIVATION IS UNRELIABLE.<br/><span className="accent">SYSTEMS AREN&apos;T.</span></h2>
            </div>
            <div className="editorial-copy">
              <p>Most self-improvement products quietly assume you&apos;ll keep feeling motivated. <strong>Unkillable starts with the opposite assumption.</strong></p>
              <p>Some days will be chaotic. Some days motivation disappears. Some days you will fail. The goal is not perfection. It is becoming increasingly difficult to knock off course.</p>
              <div className="statement-list" aria-label="Resilience principles">
                <div className="statement-row"><span>01</span><span>Design for bad days, not ideal ones.</span></div>
                <div className="statement-row"><span>02</span><span>Measure recovery as seriously as streaks.</span></div>
                <div className="statement-row"><span>03</span><span>Lower the dose before you abandon the system.</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="features">
          <div className="container">
            <div className="section-heading">
              <div><p className="eyebrow">The system</p><h2 className="display">YOUR RESILIENCE HAS<br/>SIX PILLARS.</h2></div>
              <p>A durable life is balanced. Unkillable tracks the areas that help you absorb pressure, adapt, and return quickly.</p>
            </div>
            <div className="pillars-grid">
              {pillars.map((pillar) => {
                const def = pillarDefinitions[pillar]; const metric = marketingScores[pillar];
                return <article className="pillar-module" key={pillar}>
                  <div className="pillar-top"><span className="pillar-glyph">{def.glyph}</span><span className="eyebrow" style={{margin:0}}>0{pillars.indexOf(pillar)+1}</span></div>
                  <div className="pillar-score mono">{metric.score}<small style={{fontSize:14,color:"var(--muted)"}}> / 100</small></div>
                  <div className={`trend ${metric.trend < 0 ? "trend-negative" : ""}`}>{metric.trend >= 0 ? "↑" : "↓"} {Math.abs(metric.trend)} this month</div>
                  <h3>{def.label}</h3>
                  <p>{def.description}</p>
                  <div style={{marginTop:16}}><Progress value={metric.score} label={`${def.label} score ${metric.score}`} /></div>
                  <p className="sample">Example: {def.sample}</p>
                </article>;
              })}
            </div>
          </div>
        </section>

        <section className="section score-section">
          <div className="container score-showcase">
            <div className="score-copy">
              <p className="eyebrow">Your resilience, measured</p>
              <h2 className="display">THE UNKILLABLE<br/>SCORE.</h2>
              <p>A single 0–100 product metric built from your consistency, balance, recovery, and activity across the six pillars. It helps you see whether your system is getting more dependable.</p>
              <p className="disclaimer">The Unkillable Score is not a medical or scientific diagnosis of resilience.</p>
            </div>
            <div className="score-board">
              <div className="score-board-head">
                <div><p className="eyebrow">Unkillable score</p><div className="score-board-number mono">82</div><div className="score-board-delta">+7 over 30 days</div></div>
                <div style={{textAlign:"right"}}><p className="eyebrow">Consistency</p><strong className="mono" style={{fontSize:28}}>91%</strong></div>
              </div>
              <div className="radar-grid">
                <RadarChart />
                <div className="score-bars">
                  {pillars.map((pillar) => <div className="score-bar-row" key={pillar}><span>{pillarDefinitions[pillar].label}</span><Progress value={marketingScores[pillar].score}/><strong>{marketingScores[pillar].score}</strong></div>)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="how-it-works">
          <div className="container protocol-shell">
            <div className="protocol-intro"><p className="eyebrow">Daily protocol</p><h2 className="display">WIN THE DAY<br/>YOU ACTUALLY HAVE.</h2><p>Your protocol turns priorities into a short list of commitments. Complete them, reduce them when necessary, and keep moving.</p></div>
            <ProtocolDemo />
          </div>
        </section>

        <section className="section">
          <div className="container minimum-grid">
            <div className="minimum-copy"><p className="eyebrow">Minimum Day</p><h2 className="display">BAD DAY?<br/><span className="accent">SWITCH MODES.</span></h2><p>When life gets chaotic, Unkillable doesn&apos;t ask you to maintain the perfect routine. It reduces each commitment to the smallest version that preserves momentum.</p><p style={{color:"var(--text)"}}>The objective isn&apos;t perfection. It&apos;s staying in motion.</p></div>
            <MinimumDayDemo />
          </div>
        </section>

        <section className="section-tight">
          <div className="container never-miss">
            <div><p className="eyebrow">Recovery rule</p><h2 className="display">NEVER MISS<br/>TWICE.</h2><p>One bad day is life. Two can become a pattern. If you miss a commitment, Unkillable makes the next occurrence a recovery priority instead of turning one miss into a lost week.</p></div>
            <div>
              <div className="week-strip" aria-label="Monday complete, Tuesday complete, Wednesday missed, Thursday recovered, Friday complete">
                {[['MON','✓',''],['TUE','✓',''],['WED','×','miss'],['THU','✓','recovered'],['FRI','✓','']].map(([day,mark,state]) => <div className={`day-cell ${state}`} key={day}><div className="day">{day}</div><div className="mark">{mark}</div></div>)}
              </div>
              <p className="recovery-caption"><span className="accent">RECOVERED.</span> One miss. No spiral.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading"><div><p className="eyebrow">Analytics</p><h2 className="display">SEE WHO YOU&apos;RE<br/>BECOMING.</h2></div><p>Trend the system over 7, 30, 90, or 365 days. No shame loops. Just signal, recovery, and evidence.</p></div>
            <div className="analytics-frame">
              <div className="analytics-tabs" aria-label="30-day analytics preview"><span className="analytics-tab">7D</span><span className="analytics-tab active">30D</span><span className="analytics-tab">90D</span><span className="analytics-tab">365D</span></div>
              <div className="analytics-stats">
                <div className="analytics-stat"><strong className="mono">91%</strong><span>30-day consistency</span></div>
                <div className="analytics-stat"><strong className="mono">37</strong><span>day streak</span></div>
                <div className="analytics-stat"><strong className="mono">+12%</strong><span>resilience score</span></div>
                <div className="analytics-stat"><strong className="mono">5/6</strong><span>pillars improving</span></div>
              </div>
              <MarketingLineChart />
              <div className="heatmap" aria-label="Calendar heatmap showing imperfect consistency">
                {Array.from({length:104},(_,i) => <span className={`heat-cell l${[4,3,4,2,4,3,1,4,4,3,4,2,0][i%13] ?? 2}`} key={i}/>) }
              </div>
            </div>
          </div>
        </section>

        <section className="section-tight">
          <div className="container evidence-grid">
            <div><p className="eyebrow">Identity system</p><h2 className="display">CONFIDENCE<br/>IS EVIDENCE.</h2><p className="evidence-copy">You don&apos;t need to convince yourself you&apos;re disciplined. Build enough evidence that you no longer have to.</p></div>
            <div className="evidence-list">
              <div className="evidence-row"><strong className="mono">37</strong><span>workouts completed</span></div>
              <div className="evidence-row"><strong className="mono">24</strong><span>difficult days survived</span></div>
              <div className="evidence-row"><strong className="mono">18</strong><span>promises kept when motivation was low</span></div>
              <div className="evidence-row"><strong className="mono">12</strong><span>fast recoveries after missed days</span></div>
              <div className="evidence-row"><strong className="mono">93h</strong><span>of focused work</span></div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="review-card">
              <div className="review-head"><div><p className="eyebrow">Week 38</p><h2>YOU KEPT 91% OF YOUR COMMITMENTS.</h2></div><div className="review-grade mono">91</div></div>
              <div className="review-rows">
                <div className="review-row"><span>Strongest</span><strong>Discipline <span className="trend-positive">+8</span></strong></div>
                <div className="review-row"><span>Needs attention</span><strong>Recovery <span className="trend-negative">−6</span></strong></div>
                <div className="review-row"><span>You recovered from</span><strong>2 missed commitments</strong></div>
                <div className="review-row"><span>Best streak</span><strong>Deep Work — 17 days</strong></div>
                <div className="review-row"><span>Suggested focus</span><strong>Sleep before 23:00 four nights this week.</strong></div>
              </div>
              <div className="review-footer"><Link className="button button-primary" href="/app/review">Open weekly review →</Link></div>
            </div>
          </div>
        </section>

        <section className="section-tight">
          <div className="container">
            <div className="section-heading"><div><p className="eyebrow">Early product direction</p><h2 className="display">BUILT FOR REAL<br/>DISRUPTION.</h2></div><p>Sample testimonial content below illustrates the outcomes the product is designed around. Replace with verified customer stories before launch.</p></div>
            <div className="testimonial-grid">
              {testimonials.map((item) => <article className="card testimonial" key={item.quote}><span className="label">{item.outcome}</span><blockquote>“{item.quote}”</blockquote><cite>{item.person}</cite></article>)}
            </div>
            <p className="sample-note">Sample content — not customer endorsements.</p>
          </div>
        </section>

        <section className="section" id="pricing">
          <div className="container">
            <div className="section-heading"><div><p className="eyebrow">Simple pricing</p><h2 className="display">START SMALL.<br/>BUILD PROOF.</h2></div><p>Use the core system for free. Upgrade when you want deeper history, scoring, and analytics.</p></div>
            <div className="pricing-grid">
              <article className="card price-card"><div className="price-name">{pricing.free.name}</div><div className="price mono">{pricing.free.price}</div><div className="price-alt">{pricing.free.cadence}</div><ul className="feature-list">{pricing.free.features.map((f)=><li key={f}>{f}</li>)}</ul><Link className="button" href="/app">Try the demo →</Link></article>
              <article className="card price-card pro"><div className="price-name">{pricing.pro.name}</div><div className="price mono">{pricing.pro.monthly}<small>/month</small></div><div className="price-alt">or {pricing.pro.yearly}/year · <span className="accent">{pricing.pro.yearlyNote}</span></div><ul className="feature-list">{pricing.pro.features.map((f)=><li key={f}>{f}</li>)}</ul><Link className="button button-primary" href="/app/analytics">Explore Pro analytics →</Link></article>
            </div>
          </div>
        </section>

        <section className="final-cta section-tight">
          <div className="container final-cta-inner"><p className="eyebrow">Built for bad days</p><h2 className="display">LIFE DOESN&apos;T GET EASIER.<br/>YOU GET HARDER TO BREAK.</h2><Link className="button button-primary" href="/app">Open the product →</Link><p>Start free. Build one day at a time.</p></div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand"><div className="wordmark">UNKILLABLE<span className="wordmark-mark" /></div><p>Built for bad days.</p></div>
            <div className="footer-col"><h3>Product</h3><a href="#features">Features</a><a href="#method">Method</a><a href="#pricing">Pricing</a><Link href="/changelog">Changelog</Link></div>
            <div className="footer-col"><h3>Company</h3><Link href="/about">About</Link><a href="mailto:hello@unkillable.app">Contact</a></div>
            <div className="footer-col"><h3>Resources</h3><Link href="/manifesto">Manifesto</Link><Link href="/help">Help</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
          </div>
          <div className="footer-bottom"><span>UNKILLABLE.APP</span><span>Built for bad days.</span></div>
        </div>
      </footer>
    </>
  );
}
