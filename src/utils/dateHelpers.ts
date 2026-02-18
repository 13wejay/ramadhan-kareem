import { format, differenceInDays, differenceInSeconds, parse, isValid } from 'date-fns';

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatTime(dateStr: string): string {
  return dateStr;
}

export function getRamadhanDay(ramadhanStartDate: string): number {
  const start = parse(ramadhanStartDate, 'yyyy-MM-dd', new Date());
  if (!isValid(start)) return 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = differenceInDays(today, start) + 1;
  return Math.max(1, Math.min(diff, 30));
}

export function getSecondsUntil(timeStr: string): number {
  const now = new Date();
  const [hours, minutes] = timeStr.split(':').map(Number);
  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);
  if (target <= now) return 0;
  return differenceInSeconds(target, now);
}

export function formatCountdown(totalSeconds: number): { hours: string; minutes: string; seconds: string } {
  if (totalSeconds <= 0) return { hours: '00', minutes: '00', seconds: '00' };
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return {
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0'),
  };
}

export function getGregorianDateFormatted(): string {
  return format(new Date(), 'EEEE, d MMMM yyyy');
}

export function getDayName(dateStr: string): string {
  const date = parse(dateStr, 'yyyy-MM-dd', new Date());
  return isValid(date) ? format(date, 'EEEE') : '';
}
