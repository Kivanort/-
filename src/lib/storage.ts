/** Срок хранения ответов опроса — 2 минуты */
export const QUIZ_STORAGE_TTL_MS = 2 * 60 * 1000;

export interface StoredQuizPayload<T> {
  data: T;
  savedAt: number;
}

export function loadWithTTL<T>(
  key: string,
  fallback: T
): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as StoredQuizPayload<T>;
    if (!parsed.savedAt || Date.now() - parsed.savedAt > QUIZ_STORAGE_TTL_MS) {
      localStorage.removeItem(key);
      return fallback;
    }
    return parsed.data;
  } catch {
    return fallback;
  }
}

export function saveWithTTL<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  const payload: StoredQuizPayload<T> = { data, savedAt: Date.now() };
  localStorage.setItem(key, JSON.stringify(payload));
}

export function removeStorage(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}
