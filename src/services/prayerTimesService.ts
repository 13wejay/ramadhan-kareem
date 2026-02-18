import { lsGet, lsSet } from './localStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { getTodayString } from '../utils/dateHelpers';

export interface PrayerTimings {
  Imsak: string;
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Midnight: string;
}

export interface CachedPrayerTimes {
  date: string;
  hijriDate: string;
  hijriMonth: string;
  location: { lat: number; lng: number; city: string; country: string };
  timings: PrayerTimings;
  method: number;
  cachedAt: string;
}

function cacheKey(date: string, lat: number, lng: number): string {
  return `${STORAGE_KEYS.PRAYER_CACHE_PREFIX}${date}_${lat.toFixed(2)}_${lng.toFixed(2)}`;
}

export async function fetchPrayerTimes(
  lat: number,
  lng: number,
  method: number,
  school: number,
  date?: string
): Promise<CachedPrayerTimes | null> {
  const targetDate = date || getTodayString();
  const key = cacheKey(targetDate, lat, lng);
  const cached = lsGet<CachedPrayerTimes>(key);
  if (cached) return cached;

  try {
    const timestamp = Math.floor(new Date(targetDate + 'T12:00:00').getTime() / 1000);
    const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=${method}&school=${school}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.code !== 200) return null;

    const t = data.data.timings;
    const hijri = data.data.date.hijri;

    const result: CachedPrayerTimes = {
      date: targetDate,
      hijriDate: `${hijri.day} ${hijri.month.en} ${hijri.year} H`,
      hijriMonth: hijri.month.en,
      location: { lat, lng, city: '', country: '' },
      timings: {
        Imsak: t.Imsak?.split(' ')[0] || '',
        Fajr: t.Fajr?.split(' ')[0] || '',
        Sunrise: t.Sunrise?.split(' ')[0] || '',
        Dhuhr: t.Dhuhr?.split(' ')[0] || '',
        Asr: t.Asr?.split(' ')[0] || '',
        Sunset: t.Sunset?.split(' ')[0] || '',
        Maghrib: t.Maghrib?.split(' ')[0] || '',
        Isha: t.Isha?.split(' ')[0] || '',
        Midnight: t.Midnight?.split(' ')[0] || '',
      },
      method,
      cachedAt: new Date().toISOString(),
    };

    lsSet(key, result);
    return result;
  } catch {
    return null;
  }
}

export async function prefetchMonthlyPrayerTimes(
  lat: number,
  lng: number,
  method: number,
  school: number,
  year: number,
  month: number
): Promise<void> {
  try {
    const url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${lat}&longitude=${lng}&method=${method}&school=${school}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.code !== 200) return;

    for (const day of data.data) {
      const greg = day.date.gregorian;
      const dateStr = `${greg.year}-${greg.month.number.toString().padStart(2, '0')}-${greg.day.padStart(2, '0')}`;
      const key = cacheKey(dateStr, lat, lng);
      if (lsGet(key)) continue;

      const t = day.timings;
      const hijri = day.date.hijri;

      const result: CachedPrayerTimes = {
        date: dateStr,
        hijriDate: `${hijri.day} ${hijri.month.en} ${hijri.year} H`,
        hijriMonth: hijri.month.en,
        location: { lat, lng, city: '', country: '' },
        timings: {
          Imsak: t.Imsak?.split(' ')[0] || '',
          Fajr: t.Fajr?.split(' ')[0] || '',
          Sunrise: t.Sunrise?.split(' ')[0] || '',
          Dhuhr: t.Dhuhr?.split(' ')[0] || '',
          Asr: t.Asr?.split(' ')[0] || '',
          Sunset: t.Sunset?.split(' ')[0] || '',
          Maghrib: t.Maghrib?.split(' ')[0] || '',
          Isha: t.Isha?.split(' ')[0] || '',
          Midnight: t.Midnight?.split(' ')[0] || '',
        },
        method,
        cachedAt: new Date().toISOString(),
      };

      lsSet(key, result);
    }
  } catch {
    // silently fail — offline or API issues
  }
}
