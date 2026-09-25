"use client";

import { FormEvent, useState } from "react";
import { useAppData } from "@/components/app/data-provider";
import { Icon } from "@/components/ui/icons";
import { pillarDefinitions } from "@/lib/config";
import type { Habit, Pillar } from "@/types";

export function HabitModal({ habit, onClose }: { habit?: Habit; onClose: () => void }) {
  const { addHabit, updateHabit } = useAppData();
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const pillar = String(form.get("pillar") ?? "discipline") as Pillar;
    const frequency = String(form.get("frequency") ?? "daily") as Habit["frequency"];
    const target = String(form.get("target") ?? "").trim();
    const minimumVersion = String(form.get("minimumVersion") ?? "").trim();
    if (title.length < 2) return setError("Give this commitment a clear name.");
    if (!target) return setError("Add a measurable target or instruction.");
    if (!minimumVersion) return setError("Add a Minimum Day version so this habit can survive disruption.");
    const payload = { title, description, pillar, frequency, target, minimumVersion };
    if (habit) updateHabit(habit.id, payload); else addHabit(payload);
    onClose();
  }

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="habit-modal-title">
      <div className="modal-head"><h2 id="habit-modal-title">{habit ? "Edit commitment" : "New commitment"}</h2><button className="icon-button" onClick={onClose} aria-label="Close"><Icon name="x"/></button></div>
      <form className="form" onSubmit={submit} noValidate>
        <div className="field"><label htmlFor="habit-title">Title</label><input id="habit-title" name="title" defaultValue={habit?.title} placeholder="e.g. Walk 8,000 steps" autoFocus /></div>
        <div className="field"><label htmlFor="habit-description">Description</label><textarea id="habit-description" name="description" defaultValue={habit?.description} placeholder="Why this belongs in your system." /></div>
        <div className="form-grid">
          <div className="field"><label htmlFor="habit-pillar">Pillar</label><select id="habit-pillar" name="pillar" defaultValue={habit?.pillar ?? "discipline"}>{(Object.keys(pillarDefinitions) as Pillar[]).map((pillar) => <option value={pillar} key={pillar}>{pillarDefinitions[pillar].label}</option>)}</select></div>
          <div className="field"><label htmlFor="habit-frequency">Frequency</label><select id="habit-frequency" name="frequency" defaultValue={habit?.frequency ?? "daily"}><option value="daily">Daily</option><option value="weekdays">Weekdays</option><option value="weekends">Weekends</option><option value="weekly">Weekly · Sunday</option></select></div>
        </div>
        <div className="field"><label htmlFor="habit-target">Normal target</label><input id="habit-target" name="target" defaultValue={habit?.target} placeholder="e.g. 45 minutes" /></div>
        <div className="field"><label htmlFor="habit-minimum">Minimum Day version</label><input id="habit-minimum" name="minimumVersion" defaultValue={habit?.minimumVersion} placeholder="e.g. 20 push-ups" /><span className="field-help">Make it small enough to preserve motion on a genuinely difficult day.</span></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="modal-actions"><button className="button" type="button" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit">{habit ? "Save changes" : "Add commitment"}</button></div>
      </form>
    </div>
  </div>;
}
