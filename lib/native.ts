/**
 * Web-only compatibility adapter.
 * The investor demo intentionally has no Capacitor/native dependencies.
 */
export function isNativeApp() { return false; }
export async function impactLight() { return; }
export async function successHaptic() { return; }
export async function warningHaptic() { return; }
export async function configureDailyReminder(_enabled: boolean, _reminderTime: string) {
  return { native: false, granted: false };
}
