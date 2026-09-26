export type Pillar = "body" | "mind" | "discipline" | "recovery" | "relationships" | "purpose";
export type Frequency = "daily" | "weekdays" | "weekends" | "weekly";
export type CompletionStatus = "complete" | "missed" | "skipped";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  onboardingComplete: boolean;
  goals: string[];
  disruptors: string[];
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  pillar: Pillar;
  frequency: Frequency;
  target: string;
  minimumVersion: string;
  active: boolean;
  createdAt: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string;
  status: CompletionStatus;
  value?: number;
}

export interface DailyProtocol {
  date: string;
  habits: string[];
  completionRate: number;
  minimumDayActivated: boolean;
}

export interface PillarScore {
  pillar: Pillar;
  score: number;
  trend: number;
}

export interface ResilienceScore {
  score: number;
  date: string;
  components: Record<Pillar, number>;
}

export interface WeeklyReview {
  date: string;
  consistency: number;
  strongestPillar: Pillar;
  weakestPillar: Pillar;
  wins: string[];
  focus: string;
}

export interface UserSettings {
  weekStartsOn: "monday" | "sunday";
  reducedMotion: boolean;
  reminders: boolean;
  reminderTime: string;
  displayName: string;
  timezone: string;
}

export interface AppData {
  version: number;
  user: User;
  habits: Habit[];
  completions: HabitCompletion[];
  minimumDays: string[];
  settings: UserSettings;
}
