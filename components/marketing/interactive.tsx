"use client";

import { useState } from "react";
import Link from "next/link";
import { Progress } from "@/components/ui/primitives";

const protocol = [
  ["Train", "45 minutes"],
  ["Deep Work", "90 minutes"],
  ["Read", "20 pages"],
  ["Recovery", "No screens after 22:30"],
  ["Relationships", "Call someone you care about"],
] as const;

export function LiveHeroDashboard() {
  return (
    <div className="hero-panel" aria-label="Preview of the Unkillable dashboard">
      <div className="hero-dashboard">
        <div className="demo-topbar"><span className="pulse-dot" /> Live system / Day 37</div>
        <div className="demo-layout">
          <div className="demo-score">
            <p className="eyebrow">Resilience score</p>
            <div className="score-number mono">82</div>
            <div className="score-delta">↑ 7 over 30 days</div>
            <div className="ring-wrap">
              <div className="ring" aria-label="82 out of 100"><span>82</span></div>
              <div className="ring-meta">
                <div><span>Current streak</span><strong>37 days</strong></div>
                <div><span>Consistency</span><strong>91%</strong></div>
                <div><span>Recovery</span><strong>Balanced</strong></div>
              </div>
            </div>
          </div>
          <div className="demo-today">
            <p className="eyebrow">Today / 4 of 5</p>
            <div className="demo-list">
              {[
                ["Train", true], ["Deep work", true], ["Read", true], ["Recovery", false], ["Call family", true],
              ].map(([label, done]) => (
                <div className="demo-task" key={String(label)}>
                  <span className={`demo-check${done ? " done" : ""}`}>{done ? "✓" : ""}</span>
                  <span>{String(label)}</span>
                  <span className={`status${done ? " done" : ""}`}>{done ? "complete" : "open"}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24 }}><Progress value={80} label="Today is 80% complete" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProtocolDemo() {
  const [done, setDone] = useState([true, true, true, false, true]);
  const complete = done.filter(Boolean).length;
  return (
    <div className="protocol-card">
      <div className="protocol-date"><span>Saturday / Sep 19</span><span>Today&apos;s protocol</span></div>
      {protocol.map(([title, detail], index) => (
        <div className="protocol-row" key={title}>
          <span className="num">{String(index + 1).padStart(2, "0")}</span>
          <div><h3>{title}</h3><p>{detail}</p></div>
          <button
            className={`protocol-complete${done[index] ? " done" : ""}`}
            aria-label={`${done[index] ? "Undo" : "Complete"} ${title}`}
            aria-pressed={done[index]}
            onClick={() => setDone((current) => current.map((value, i) => i === index ? !value : value))}
          >{done[index] ? "✓" : ""}</button>
        </div>
      ))}
      <div className="protocol-footer">
        <div className="protocol-progress">
          <p><span>Progress</span><span>{complete} / {protocol.length}</span></p>
          <Progress value={(complete / protocol.length) * 100} />
        </div>
        <Link className="button button-primary" href="/app/today">Open today →</Link>
      </div>
    </div>
  );
}

export function MinimumDayDemo() {
  const [minimum, setMinimum] = useState(false);
  const normal = [
    ["Train", "60 min"], ["Read", "30 min"], ["Deep Work", "2 hr"], ["Journal", "10 min"],
  ];
  const min = [
    ["Train", "20 push-ups"], ["Read", "2 pages"], ["Deep Work", "15 minutes"], ["Journal", "One sentence"],
  ];
  const rows = minimum ? min : normal;
  return (
    <div className="minimum-demo">
      <div className="mode-toggle">
        <button className={`mode-tab${!minimum ? " active" : ""}`} onClick={() => setMinimum(false)}>Normal day</button>
        <button className={`mode-tab${minimum ? " active" : ""}`} onClick={() => setMinimum(true)}>Minimum day</button>
      </div>
      <div className="mode-list">
        {rows.map(([title, detail]) => <div className="mode-row" key={title}><span>{title}</span><span>{detail}</span></div>)}
      </div>
      <div className="minimum-action">
        <p>{minimum ? "Minimum Day active. The standard changed; the commitment did not." : "Bad day? Reduce the load without dropping the system."}</p>
        <button className={`button${minimum ? "" : " button-primary"}`} onClick={() => setMinimum((value) => !value)}>
          {minimum ? "Return to Normal Day" : "Activate Minimum Day"}
        </button>
      </div>
    </div>
  );
}
