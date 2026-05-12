import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import { DAILY_REMINDER_PREF_KEY } from '@/constants/notification-prefs';
import { parseReminderTime } from '@/lib/habits/reminder-time';
import type { Habit } from '@/types/habit';
import type { UserSetup } from '@/types/user-setup';

const ANDROID_CHANNEL_ID = 'daily-calm';

export async function loadDailyReminderPref(): Promise<boolean> {
  const v = await AsyncStorage.getItem(DAILY_REMINDER_PREF_KEY);
  if (v === null) return false;
  return v === 'true';
}

export async function saveDailyReminderPref(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(DAILY_REMINDER_PREF_KEY, enabled ? 'true' : 'false');
}

export function configureNotificationHandler(): void {
  if (Platform.OS === 'web') return;
  void import('expo-notifications').then((Notifications) => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  });
}

async function ensureAndroidChannel(
  Notifications: typeof import('expo-notifications'),
): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'Gentle reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

function sortedHabitsOldestFirst(habits: Habit[]): Habit[] {
  return [...habits].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

function reminderTimeFromState(habits: Habit[], userSetup: UserSetup | null): string {
  const first = sortedHabitsOldestFirst(habits)[0];
  return first?.reminderTime?.trim() || userSetup?.reminderTime?.trim() || '08:00';
}

export type HabitStoreSlice = {
  hydrated: boolean;
  habits: Habit[];
  userSetup: UserSetup | null;
};

/**
 * Cancels prior local schedules, then schedules one daily notification when prefs + data allow.
 * Permission must already be granted (request from Profile when enabling the toggle).
 */
export async function syncDailyReminderFromStore(getState: () => HabitStoreSlice): Promise<void> {
  if (Platform.OS === 'web') return;

  const Notifications = await import('expo-notifications');
  const { hydrated, habits, userSetup } = getState();
  if (!hydrated) return;

  const enabled = await loadDailyReminderPref();

  if (!enabled || habits.length === 0) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return;
  }

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return;
  }

  await ensureAndroidChannel(Notifications);
  await Notifications.cancelAllScheduledNotificationsAsync();

  const parsed = parseReminderTime(reminderTimeFromState(habits, userSetup));
  if (!parsed) return;

  const primaryTitle = sortedHabitsOldestFirst(habits)[0]?.title ?? 'your tiny step';
  const daySeed = Math.floor(Date.now() / 86400000);
  const bodies = [
    `Tiny steps still count — "${primaryTitle}" when you're ready.`,
    'A calm rhythm beats a perfect streak. One small pause today still counts.',
    `"${primaryTitle}" is enough when you're ready. No pressure, just presence.`,
  ];
  const body = bodies[daySeed % bodies.length];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Bloom',
      body,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: parsed.hour,
      minute: parsed.minute,
      ...(Platform.OS === 'android' ? { channelId: ANDROID_CHANNEL_ID } : {}),
    },
  });
}

/** Ask the OS for notification permission (native only). */
export async function requestDailyReminderPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const Notifications = await import('expo-notifications');
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}
