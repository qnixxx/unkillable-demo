import type { AppData } from "@/types";
import { createSeedData } from "@/data/seed";

export interface DataAdapter {
  load(): AppData;
  save(data: AppData): void;
  reset(): AppData;
}

const STORAGE_KEY = "unkillable:data:v1";

export const localStorageAdapter: DataAdapter = {
  load() {
    if (typeof window === "undefined") return createSeedData();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return createSeedData();
      const parsed = JSON.parse(raw) as AppData;
      if (parsed.version !== 1) return createSeedData();
      return parsed;
    } catch {
      return createSeedData();
    }
  },
  save(data) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
  reset() {
    const fresh = createSeedData();
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    }
    return fresh;
  },
};
