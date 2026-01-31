/**
 * SessionStorage keys for restoring accordion/dropdown open state after language change.
 * Cleared on city page mount (refresh) so refresh/close = all closed.
 */
export const ACCORDION_RESTORE_KEYS = {
  places: 'accordion_restore_places',
  rituals: 'accordion_restore_rituals',
  festivals: 'accordion_restore_festivals',
  hotels: 'accordion_restore_hotels',
  cuisine: 'accordion_restore_cuisine',
  academic: 'accordion_restore_academic',
  wellness: 'accordion_restore_wellness',
} as const;

export const ACCORDION_RESTORE_KEY_LIST = Object.values(ACCORDION_RESTORE_KEYS);

export function clearAccordionRestoreKeys(): void {
  if (typeof sessionStorage === 'undefined') return;
  ACCORDION_RESTORE_KEY_LIST.forEach((key) => sessionStorage.removeItem(key));
}

export function getRestoredAccordionIndex(key: string): number | null {
  if (typeof sessionStorage === 'undefined') return null;
  const raw = sessionStorage.getItem(key);
  if (raw === null || raw === '') return null;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 0) return null;
  sessionStorage.removeItem(key);
  return n;
}

export function saveAccordionIndex(key: string, index: number | null): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(key, index === null ? '' : String(index));
}
