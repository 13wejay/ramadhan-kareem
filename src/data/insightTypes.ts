export interface InsightType {
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

export const INSIGHT_TYPE_LABELS: Record<string, string> = {
  hadith: '📜 Hadith',
  quran: '📖 Quran',
  names_of_allah: '✨ Names of Allah',
  seerah: '📚 Seerah',
  ramadhan_fact: '🌙 Ramadhan Fact',
  dua: "🤲 Du'a",
  quote: '💬 Quote',
};
