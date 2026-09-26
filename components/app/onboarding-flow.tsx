"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppDataProvider, useAppData } from "@/components/app/data-provider";
import { pillarDefinitions } from "@/lib/config";
import type { Habit, Pillar } from "@/types";
import { successHaptic } from "@/lib/native";

const goals = ["Physical health", "Discipline", "Focus", "Stress", "Relationships", "Work", "Confidence", "Life in general"];
const disruptors = ["Lack of motivation", "Stress", "Bad sleep", "Work", "Travel", "Weekends", "Missing one day", "Trying to do too much"];

const foundations: Array<{
  title: string; description: string; pillar: Pillar; frequency: Habit["frequency"]; target: string; minimumVersion: string;
}> = [
  { title: "Strength training", description: "Build physical capacity.", pillar: "body", frequency: "daily", target: "45 minutes", minimumVersion: "20 push-ups" },
  { title: "Deep work", description: "Protect meaningful focus.", pillar: "discipline", frequency: "daily", target: "90 minutes", minimumVersion: "Work for 15 minutes" },
  { title: "Read", description: "Keep learning under pressure.", pillar: "mind", frequency: "daily", target: "20 pages", minimumVersion: "Read 2 pages" },
  { title: "Recovery", description: "Create a clean shutdown.", pillar: "recovery", frequency: "daily", target: "No screens after 22:30", minimumVersion: "Phone away for 10 minutes" },
  { title: "Call family", description: "Maintain important people.", pillar: "relationships", frequency: "weekends", target: "One real conversation", minimumVersion: "Send a voice note" },
  { title: "Move the key project", description: "Advance work that matters.", pillar: "purpose", frequency: "weekdays", target: "One meaningful step", minimumVersion: "Define the next action" },
];

function ToggleChoice({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return <button type="button" className={`choice${selected ? " selected" : ""}`} aria-pressed={selected} onClick={onClick}>{label}</button>;
}

function Flow() {
  const router = useRouter();
  const { completeOnboarding } = useAppData();
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["Discipline", "Focus"]);
  const [selectedDisruptors, setSelectedDisruptors] = useState<string[]>(["Stress", "Missing one day"]);
  const [selectedHabits, setSelectedHabits] = useState<string[]>(foundations.slice(0, 5).map((item) => item.title));
  const [minimums, setMinimums] = useState<Record<string, string>>(() => Object.fromEntries(foundations.map((item) => [item.title, item.minimumVersion])));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const chosen = useMemo(() => foundations.filter((habit) => selectedHabits.includes(habit.title)), [selectedHabits]);
  const canContinue = step === 1 ? selectedGoals.length > 0 : step === 2 ? selectedDisruptors.length > 0 : step === 3 ? selectedHabits.length > 0 : true;

  function toggle(list: string[], setList: (value: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  async function finish() {
    setSaving(true);
    setError("");
    try {
      await completeOnboarding({
        goals: selectedGoals,
        disruptors: selectedDisruptors,
        habits: chosen.map((habit) => ({ ...habit, minimumVersion: minimums[habit.title] || habit.minimumVersion })),
      });
      void successHaptic();
      router.push("/app");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to save your system.");
    } finally {
      setSaving(false);
    }
  }

  return <main id="main-content" className="onboarding-shell">
    <header className="onboarding-top"><div className="wordmark">UNKILLABLE<span className="wordmark-mark" /></div><span className="step-count">SYSTEM SETUP / {step} OF 5</span></header>
    <section className="onboarding-main">
      <div className="onboarding-progress" aria-label={`Step ${step} of 5`}>{[1,2,3,4,5].map((item) => <span className={item <= step ? "active" : ""} key={item}/>)}</div>
      {step === 1 && <>
        <p className="eyebrow">01 / Direction</p><h1>What are you trying to become harder to break in?</h1><p className="lead">Choose what matters now. This changes how the system frames your starting commitments.</p>
        <div className="choice-grid">{goals.map((goal) => <ToggleChoice key={goal} label={goal} selected={selectedGoals.includes(goal)} onClick={() => toggle(selectedGoals, setSelectedGoals, goal)} />)}</div>
      </>}
      {step === 2 && <>
        <p className="eyebrow">02 / Pressure</p><h1>What tends to knock you off track?</h1><p className="lead">The system should be designed around your actual failure modes, not an ideal week.</p>
        <div className="choice-grid">{disruptors.map((item) => <ToggleChoice key={item} label={item} selected={selectedDisruptors.includes(item)} onClick={() => toggle(selectedDisruptors, setSelectedDisruptors, item)} />)}</div>
      </>}
      {step === 3 && <>
        <p className="eyebrow">03 / Foundation</p><h1>Choose foundational commitments.</h1><p className="lead">Start with a small system you can keep. You can change everything later.</p>
        <div className="foundation-list">{foundations.map((habit) => <label className="foundation" key={habit.title}><span className="foundation-glyph">{pillarDefinitions[habit.pillar].glyph}</span><span><h3>{habit.title}</h3><p>{pillarDefinitions[habit.pillar].label} · {habit.target}</p></span><input type="checkbox" checked={selectedHabits.includes(habit.title)} onChange={() => toggle(selectedHabits, setSelectedHabits, habit.title)} aria-label={`Choose ${habit.title}`}/></label>)}</div>
      </>}
      {step === 4 && <>
        <p className="eyebrow">04 / Minimum Day</p><h1>Build the version that survives chaos.</h1><p className="lead">Reduce each commitment until it feels almost too easy to skip. This is your bad-day protocol.</p>
        <div className="minimum-builder">{chosen.map((habit) => <div className="minimum-builder-row" key={habit.title}><div><label>Normal</label><input value={`${habit.title} — ${habit.target}`} readOnly /></div><div><label>Minimum version</label><input value={minimums[habit.title]} onChange={(e) => setMinimums((current) => ({...current,[habit.title]:e.target.value}))} /></div></div>)}</div>
      </>}
      {step === 5 && <>
        <p className="eyebrow">05 / Ready</p><h1>YOUR SYSTEM IS READY.</h1><p className="lead">You do not need a perfect week. You need a system you can return to.</p>
        <div className="ready-card"><h2>Start with proof, not pressure.</h2><div className="ready-stat-grid"><div className="ready-stat"><strong>{chosen.length}</strong><span>active commitments</span></div><div className="ready-stat"><strong>6</strong><span>resilience pillars</span></div><div className="ready-stat"><strong>1</strong><span>Minimum Day protocol</span></div></div></div>
        {error && <p className="form-error" role="alert">{error}</p>}
      </>}
      <div className="onboarding-actions">
        <button className="button" type="button" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1 || saving}>Back</button>
        {step < 5
          ? <button className="button button-primary" type="button" onClick={() => setStep((current) => Math.min(5, current + 1))} disabled={!canContinue || saving}>Continue →</button>
          : <button className="button button-primary" type="button" onClick={() => void finish()} disabled={saving}>{saving ? "Saving…" : "Start Day 1 →"}</button>}
      </div>
    </section>
  </main>;
}

export function OnboardingFlow() {
  return <AppDataProvider><Flow /></AppDataProvider>;
}
