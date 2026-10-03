import { Fact } from '../types';

export interface NotificationStatus {
  isSupported: boolean;
  permission: NotificationPermission | 'unsupported';
  scheduledTime: string; // e.g. "09:00"
  enabled: boolean;
}

const STORAGE_KEY = 'monofeed_notifications_pref_v1';

export function getStoredNotificationPrefs(): { enabled: boolean; time: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to read notification preferences', err);
  }
  return { enabled: false, time: '09:00' };
}

export function saveStoredNotificationPrefs(enabled: boolean, time: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ enabled, time }));
  } catch (err) {
    console.error('Failed to save notification preferences', err);
  }
}

export function getNotificationSupport(): { isSupported: boolean; permission: NotificationPermission | 'unsupported' } {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { isSupported: false, permission: 'unsupported' };
  }
  return { isSupported: true, permission: Notification.permission };
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported' | 'denied'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Notification permission request error or iframe restriction:', err);
    return 'denied';
  }
}

export function triggerFactNotification(fact: Fact): boolean {
  if (typeof window === 'undefined') return false;

  // Attempt real system Notification API if supported and granted
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      const notif = new Notification('MonoFeed · Daily Philippine Fact', {
        body: `${fact.title} — ${fact.summary.slice(0, 100)}...`,
        tag: `monofeed-${fact.id}`,
        silent: false
      });
      notif.onclick = () => {
        window.focus();
        notif.close();
      };
      return true;
    } catch (err) {
      console.warn('System notification failed (possibly inside sandboxed iframe), using in-app alert:', err);
    }
  }

  return false;
}
