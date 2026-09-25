export const SESSION_KEY = "unkillable:session:v1";

export function hasLocalSession() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SESSION_KEY) === "1" || document.cookie.split("; ").some((item) => item === "unkillable_auth=1");
}

export function createLocalSession() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, "1");
  document.cookie = "unkillable_auth=1; path=/; max-age=2592000; samesite=lax";
}

export function clearLocalSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
  document.cookie = "unkillable_auth=; path=/; max-age=0; samesite=lax";
}
