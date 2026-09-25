"use client";

import { useEffect, useState } from "react";
import { useAppData } from "@/components/app/data-provider";
import { dayStats, isCompleted, scheduledHabits } from "@/lib/metrics";
import { pillarDefinitions } from "@/lib/config";
import { isHabitScheduled } from "@/data/seed";
import { shiftDate } from "@/lib/dates";
import { Progress } from "@/components/ui/primitives";
import { impactLight, successHaptic } from "@/lib/native";

export function TodayList({ date, compact = false }: { date: string; compact?: boolean }) {
  const { data, toggleCompletion } = useAppData();
  const habits = scheduledHabits(data, date);
  const stats = dayStats(data, date);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function previousOccurrence(habitId: string) {
    const habit = data.habits.find((item) => item.id === habitId);
    if (!habit) return null;
    for (let offset = 1; offset <= 8; offset++) {
      const candidate = shiftDate(date, -offset);
      if (candidate < habit.createdAt.slice(0, 10)) return null;
      if (isHabitScheduled(habit, candidate)) return candidate;
    }
    return null;
  }

  function toggle(id: string, title: string, wasDone: boolean) {
    const previous = previousOccurrence(id);
    const recovering = previous ? !isCompleted(data, id, previous) : false;
    toggleCompletion(id, date);
    if (wasDone) void impactLight();
    else void successHaptic();
    if (!wasDone) {
      const updatedCount = stats.complete + 1;
      if (recovering) setToast("RECOVERED. One miss. No spiral.");
      else if (updatedCount === habits.length && habits.length > 0 && data.minimumDays.includes(date)) setToast("STILL MOVING. Minimum Day kept.");
      else if (updatedCount === habits.length && habits.length > 0) setToast("DAY KEPT. Evidence added.");
      else setToast(`${title} complete.`);
    }
  }

  if (habits.length === 0) return <div className="empty-state"><h3>No commitments scheduled.</h3><p>This day has room. Weekly and weekday commitments appear automatically based on their frequency.</p></div>;

  return <>
    <div className="today-list">
      {habits.map((habit) => {
        const done = isCompleted(data, habit.id, date);
        const minimum = data.minimumDays.includes(date);
        const previous = previousOccurrence(habit.id);
        const recoveryPriority = !done && previous ? !isCompleted(data, habit.id, previous) : false;
        return <div className="today-row" key={habit.id}>
          <button className={`habit-check${done ? " done" : ""}`} onClick={() => toggle(habit.id,habit.title,done)} aria-label={`${done ? "Undo" : "Complete"} ${habit.title}`} aria-pressed={done}>{done ? "✓" : ""}</button>
          <div><h3 style={done ? {textDecoration:"line-through",textDecorationColor:"var(--muted-2)"} : undefined}>{habit.title}{recoveryPriority && <span className="accent" style={{fontSize:9,marginLeft:8,letterSpacing:".08em"}}>RECOVERY PRIORITY</span>}</h3><p>{minimum ? habit.minimumVersion : habit.target}</p></div>
          {!compact && <span className="pillar-chip">{pillarDefinitions[habit.pillar].label}</span>}
        </div>;
      })}
    </div>
    <div className="today-footer"><Progress value={stats.rate * 100} label={`${Math.round(stats.rate*100)}% of today's commitments complete`}/><span className="mono">{stats.complete} / {stats.scheduled}</span></div>
    {toast && <div className="toast" role="status"><strong>{toast.includes("DAY") ? "RECORDED." : "DONE."}</strong>{toast}</div>}
  </>;
}
