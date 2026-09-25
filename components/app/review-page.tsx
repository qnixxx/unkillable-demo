"use client";

import Link from "next/link";
import { useAppData } from "@/components/app/data-provider";
import { consistency, pillarScores, recoveryCount } from "@/lib/metrics";
import { pillarDefinitions } from "@/lib/config";

export function ReviewPage() {
  const { data } = useAppData();
  const weekly = consistency(data,7);
  const scores = pillarScores(data,7);
  const strongest = [...scores].sort((a,b)=>b.score-a.score)[0];
  const weakest = [...scores].sort((a,b)=>a.score-b.score)[0];
  const recoveries = recoveryCount(data,14);
  const deepWork = data.habits.find(h=>h.title.toLowerCase().includes("deep work"));
  const keptDeepWork = deepWork ? data.completions.filter(c=>c.habitId===deepWork.id && c.status==="complete").length : 0;
  const focus = weakest?.pillar === "recovery" ? "Protect your shutdown: complete the Recovery commitment four nights this week." : `Give ${pillarDefinitions[weakest.pillar].label.toLowerCase()} one deliberate win before adding more load.`;

  return <>
    <div className="page-head"><div><p className="eyebrow">Weekly review</p><h1>Make the pattern visible.</h1><p>Keep what worked. Repair what drifted. Build the next week without overcorrecting.</p></div></div>
    <div className="review-app">
      <section className="card review-main">
        <div className="review-score-line"><div><p className="eyebrow">This week</p><strong className="mono">{weekly}%</strong></div><p>You kept {weekly}% of scheduled commitments. The review weights recovery and return, not just uninterrupted streaks.</p></div>
        <div className="review-detail-list">
          <div className="review-detail-row"><span>Strongest</span><strong>{pillarDefinitions[strongest.pillar].label} <span className={strongest.trend>=0?"trend-positive":"trend-negative"}>{strongest.trend>=0?"+":""}{strongest.trend}</span></strong></div>
          <div className="review-detail-row"><span>Needs attention</span><strong>{pillarDefinitions[weakest.pillar].label} <span className={weakest.trend>=0?"trend-positive":"trend-negative"}>{weakest.trend>=0?"+":""}{weakest.trend}</span></strong></div>
          <div className="review-detail-row"><span>Fast recoveries</span><strong>{recoveries} after difficult days</strong></div>
          <div className="review-detail-row"><span>Evidence</span><strong>{data.completions.filter(c=>c.status==="complete").length} commitments kept</strong></div>
          <div className="review-detail-row"><span>Deep Work proof</span><strong>{keptDeepWork} completions logged</strong></div>
        </div>
      </section>
      <aside className="card review-focus"><p className="eyebrow">Suggested focus</p><h2 style={{fontSize:24,margin:"0 0 8px",letterSpacing:"-.04em"}}>Next week: repair the weakest link.</h2><p>{focus}</p><Link className="button button-primary button-block" href="/app/today">Build next week →</Link></aside>
    </div>
  </>;
}
