"use client";

import { useState } from "react";
import { useAppData } from "@/components/app/data-provider";
import { TodayList } from "@/components/app/today-list";
import { HabitModal } from "@/components/app/habit-modal";
import { Icon } from "@/components/ui/icons";
import { displayDate, shiftDate, todayKey } from "@/lib/dates";
import { dayStats } from "@/lib/metrics";
import { pillarDefinitions } from "@/lib/config";
import type { Habit } from "@/types";
import { impactLight } from "@/lib/native";

export function TodayPage() {
  const { data, toggleMinimumDay, deleteHabit } = useAppData();
  const [date, setDate] = useState(todayKey());
  const [modal, setModal] = useState<{ habit?: Habit } | null>(null);
  const stats = dayStats(data, date);
  const minimum = data.minimumDays.includes(date);
  const isToday = date === todayKey();

  function remove(habit: Habit) {
    if (window.confirm(`Delete “${habit.title}”? Its completion history will also be removed.`)) deleteHabit(habit.id);
  }

  return <>
    <div className="page-head">
      <div><p className="eyebrow">Daily protocol</p><h1>{isToday ? "Today" : displayDate(date,{weekday:"long",month:"long",day:"numeric"})}</h1><p>Complete the day you actually have. Reduce the dose before you abandon the system.</p></div>
      <div className="page-actions"><button className="button button-primary" onClick={() => setModal({})}>+ <span>New commitment</span></button></div>
    </div>

    <div className="card day-header-card">
      <div><div className="date-nav"><button onClick={() => setDate((current) => shiftDate(current,-1))} aria-label="Previous day"><Icon name="chevronLeft"/></button><button onClick={() => setDate(todayKey())} disabled={isToday} style={{width:"auto",padding:"0 12px"}}>Today</button><button onClick={() => setDate((current) => shiftDate(current,1))} disabled={date >= todayKey()} aria-label="Next day"><Icon name="chevronRight"/></button></div><p style={{marginTop:12}}>{displayDate(date,{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p></div>
      <div className="day-score mono">{stats.complete}/{stats.scheduled}<small> kept</small></div>
    </div>

    <section className="card" aria-labelledby="protocol-title">
      <div className="panel-head"><h2 id="protocol-title">Protocol</h2><button className={`button button-sm${minimum ? " button-primary" : ""}`} onClick={() => { toggleMinimumDay(date); void impactLight(); }}>{minimum ? "Minimum Day active" : "Activate Minimum Day"}</button></div>
      <TodayList date={date}/>
    </section>

    <div className="habits-toolbar"><div><p className="eyebrow" style={{marginBottom:5}}>System</p><h2>Active commitments</h2></div><span className="muted" style={{fontSize:11}}>{data.habits.filter(h=>h.active).length} active</span></div>
    <section className="card habit-table" aria-label="Habit management">
      <div className="habit-table-row habit-table-head"><span>Commitment</span><span>Pillar</span><span>Frequency</span><span>Minimum Day</span><span>Actions</span></div>
      {data.habits.length === 0 ? <div className="empty-state"><h3>No commitments yet.</h3><p>Add one useful promise and make the Minimum Day version small enough to keep.</p><button className="button button-primary" onClick={() => setModal({})}>Add your first commitment</button></div> : data.habits.map((habit) => <div className="habit-table-row" key={habit.id}>
        <div className="habit-title"><strong>{habit.title}</strong><span>{habit.target}</span></div>
        <span className="pillar-chip">{pillarDefinitions[habit.pillar].label}</span>
        <span className="muted" style={{fontSize:11,textTransform:"capitalize"}}>{habit.frequency}</span>
        <span className="muted" style={{fontSize:11}}>{habit.minimumVersion}</span>
        <div className="row-actions"><button className="icon-button" onClick={() => setModal({habit})} aria-label={`Edit ${habit.title}`}><Icon name="edit"/></button><button className="icon-button button-danger" onClick={() => remove(habit)} aria-label={`Delete ${habit.title}`}><Icon name="trash"/></button></div>
      </div>)}
    </section>
    {modal && <HabitModal habit={modal.habit} onClose={() => setModal(null)}/>} 
  </>;
}
