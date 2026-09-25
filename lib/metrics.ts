import type { AppData, Habit, Pillar, PillarScore } from "@/types";
import { isHabitScheduled } from "@/data/seed";
import { shiftDate, todayKey } from "@/lib/dates";
import { pillarDefinitions } from "@/lib/config";

export function scheduledHabits(data: AppData, key: string): Habit[] {
  return data.habits.filter((habit) => habit.active && habit.createdAt.slice(0, 10) <= key && isHabitScheduled(habit, key));
}

export function isCompleted(data: AppData, habitId: string, key: string): boolean {
  return data.completions.some(
    (completion) => completion.habitId === habitId && completion.date === key && completion.status === "complete",
  );
}

export function dayStats(data: AppData, key: string) {
  const scheduled = scheduledHabits(data, key);
  const complete = scheduled.filter((habit) => isCompleted(data, habit.id, key)).length;
  return {
    scheduled: scheduled.length,
    complete,
    rate: scheduled.length ? complete / scheduled.length : 0,
    minimumDay: data.minimumDays.includes(key),
  };
}

export function consistency(data: AppData, days = 30, end = todayKey()): number {
  let scheduled = 0;
  let complete = 0;
  for (let offset = 0; offset < days; offset++) {
    const key = shiftDate(end, -offset);
    const stats = dayStats(data, key);
    scheduled += stats.scheduled;
    complete += stats.complete;
  }
  return scheduled ? Math.round((complete / scheduled) * 100) : 0;
}

export function currentStreak(data: AppData, end = todayKey()): number {
  let streak = 0;
  for (let offset = 0; offset < 365; offset++) {
    const key = shiftDate(end, -offset);
    const stats = dayStats(data, key);
    const moving = stats.complete > 0 || stats.minimumDay;
    if (!moving) break;
    streak += 1;
  }
  return streak;
}

export function longestStreak(data: AppData, days = 365, end = todayKey()): number {
  let longest = 0;
  let running = 0;
  for (let offset = days - 1; offset >= 0; offset--) {
    const key = shiftDate(end, -offset);
    const stats = dayStats(data, key);
    if (stats.complete > 0 || stats.minimumDay) {
      running += 1;
      longest = Math.max(longest, running);
    } else {
      running = 0;
    }
  }
  return longest;
}

export function pillarScores(data: AppData, days = 30, end = todayKey()): PillarScore[] {
  const pillars = Object.keys(pillarDefinitions) as Pillar[];
  return pillars.map((pillar) => {
    let scheduled = 0;
    let complete = 0;
    for (let offset = 0; offset < days; offset++) {
      const key = shiftDate(end, -offset);
      const relevant = scheduledHabits(data, key).filter((habit) => habit.pillar === pillar);
      scheduled += relevant.length;
      complete += relevant.filter((habit) => isCompleted(data, habit.id, key)).length;
    }
    const base = scheduled ? (complete / scheduled) * 100 : 72;
    const previousEnd = shiftDate(end, -days);
    let prevScheduled = 0;
    let prevComplete = 0;
    for (let offset = 0; offset < days; offset++) {
      const key = shiftDate(previousEnd, -offset);
      const relevant = scheduledHabits(data, key).filter((habit) => habit.pillar === pillar);
      prevScheduled += relevant.length;
      prevComplete += relevant.filter((habit) => isCompleted(data, habit.id, key)).length;
    }
    const previous = prevScheduled ? (prevComplete / prevScheduled) * 100 : base;
    return {
      pillar,
      score: Math.round(base),
      trend: Math.round(base - previous),
    };
  });
}

export function resilienceScore(data: AppData, days = 30, end = todayKey()) {
  const scores = pillarScores(data, days, end);
  const avg = scores.reduce((sum, item) => sum + item.score, 0) / scores.length;
  const weakest = Math.min(...scores.map((item) => item.score));
  const activePillars = new Set(data.habits.filter((habit) => habit.active).map((habit) => habit.pillar)).size;
  const activityFactor = (activePillars / 6) * 7;
  const recoveryBonus = Math.min(6, data.minimumDays.filter((d) => d <= end && d >= shiftDate(end, -days + 1)).length * 0.4);
  // Product metric: consistency matters, but imbalance lowers the score and recovery behavior earns credit.
  return Math.max(0, Math.min(100, Math.round(avg * 0.6 + weakest * 0.25 + activityFactor + recoveryBonus)));
}

export function scoreTrend(data: AppData, days = 30) {
  const now = resilienceScore(data, days);
  const before = resilienceScore(data, days, shiftDate(todayKey(), -days));
  return now - before;
}

export function consistencySeries(data: AppData, days: number) {
  return Array.from({ length: days }, (_, index) => {
    const key = shiftDate(todayKey(), -(days - 1 - index));
    const stats = dayStats(data, key);
    return { date: key, value: Math.round(stats.rate * 100) };
  });
}

export function recoveryCount(data: AppData, days = 30) {
  let count = 0;
  for (let offset = 1; offset < days; offset++) {
    const missed = dayStats(data, shiftDate(todayKey(), -offset)).rate < 0.5;
    const recovered = dayStats(data, shiftDate(todayKey(), -offset + 1)).rate >= 0.6;
    if (missed && recovered) count += 1;
  }
  return count;
}
