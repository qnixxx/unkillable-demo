"use client";

import { useEffect, useState } from "react";
import { useAppData } from "@/components/app/data-provider";
import { configureDailyReminder, impactLight, isNativeApp, warningHaptic } from "@/lib/native";

export function SettingsPage() {
  const { data, updateSettings } = useAppData();
  const [tab,setTab]=useState("profile");
  const [saved,setSaved]=useState(false);
  const [notificationMessage,setNotificationMessage]=useState("");
  const [native,setNative]=useState(false);

  useEffect(()=>setNative(isNativeApp()),[]);

  async function saveName(value:string){
    await updateSettings({displayName:value.trim()||"Member"});
    setSaved(true);
    void impactLight();
    window.setTimeout(()=>setSaved(false),1600);
  }

  async function toggleReminders() {
    const next = !data.settings.reminders;
    setNotificationMessage("");
    const result = await configureDailyReminder(next, data.settings.reminderTime);

    if (next && result.native && !result.granted) {
      await updateSettings({ reminders: false });
      setNotificationMessage("Notifications are disabled for Unkillable in iOS Settings.");
      void warningHaptic();
      return;
    }

    await updateSettings({ reminders: next });
    setNotificationMessage(
      result.native
        ? (next ? "Daily iPhone reminder scheduled." : "Daily reminder removed.")
        : "Reminder preference synced. Native delivery is available in the iPhone build.",
    );
    void impactLight();
  }

  async function updateReminderTime(value:string) {
    await updateSettings({ reminderTime: value });
    if (data.settings.reminders) {
      const result = await configureDailyReminder(true, value);
      setNotificationMessage(result.native && result.granted ? "Reminder time updated on this device." : "Reminder time synced.");
    }
  }

  return <>
    <div className="page-head"><div><p className="eyebrow">Settings</p><h1>Keep the system yours.</h1><p>Adjust behavior without changing the philosophy.</p></div></div>
    <div className="settings-grid">
      <nav className="settings-menu" aria-label="Settings sections">
        <button className={tab==="profile"?"active":""} onClick={()=>setTab("profile")}>Profile</button>
        <button className={tab==="behavior"?"active":""} onClick={()=>setTab("behavior")}>Behavior</button>
        <button className={tab==="data"?"active":""} onClick={()=>setTab("data")}>Data</button>
      </nav>
      <div className="settings-panel">
        {tab==="profile"&&
          <section className="card settings-section">
            <h2>Profile</h2>
            <p>Your profile follows you across signed-in devices.</p>
            <div className="field">
              <label htmlFor="display-name">Display name</label>
              <input id="display-name" defaultValue={data.settings.displayName} onBlur={(e)=>void saveName(e.target.value)}/>
              <span className="field-help">{saved?"Synced.":"Changes sync when you leave the field."}</span>
            </div>
          </section>
        }
        {tab==="behavior"&&<>
          <section className="card settings-section">
            <h2>Reminders</h2>
            <p>{native ? "Scheduled locally on this iPhone; the preference is synced to your account." : "Reminder preferences are synced to your account. Native delivery is available in the iPhone build."}</p>
            <div className="setting-row">
              <div><strong>Daily reminder</strong><span>Prompt you to close the loop on today.</span></div>
              <button className={`switch${data.settings.reminders?" on":""}`} aria-label="Toggle reminders" aria-pressed={data.settings.reminders} onClick={()=>void toggleReminders()}/>
            </div>
            <div className="setting-row">
              <div><strong>Reminder time</strong><span>When your system should nudge you.</span></div>
              <input type="time" value={data.settings.reminderTime} onChange={(e)=>void updateReminderTime(e.target.value)} style={{background:"var(--surface-2)",border:"1px solid var(--line)",color:"var(--text)",padding:"8px",borderRadius:8}}/>
            </div>
            {notificationMessage&&<p className="field-help" role="status" style={{marginTop:12}}>{notificationMessage}</p>}
          </section>
          <section className="card settings-section">
            <h2>Accessibility</h2>
            <p>Respect motion preferences at the product level.</p>
            <div className="setting-row">
              <div><strong>Reduce motion</strong><span>Minimize state-change animation.</span></div>
              <button className={`switch${data.settings.reducedMotion?" on":""}`} aria-label="Toggle reduced motion" aria-pressed={data.settings.reducedMotion} onClick={()=>void updateSettings({reducedMotion:!data.settings.reducedMotion})}/>
            </div>
          </section>
        </>}
        {tab==="data"&&
          <section className="card settings-section">
            <h2>Data</h2>
            <p>Your habits, completions, Minimum Days, profile and settings are stored in the production database and protected by per-user Row Level Security.</p>
            <div className="setting-row">
              <div><strong>Cloud sync</strong><span>Signed-in devices use the same account data.</span></div>
              <span className="accent" style={{fontSize:10}}>ACTIVE</span>
            </div>
            <div className="setting-row">
              <div><strong>Timezone</strong><span>Used for day boundaries and future reminder scheduling.</span></div>
              <span className="muted" style={{fontSize:11}}>{data.settings.timezone}</span>
            </div>
          </section>
        }
      </div>
    </div>
  </>;
}
