"use client";

import { useAppData } from "@/components/app/data-provider";
import { pillarScores } from "@/lib/metrics";
import { pillarDefinitions } from "@/lib/config";
import { Progress } from "@/components/ui/primitives";

export function PillarsPage() {
  const { data } = useAppData();
  const scores = pillarScores(data);
  return <>
    <div className="page-head"><div><p className="eyebrow">Six-pillar system</p><h1>Resilience is balance.</h1><p>Strengthen the system without letting one area quietly collapse.</p></div></div>
    <div className="pillars-app-grid">
      {scores.map((item) => {
        const def = pillarDefinitions[item.pillar];
        const habits = data.habits.filter((habit) => habit.active && habit.pillar === item.pillar);
        return <article className="card pillar-app-card" key={item.pillar}>
          <div className="pillar-app-card-head"><div><h2>{def.label}</h2><p style={{marginTop:8}}>{def.description}</p></div><span className={item.trend >= 0 ? "trend-positive" : "trend-negative"}>{item.trend >= 0 ? "↑" : "↓"} {Math.abs(item.trend)}</span></div>
          <div className="score mono">{item.score}<small style={{fontSize:12,color:"var(--muted)"}}> / 100</small></div>
          <p>{habits.length ? habits.map((habit) => habit.title).join(" · ") : "No active commitment in this pillar yet."}</p>
          <Progress value={item.score} label={`${def.label} score ${item.score}`} />
        </article>;
      })}
    </div>
  </>;
}
