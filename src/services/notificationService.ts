export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function scheduleNotification(title: string, body: string, delayMs: number): number {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return 0;
  if (delayMs <= 0) return 0;
  const id = window.setTimeout(() => {
    new Notification(title, {
      body,
      icon: '/icons/icon-192.png',
      tag: title,
      silent: false,
    });
  }, delayMs);
  return id;
}

export interface PrayerNotificationConfig {
  name: string;
  time: string;
  title: string;
  body: string;
  enabled: boolean;
  minutesBefore: number;
}

export function scheduleAllPrayerNotifications(
  configs: PrayerNotificationConfig[]
): number[] {
  const now = new Date();
  const ids: number[] = [];
  for (const config of configs) {
    if (!config.enabled || !config.time) continue;
    const [h, m] = config.time.split(':').map(Number);
    const target = new Date(now);
    target.setHours(h, m - config.minutesBefore, 0, 0);
    const delay = target.getTime() - now.getTime();
    if (delay > 0) {
      ids.push(scheduleNotification(config.title, config.body, delay));
    }
  }
  return ids;
}
