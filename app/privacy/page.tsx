import { ContentPage } from "@/components/marketing/content-page";

export default function Page(){
  return <ContentPage eyebrow="Privacy" title="YOUR DATA, CLEARLY.">
    <p><strong style={{color:"var(--text)"}}>Effective September 19, 2026.</strong> Unkillable is designed to work locally. In the current iPhone and web builds, your commitments, completions, onboarding choices, settings, and resilience history are stored on your device. This version does not send that personal activity data to an Unkillable server.</p>
    <p>If you enable a daily reminder in the iPhone app, the reminder is scheduled locally by iOS. Unkillable does not need your location, contacts, photos, health records, advertising identifier, or background tracking to provide the included features.</p>
    <p>The public website may be hosted by infrastructure providers that process ordinary network information needed to deliver the site, such as IP address and request metadata. This repository does not include advertising SDKs, cross-app tracking, or analytics SDKs.</p>
    <p>You can remove locally stored product data by resetting the demo in Settings or deleting the app/browser storage. If a future version introduces cloud accounts, syncing, payments, analytics, or additional processors, this policy must be updated before those features are released.</p>
    <p>Questions about privacy can be sent to <a href="mailto:hello@unkillable.app">hello@unkillable.app</a>.</p>
  </ContentPage>;
}
