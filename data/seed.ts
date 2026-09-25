import type { AppData, Habit, HabitCompletion, Pillar } from "@/types";
import { shiftDate, todayKey } from "@/lib/dates";

const habits: Habit[] = [
  {
    id: "habit-strength",
    title: "Strength training",
    description: "Build physical capacity without negotiating with your mood.",
    pillar: "body",
    frequency: "daily",
    target: "45 minutes",
    minimumVersion: "20 push-ups",
    active: true,
    createdAt: "2026-06-01T08:00:00.000Z",
  },
  {
    id: "habit-deep-work",
    title: "Deep work",
    description: "Protect one meaningful block for work that matters.",
    pillar: "discipline",
    frequency: "daily",
    target: "90 minutes",
    minimumVersion: "Work for 15 minutes",
    active: true,
    createdAt: "2026-06-01T08:01:00.000Z",
  },
  {
    id: "habit-read",
    title: "Read",
    description: "Keep learning even when the day gets noisy.",
    pillar: "mind",
    frequency: "daily",
    target: "20 pages",
    minimumVersion: "Read 2 pages",
    active: true,
    createdAt: "2026-06-01T08:02:00.000Z",
  },
  {
    id: "habit-recovery",
    title: "Recovery",
    description: "Create a clean shutdown so tomorrow is not borrowed from tonight.",
    pillar: "recovery",
    frequency: "daily",
    target: "No screens after 22:30",
    minimumVersion: "Put the phone away for 10 minutes",
    active: true,
    createdAt: "2026-06-01T08:03:00.000Z",
  },
  {
    id: "habit-family",
    title: "Call family",
    description: "Keep important relationships alive on purpose.",
    pillar: "relationships",
    frequency: "weekends",
    target: "One real conversation",
    minimumVersion: "Send a thoughtful voice note",
    active: true,
    createdAt: "2026-06-01T08:04:00.000Z",
  },
  {
    id: "habit-purpose",
    title: "Move the key project",
    description: "Advance the work that matters beyond the urgent.",
    pillar: "purpose",
    frequency: "weekdays",
    target: "One meaningful step",
    minimumVersion: "Define the next action",
    active: true,
    createdAt: "2026-06-01T08:05:00.000Z",
  },
  {
    id: "habit-walk",
    title: "Walk 8,000 steps",
    description: "Low-friction movement for energy and recovery.",
    pillar: "body",
    frequency: "weekly",
    target: "8,000 steps",
    minimumVersion: "Walk for 10 minutes",
    active: true,
    createdAt: "2026-06-01T08:06:00.000Z",
  },
];

export function isHabitScheduled(habit: Habit, key: string): boolean {
  const date = new Date(`${key}T12:00:00`);
  const day = date.getDay();
  if (habit.frequency === "daily") return true;
  if (habit.frequency === "weekdays") return day >= 1 && day <= 5;
  if (habit.frequency === "weekends") return day === 0 || day === 6;
  return day === 0;
}

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

const rates: Record<Pillar, number> = {
  body: 0.96,
  mind: 0.90,
  discipline: 0.98,
  recovery: 0.79,
  relationships: 0.95,
  purpose: 0.95,
};

function buildCompletions(today: string): HabitCompletion[] {
  const completions: HabitCompletion[] = [];
  for (let offset = 0; offset < 94; offset++) {
    const key = shiftDate(today, -offset);
    if (offset === 37) continue;
    for (const habit of habits) {
      if (!isHabitScheduled(habit, key)) continue;
      let complete = hash(`${key}:${habit.id}`) < rates[habit.pillar];
      if (offset < 37 && !complete) {
        const anyMovement = habits.some(
          (h) => isHabitScheduled(h, key) && hash(`${key}:${h.id}`) < rates[h.pillar],
        );
        if (!anyMovement && habit.id === "habit-deep-work") complete = true;
      }
      if (offset === 0) {
        complete = ["habit-strength", "habit-deep-work", "habit-read", "habit-family"].includes(habit.id);
      }
      if (complete) {
        completions.push({
          id: `completion-${key}-${habit.id}`,
          habitId: habit.id,
          date: key,
          status: "complete",
        });
      }
    }
  }
  return completions;
}

export function createSeedData(): AppData {
  const today = todayKey();
  return {
    version: 1,
    user: {
      id: "demo-user",
      name: "Alex",
      email: "alex@example.com",
      createdAt: "2026-06-01T08:00:00.000Z",
      onboardingComplete: true,
      goals: ["Discipline", "Focus", "Life in general"],
      disruptors: ["Stress", "Bad sleep", "Missing one day"],
    },
    habits,
    completions: buildCompletions(today),
    minimumDays: [shiftDate(today, -9), shiftDate(today, -22), shiftDate(today, -31)],
    settings: {
      weekStartsOn: "monday",
      reducedMotion: false,
      reminders: true,
      reminderTime: "20:30",
      displayName: "Alex",
    },
  };
}
