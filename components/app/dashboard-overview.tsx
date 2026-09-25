"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppData } from "@/components/app/data-provider";
import { TodayList } from "@/components/app/today-list";
import { currentStreak, dayStats, pillarScores, resilienceScore, scoreTrend, consistency } from "@/lib/metrics";
import { todayKey } from "@/lib/dates";
import { pillarDefinitions } from "@/lib/config";
import { Progress } from "@/components/ui/primitives";
import { HabitModal } from "@/components/app/habit-modal";
import { impactLight } from "@/lib/native";

export function DashboardOverview() {
  const { data, toggleMinimumDay } = useAppData();
  const [habitModal, setHabitModal] = useState(false);
  const today = todayKey();
  const stats = dayStats(data, today);
  const score = resilienceScore(data);
  const trend = scoreTrend(data);
  const streak = currentStreak(data);
  const consistency30 = consistency(data, 30);
  const pillars = pillarScores(data);
  const minimum = data.minimumDays.includes(today);
  const recent = data.completions.filter((item) => item.status === "complete").slice(-4).reverse().map((item) => ({
    ...item,
    habit: data.habits.find((habit) => habit.id === item.habitId),
  }));

  return <>
    <div className="page-head">
      <div><p className="eyebrow">Day {streak}</p><h1>Stay in motion.</h1><p>Your system does not need a perfect day. It needs the next kept commitment.</p></div>
      <div className="page-actions"><button className="button button-primary" onClick={() => setHabitModal(true)}>+ <span>New commitment</span></button></div>
    </div>

    <section className="kpi-grid" aria-label="Current metrics">
      <div className="card kpi kpi-score"><div><span className="kpi-label">Unkillable score</span><strong className="mono">{score}</strong><div className="kpi-note">{trend >= 0 ? "↑" : "↓"} {Math.abs(trend)} over 30 days</div></div><div style={{width:100,maxWidth:130}}><Progress value={score}/></div></div>
      <div className="card kpi"><span className="kpi-label">Today</span><strong className="mono">{stats.complete}/{stats.scheduled}</strong><div className="kpi-note">commitments kept</div></div>
      <div className="card kpi"><span className="kpi-label">Current streak</span><strong className="mono">{streak}</strong><div className="kpi-note">days in motion</div></div>
      <div className="card kpi"><span className="kpi-label">Consistency</span><strong className="mono">{consistency30}%</strong><div className="kpi-note">last 30 days</div></div>
    </section>

    <div className="dashboard-grid">
      <div className="dashboard-stack">
        <section className="card" aria-labelledby="today-heading"><div className="panel-head"><h2 id="today-heading">Today&apos;s protocol</h2><Link href="/app/today">Open day →</Link></div><TodayList date={today}/></section>
        <section className="card" aria-labelledby="pillars-heading"><div className="panel-head"><h2 id="pillars-heading">Six pillars</h2><Link href="/app/pillars">View detail →</Link></div><div className="pillar-mini-list">{pillars.map((item) => <div className="pillar-mini" key={item.pillar}><span>{pillarDefinitions[item.pillar].label}</span><Progress value={item.score}/><strong>{item.score}</strong></div>)}</div></section>
      </div>
      <div className="dashboard-stack">
        <button className={`minimum-button${minimum ? " active" : ""}`} onClick={() => { toggleMinimumDay(today); void impactLight(); }} aria-pressed={minimum}><div><h3>{minimum ? "Minimum Day active" : "Bad day? Switch modes."}</h3><p>{minimum ? "Smaller dose. Same identity." : "Reduce today to the version you can keep."}</p></div><span className="minimum-badge">{minimum ? "STILL MOVING" : "MINIMUM DAY →"}</span></button>
        <section className="card" aria-labelledby="recent-heading"><div className="panel-head"><h2 id="recent-heading">Recent progress</h2><span>Evidence</span></div><div className="activity-list">{recent.map((item) => <div className="activity-row" key={item.id}><span className="activity-dot"/><span>{item.habit?.title ?? "Commitment"} kept</span><time>{item.date === today ? "today" : item.date.slice(5)}</time></div>)}</div></section>
        <section className="card card-pad"><p className="eyebrow">Recovery principle</p><h2 style={{fontSize:22,margin:"0 0 10px",letterSpacing:"-.035em"}}>One miss is data.<br/>Two can become a pattern.</h2><p className="muted" style={{fontSize:12,lineHeight:1.55,margin:0}}>Missed yesterday? Win today. The system rewards how quickly you return, not the fiction of never failing.</p></section>
      </div>
    </div>
    {habitModal && <HabitModal onClose={() => setHabitModal(false)}/>} 
  </>;
}
