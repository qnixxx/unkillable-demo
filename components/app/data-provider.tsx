"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createSeedData } from "@/data/seed";
import { localStorageAdapter } from "@/lib/storage";
import { todayKey } from "@/lib/dates";
import type { AppData, Habit, Pillar, UserSettings } from "@/types";

interface NewHabitInput {
  title: string;
  description: string;
  pillar: Pillar;
  frequency: Habit["frequency"];
  target: string;
  minimumVersion: string;
}

interface AppDataContextValue {
  data: AppData;
  hydrated: boolean;
  toggleCompletion: (habitId: string, date?: string) => void;
  toggleMinimumDay: (date?: string) => void;
  addHabit: (input: NewHabitInput) => void;
  updateHabit: (id: string, input: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  completeOnboarding: (payload: { goals: string[]; disruptors: string[]; habits: NewHabitInput[] }) => void;
  resetDemo: () => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(() => createSeedData());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(localStorageAdapter.load());
    setHydrated(true);
  }, []);

  const commit = useCallback((updater: (current: AppData) => AppData) => {
    setData((current) => {
      const next = updater(current);
      localStorageAdapter.save(next);
      return next;
    });
  }, []);

  const toggleCompletion = useCallback((habitId: string, date = todayKey()) => {
    commit((current) => {
      const existing = current.completions.find(
        (item) => item.habitId === habitId && item.date === date && item.status === "complete",
      );
      const completions = existing
        ? current.completions.filter((item) => item.id !== existing.id)
        : [
            ...current.completions,
            { id: `completion-${date}-${habitId}-${Date.now()}`, habitId, date, status: "complete" as const },
          ];
      return { ...current, completions };
    });
  }, [commit]);

  const toggleMinimumDay = useCallback((date = todayKey()) => {
    commit((current) => ({
      ...current,
      minimumDays: current.minimumDays.includes(date)
        ? current.minimumDays.filter((item) => item !== date)
        : [...current.minimumDays, date],
    }));
  }, [commit]);

  const addHabit = useCallback((input: NewHabitInput) => {
    commit((current) => ({
      ...current,
      habits: [
        ...current.habits,
        {
          id: `habit-${Date.now()}`,
          ...input,
          active: true,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  }, [commit]);

  const updateHabit = useCallback((id: string, input: Partial<Habit>) => {
    commit((current) => ({
      ...current,
      habits: current.habits.map((habit) => (habit.id === id ? { ...habit, ...input } : habit)),
    }));
  }, [commit]);

  const deleteHabit = useCallback((id: string) => {
    commit((current) => ({
      ...current,
      habits: current.habits.filter((habit) => habit.id !== id),
      completions: current.completions.filter((completion) => completion.habitId !== id),
    }));
  }, [commit]);

  const updateSettings = useCallback((settings: Partial<UserSettings>) => {
    commit((current) => ({
      ...current,
      settings: { ...current.settings, ...settings },
    }));
  }, [commit]);

  const completeOnboarding = useCallback((payload: { goals: string[]; disruptors: string[]; habits: NewHabitInput[] }) => {
    commit((current) => ({
      ...current,
      user: { ...current.user, goals: payload.goals, disruptors: payload.disruptors, onboardingComplete: true },
      habits: payload.habits.map((habit, index) => ({
        id: `onboarding-habit-${Date.now()}-${index}`,
        ...habit,
        active: true,
        createdAt: new Date().toISOString(),
      })),
      completions: [],
      minimumDays: [],
    }));
  }, [commit]);

  const resetDemo = useCallback(() => setData(localStorageAdapter.reset()), []);

  const value = useMemo(() => ({
    data,
    hydrated,
    toggleCompletion,
    toggleMinimumDay,
    addHabit,
    updateHabit,
    deleteHabit,
    updateSettings,
    completeOnboarding,
    resetDemo,
  }), [data, hydrated, toggleCompletion, toggleMinimumDay, addHabit, updateHabit, deleteHabit, updateSettings, completeOnboarding, resetDemo]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error("useAppData must be used within AppDataProvider");
  return context;
}
