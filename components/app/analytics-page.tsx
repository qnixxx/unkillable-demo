"use client";

import { useMemo, useState } from "react";
import { useAppData } from "@/components/app/data-provider";
import { consistency, consistencySeries, currentStreak, longestStreak, pillarScores, recoveryCount, resilienceScore, scoreTrend } from "@/lib/metrics";
import { shiftDate, todayKey } from "@/lib/dates";
import { pillarDefinitions } from "@/lib/config";
import { LineChart } from "@/components/app/app-charts";
import { Progress } from "@/components/ui/primitives";

const ranges = [7,30,90,365] as const;

export function AnalyticsPage() {
  const { data } = useAppData();
  const [range,setRange] = useState<(typeof ranges)[number]>(30);
  const series = useMemo(() => consistencySeries(data,range),[data,range]);
  const score = resilienceScore(data,Math.min(range,90));
  const consistencyValue = consistency(data,range);
  const streak = currentStreak(data);
  const longest = longestStreak(data,365);
  const recoveries = recoveryCount(data,Math.min(range,90));
  const trend = scoreTrend(data,30);
  const pillars = pillarScores(data,Math.min(range,90));
  const labels = series.map((item)=>item.date.slice(5));
  const heatDays = Array.from({length:Math.min(range,126)},(_,i)=>shiftDate(todayKey(),-(Math.min(range,126)-1-i)));

  return <>
    <div className="page-head"><div><p className="eyebrow">Analytics</p><h1>See who you’re becoming.</h1><p>Look for durable direction, not a flawless line.</p></div><div className="range-tabs" aria-label="Analytics range">{ranges.map((days)=><button key={days} className={`range-tab${range===days?" active":""}`} onClick={()=>setRange(days)}>{days===365?"1Y":`${days}D`}</button>)}</div></div>
    <div className="kpi-grid">
      <div className="card kpi kpi-score"><div><span className="kpi-label">Unkillable score</span><strong className="mono">{score}</strong><div className="kpi-note">{trend>=0?"↑":"↓"} {Math.abs(trend)} over 30 days</div></div><div style={{width:100,maxWidth:130}}><Progress value={score}/></div></div>
      <div className="card kpi"><span className="kpi-label">Consistency</span><strong className="mono">{consistencyValue}%</strong><div className="kpi-note">selected range</div></div>
      <div className="card kpi"><span className="kpi-label">Current streak</span><strong className="mono">{streak}</strong><div className="kpi-note">days in motion</div></div>
      <div className="card kpi"><span className="kpi-label">Fast recoveries</span><strong className="mono">{recoveries}</strong><div className="kpi-note">after difficult days</div></div>
    </div>
    <div className="analytics-app-grid">
      <section className="card analytics-chart-card"><div className="panel-head" style={{padding:0,paddingBottom:16,borderBottom:"1px solid var(--line)"}}><h2>Daily consistency</h2><span>{range} days</span></div><LineChart values={series.map(item=>item.value)} labels={labels} ariaLabel={`Daily consistency over ${range} days, current period average ${consistencyValue}%`}/><div className="heatmap-app" aria-label="Completion heatmap">{heatDays.map((key)=>{ const item=series.find(s=>s.date===key); const v=item?.value??0; const level=v>=90?4:v>=70?3:v>=45?2:v>0?1:0; return <span key={key} className={`heat-cell${level?` l${level}`:""}`} title={`${key}: ${v}%`}/>; })}</div></section>
      <aside className="analytics-side">
        <section className="card stat-list-card"><div className="stat-list-row"><span>Longest streak</span><strong>{longest} days</strong></div><div className="stat-list-row"><span>30-day score change</span><strong className={trend>=0?"trend-positive":"trend-negative"}>{trend>=0?"+":""}{trend}</strong></div><div className="stat-list-row"><span>Minimum Days used</span><strong>{data.minimumDays.length}</strong></div><div className="stat-list-row"><span>Tracked commitments</span><strong>{data.habits.filter(h=>h.active).length}</strong></div></section>
        <section className="card card-pad"><p className="eyebrow">Pillar trends</p><div style={{display:"grid",gap:14}}>{pillars.map((item)=><div className="pillar-mini" key={item.pillar}><span>{pillarDefinitions[item.pillar].label}</span><Progress value={item.score}/><strong>{item.score}</strong></div>)}</div></section>
      </aside>
    </div>
  </>;
}
