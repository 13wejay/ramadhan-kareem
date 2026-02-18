import { lsGet, lsSet } from './localStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { getTodayString } from '../utils/dateHelpers';

export interface Insight {
  id: string;
  type: 'hadith' | 'quran' | 'names_of_allah' | 'seerah' | 'ramadhan_fact' | 'dua' | 'quote';
  title: string;
  content: string;
  source?: string;
  arabicText?: string;
  transliteration?: string;
  translation?: string;
  reflection?: string;
}

let insightsCache: Insight[] | null = null;

export async function loadInsights(): Promise<Insight[]> {
  if (insightsCache) return insightsCache;
  try {
    const res = await fetch('/data/insights.json');
    insightsCache = await res.json();
    return insightsCache!;
  } catch {
    return [];
  }
}

export async function getDailyInsight(ramadhanDay: number): Promise<Insight | null> {
  const today = getTodayString();
  const key = `${STORAGE_KEYS.INSIGHT_OF_DAY}${today}`;
  const savedId = lsGet<string>(key);
  const insights = await loadInsights();

  if (savedId) {
    const found = insights.find(i => i.id === savedId);
    if (found) return found;
  }

  if (insights.length === 0) return null;
  const idx = (ramadhanDay - 1) % insights.length;
  const selected = insights[idx];
  lsSet(key, selected.id);
  return selected;
}

export function getBookmarkedIds(): string[] {
  return lsGet<string[]>(STORAGE_KEYS.BOOKMARKED_INSIGHTS) || [];
}

export function toggleBookmark(insightId: string): boolean {
  const bookmarks = getBookmarkedIds();
  const idx = bookmarks.indexOf(insightId);
  if (idx >= 0) {
    bookmarks.splice(idx, 1);
    lsSet(STORAGE_KEYS.BOOKMARKED_INSIGHTS, bookmarks);
    return false;
  } else {
    bookmarks.push(insightId);
    lsSet(STORAGE_KEYS.BOOKMARKED_INSIGHTS, bookmarks);
    return true;
  }
}

export async function getBookmarkedInsights(): Promise<Insight[]> {
  const ids = getBookmarkedIds();
  const insights = await loadInsights();
  return insights.filter(i => ids.includes(i.id));
}
