"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { todayKey } from "@/lib/dates";
import type { AppData, Habit, HabitCompletion, Pillar, UserSettings } from "@/types";

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
  loadError: string | null;
  reload: () => Promise<void>;
  toggleCompletion: (habitId: string, date?: string) => Promise<void>;
  toggleMinimumDay: (date?: string) => Promise<void>;
  addHabit: (input: NewHabitInput) => Promise<void>;
  updateHabit: (id: string, input: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  completeOnboarding: (payload: { goals: string[]; disruptors: string[]; habits: NewHabitInput[] }) => Promise<void>;
}

const fallbackSettings: UserSettings = {
  weekStartsOn: "monday",
  reducedMotion: false,
  reminders: true,
  reminderTime: "20:30",
  displayName: "Member",
  timezone: "UTC",
};

const emptyData: AppData = {
  version: 1,
  user: {
    id: "",
    name: "Member",
    email: "",
    createdAt: new Date(0).toISOString(),
    onboardingComplete: false,
    goals: [],
    disruptors: [],
  },
  habits: [],
  completions: [],
  minimumDays: [],
  settings: fallbackSettings,
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

function messageOf(error: unknown) {
  return error instanceof Error ? error.message : "Unable to sync your data.";
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(emptyData);
  const [hydrated, setHydrated] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoadError(null);
    const supabase = createClient();

    const { data: userResult, error: userError } = await supabase.auth.getUser();
    const authUser = userResult.user;

    if (userError || !authUser) {
      setHydrated(true);
      setLoadError(userError?.message ?? "Your session has expired.");
      return;
    }

    const [profileResult, habitsResult, completionsResult, minimumDaysResult, settingsResult] =
      await Promise.all([
        supabase.from("profiles").select("*").maybeSingle(),
        supabase.from("habits").select("*").order("created_at", { ascending: true }),
        supabase.from("habit_completions").select("*").order("completion_date", { ascending: true }),
        supabase.from("minimum_days").select("*").order("day", { ascending: true }),
        supabase.from("user_settings").select("*").maybeSingle(),
      ]);

    const firstError = [
      profileResult.error,
      habitsResult.error,
      completionsResult.error,
      minimumDaysResult.error,
      settingsResult.error,
    ].find(Boolean);

    if (firstError) {
      setHydrated(true);
      setLoadError(firstError.message);
      return;
    }

    const defaultName =
      authUser.email?.split("@")[0] ||
      (typeof authUser.user_metadata?.name === "string" ? authUser.user_metadata.name : "Member");

    const profile = profileResult.data;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const settings = settingsResult.data;

    if (!profile) {
      await supabase.from("profiles").upsert({
        id: authUser.id,
        display_name: defaultName,
      });
    }

    if (!settings) {
      await supabase.from("user_settings").upsert({
        user_id: authUser.id,
        timezone,
      });
    }

    const appData: AppData = {
      version: 1,
      user: {
        id: authUser.id,
        name: profile?.display_name || defaultName,
        email: authUser.email ?? "",
        createdAt: authUser.created_at,
        onboardingComplete: profile?.onboarding_complete ?? false,
        goals: profile?.goals ?? [],
        disruptors: profile?.disruptors ?? [],
      },
      habits: (habitsResult.data ?? []).map((habit) => ({
        id: habit.id,
        title: habit.title,
        description: habit.description,
        pillar: habit.pillar as Pillar,
        frequency: habit.frequency as Habit["frequency"],
        target: habit.target,
        minimumVersion: habit.minimum_version,
        active: habit.active,
        createdAt: habit.created_at,
      })),
      completions: (completionsResult.data ?? []).map((completion) => ({
        id: completion.id,
        habitId: completion.habit_id,
        date: completion.completion_date,
        status: completion.status as HabitCompletion["status"],
        value: completion.value ?? undefined,
      })),
      minimumDays: (minimumDaysResult.data ?? []).map((item) => item.day),
      settings: {
        weekStartsOn: (settings?.week_starts_on as UserSettings["weekStartsOn"]) ?? "monday",
        reducedMotion: settings?.reduced_motion ?? false,
        reminders: settings?.reminders ?? true,
        reminderTime: settings?.reminder_time?.slice(0, 5) ?? "20:30",
        displayName: profile?.display_name || defaultName,
        timezone: settings?.timezone || timezone,
      },
    };

    setData(appData);
    setHydrated(true);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const toggleCompletion = useCallback(async (habitId: string, date = todayKey()) => {
    const supabase = createClient();
    const userId = data.user.id;
    if (!userId) return;

    const existing = data.completions.find(
      (item) => item.habitId === habitId && item.date === date && item.status === "complete",
    );

    if (existing) {
      setData((current) => ({
        ...current,
        completions: current.completions.filter((item) => item.id !== existing.id),
      }));
      const { error } = await supabase.from("habit_completions").delete().eq("id", existing.id);
      if (error) await reload();
      return;
    }

    const created: HabitCompletion = {
      id: crypto.randomUUID(),
      habitId,
      date,
      status: "complete",
    };

    setData((current) => ({ ...current, completions: [...current.completions, created] }));

    const { error } = await supabase.from("habit_completions").insert({
      id: created.id,
      user_id: userId,
      habit_id: habitId,
      completion_date: date,
      status: "complete",
    });

    if (error) await reload();
  }, [data.completions, data.user.id, reload]);

  const toggleMinimumDay = useCallback(async (date = todayKey()) => {
    const supabase = createClient();
    const userId = data.user.id;
    if (!userId) return;

    const active = data.minimumDays.includes(date);

    setData((current) => ({
      ...current,
      minimumDays: active
        ? current.minimumDays.filter((item) => item !== date)
        : [...current.minimumDays, date],
    }));

    const result = active
      ? await supabase.from("minimum_days").delete().eq("user_id", userId).eq("day", date)
      : await supabase.from("minimum_days").insert({ user_id: userId, day: date });

    if (result.error) await reload();
  }, [data.minimumDays, data.user.id, reload]);

  const addHabit = useCallback(async (input: NewHabitInput) => {
    const supabase = createClient();
    const userId = data.user.id;
    if (!userId) return;

    const habit: Habit = {
      id: crypto.randomUUID(),
      ...input,
      active: true,
      createdAt: new Date().toISOString(),
    };

    setData((current) => ({ ...current, habits: [...current.habits, habit] }));

    const { error } = await supabase.from("habits").insert({
      id: habit.id,
      user_id: userId,
      title: input.title,
      description: input.description,
      pillar: input.pillar,
      frequency: input.frequency,
      target: input.target,
      minimum_version: input.minimumVersion,
      active: true,
    });

    if (error) await reload();
  }, [data.user.id, reload]);

  const updateHabit = useCallback(async (id: string, input: Partial<Habit>) => {
    const supabase = createClient();

    setData((current) => ({
      ...current,
      habits: current.habits.map((habit) => (habit.id === id ? { ...habit, ...input } : habit)),
    }));

    const update: {
      title?: string;
      description?: string;
      pillar?: string;
      frequency?: string;
      target?: string;
      minimum_version?: string;
      active?: boolean;
      updated_at: string;
    } = { updated_at: new Date().toISOString() };

    if (input.title !== undefined) update.title = input.title;
    if (input.description !== undefined) update.description = input.description;
    if (input.pillar !== undefined) update.pillar = input.pillar;
    if (input.frequency !== undefined) update.frequency = input.frequency;
    if (input.target !== undefined) update.target = input.target;
    if (input.minimumVersion !== undefined) update.minimum_version = input.minimumVersion;
    if (input.active !== undefined) update.active = input.active;

    const { error } = await supabase.from("habits").update(update).eq("id", id);
    if (error) await reload();
  }, [reload]);

  const deleteHabit = useCallback(async (id: string) => {
    const supabase = createClient();

    setData((current) => ({
      ...current,
      habits: current.habits.filter((habit) => habit.id !== id),
      completions: current.completions.filter((completion) => completion.habitId !== id),
    }));

    const { error } = await supabase.from("habits").delete().eq("id", id);
    if (error) await reload();
  }, [reload]);

  const updateSettings = useCallback(async (settings: Partial<UserSettings>) => {
    const supabase = createClient();
    const userId = data.user.id;
    if (!userId) return;

    setData((current) => ({
      ...current,
      user: settings.displayName
        ? { ...current.user, name: settings.displayName }
        : current.user,
      settings: { ...current.settings, ...settings },
    }));

    if (settings.displayName !== undefined) {
      const { error } = await supabase.from("profiles").update({
        display_name: settings.displayName,
        updated_at: new Date().toISOString(),
      }).eq("id", userId);
      if (error) return void await reload();
    }

    const row: {
      user_id: string;
      week_starts_on?: string;
      reduced_motion?: boolean;
      reminders?: boolean;
      reminder_time?: string;
      timezone?: string;
      updated_at: string;
    } = {
      user_id: userId,
      updated_at: new Date().toISOString(),
    };

    if (settings.weekStartsOn !== undefined) row.week_starts_on = settings.weekStartsOn;
    if (settings.reducedMotion !== undefined) row.reduced_motion = settings.reducedMotion;
    if (settings.reminders !== undefined) row.reminders = settings.reminders;
    if (settings.reminderTime !== undefined) row.reminder_time = settings.reminderTime;
    if (settings.timezone !== undefined) row.timezone = settings.timezone;

    if (Object.keys(row).length > 2) {
      const { error } = await supabase.from("user_settings").upsert(row);
      if (error) await reload();
    }
  }, [data.user.id, reload]);

  const completeOnboarding = useCallback(async (payload: {
    goals: string[];
    disruptors: string[];
    habits: NewHabitInput[];
  }) => {
    const supabase = createClient();
    const { data: userResult, error: userError } = await supabase.auth.getUser();
    const authUser = userResult.user;
    if (userError || !authUser) throw new Error(userError?.message ?? "Your session has expired.");

    const displayName =
      data.settings.displayName ||
      authUser.email?.split("@")[0] ||
      "Member";

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: authUser.id,
      display_name: displayName,
      goals: payload.goals,
      disruptors: payload.disruptors,
      onboarding_complete: true,
      updated_at: new Date().toISOString(),
    });
    if (profileError) throw new Error(profileError.message);

    await supabase.from("habits").delete().eq("user_id", authUser.id);
    await supabase.from("minimum_days").delete().eq("user_id", authUser.id);

    if (payload.habits.length) {
      const { error: habitsError } = await supabase.from("habits").insert(
        payload.habits.map((habit) => ({
          user_id: authUser.id,
          title: habit.title,
          description: habit.description,
          pillar: habit.pillar,
          frequency: habit.frequency,
          target: habit.target,
          minimum_version: habit.minimumVersion,
          active: true,
        })),
      );
      if (habitsError) throw new Error(habitsError.message);
    }

    await reload();
  }, [data.settings.displayName, reload]);

  const value = useMemo(() => ({
    data,
    hydrated,
    loadError,
    reload,
    toggleCompletion,
    toggleMinimumDay,
    addHabit,
    updateHabit,
    deleteHabit,
    updateSettings,
    completeOnboarding,
  }), [
    data,
    hydrated,
    loadError,
    reload,
    toggleCompletion,
    toggleMinimumDay,
    addHabit,
    updateHabit,
    deleteHabit,
    updateSettings,
    completeOnboarding,
  ]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error("useAppData must be used within AppDataProvider");
  return context;
}
