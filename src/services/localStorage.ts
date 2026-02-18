export function lsGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function lsSet<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function lsDelete(key: string): void {
  localStorage.removeItem(key);
}

export function lsKeys(prefix: string): string[] {
  return Object.keys(localStorage).filter(k => k.startsWith(prefix));
}
