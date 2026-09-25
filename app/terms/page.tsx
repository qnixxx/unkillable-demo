import { ContentPage } from "@/components/marketing/content-page";

export default function Page(){
  return <ContentPage eyebrow="Terms" title="PRODUCT, NOT DIAGNOSIS.">
    <p><strong style={{color:"var(--text)"}}>Effective September 19, 2026.</strong> Unkillable is a personal organization, consistency, and performance product. Its scores, streaks, pillar metrics, and suggestions are product metrics based on the activity you record. They are not medical, psychological, scientific, or clinical diagnoses.</p>
    <p>You are responsible for choosing commitments that are appropriate for you and for using your judgment around exercise, sleep, work, relationships, and other activities. Do not use the app as a substitute for professional medical or mental-health care.</p>
    <p>The current local-first version stores product data on your device. Deleting app data, browser storage, or the application can remove that data. Features may change as the product develops, and future paid or cloud-connected services may be governed by additional terms presented before use.</p>
    <p>To the extent permitted by applicable law, the service is provided without guarantees that it will be uninterrupted or error-free. Questions about these terms can be sent to <a href="mailto:hello@unkillable.app">hello@unkillable.app</a>.</p>
  </ContentPage>;
}
