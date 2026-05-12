import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/auth-context';
import { useTabBarContentPadding } from '@/hooks/useTabBarContentPadding';
import {
  loadDailyReminderPref,
  requestDailyReminderPermission,
  saveDailyReminderPref,
  syncDailyReminderFromStore,
} from '@/lib/notifications/daily-reminder';
import { useHabitStore } from '@/store/useHabitStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { session, isGuest, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [reminderOn, setReminderOn] = useState(true);
  const [reminderLoaded, setReminderLoaded] = useState(false);
  const insets = useSafeAreaInsets();
  const bottomPad = useTabBarContentPadding();

  useEffect(() => {
    let active = true;
    loadDailyReminderPref().then((v) => {
      if (active) {
        setReminderOn(v);
        setReminderLoaded(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const onReminderToggle = useCallback(async (value: boolean) => {
    if (Platform.OS === 'web') {
      setReminderOn(false);
      await saveDailyReminderPref(false);
      return;
    }
    if (value) {
      const granted = await requestDailyReminderPermission();
      if (!granted) {
        setReminderOn(false);
        await saveDailyReminderPref(false);
        void syncDailyReminderFromStore(() => useHabitStore.getState());
        return;
      }
    }
    setReminderOn(value);
    await saveDailyReminderPref(value);
    void syncDailyReminderFromStore(() => useHabitStore.getState());
  }, []);

  async function onSignOut() {
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-background-off dark:bg-dark-bg"
      contentContainerStyle={{
        paddingTop: insets.top + 24,
        paddingHorizontal: 24,
        paddingBottom: bottomPad + 24,
      }}>
      <Text
        accessibilityRole="header"
        className="text-center font-semibold text-2xl text-content-primary dark:text-dark-text">
        Profile
      </Text>
      {isGuest ? (
        <Text className="mt-3 max-w-sm self-center text-center text-base text-content-secondary dark:text-dark-text/80">
          You&apos;re browsing as a guest. Sign up anytime to sync across devices.
        </Text>
      ) : (
        <Text className="mt-3 max-w-sm self-center text-center text-base text-content-secondary dark:text-dark-text/80">
          {session?.user.email ?? 'Signed in'}
        </Text>
      )}

      <View className="mt-8 w-full max-w-sm self-center rounded-button border border-neutral-200 bg-white px-4 py-4 dark:border-dark-surface dark:bg-dark-surface">
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1 pr-2">
            <Text className="text-base font-semibold text-content-primary dark:text-dark-text">Daily nudge</Text>
            <Text className="mt-1 text-sm leading-5 text-content-secondary dark:text-dark-text/80">
              Gentle reminder near your habit time (native only). You can change the time in setup.
            </Text>
          </View>
          <Switch
            accessibilityLabel="Daily reminder notifications"
            value={reminderLoaded ? reminderOn : false}
            onValueChange={onReminderToggle}
            disabled={!reminderLoaded || Platform.OS === 'web'}
            trackColor={{ false: '#D1D1D6', true: '#C9CBFF' }}
            thumbColor={reminderOn ? '#5B5CEB' : '#f4f3f4'}
          />
        </View>
        {Platform.OS === 'web' ? (
          <Text className="mt-3 text-xs text-content-muted dark:text-dark-text/60">
            Reminders are not available on web in this build.
          </Text>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open system settings for Bloom"
            onPress={() => void Linking.openSettings()}
            className="mt-3">
            <Text className="text-sm font-medium text-primary dark:text-dark-primary">
              System notification settings
            </Text>
          </Pressable>
        )}
      </View>

      <Pressable
        onPress={() => router.push('/setup-preferences')}
        accessibilityRole="button"
        accessibilityLabel="Edit my setup"
        className="mt-6 w-full max-w-sm self-center rounded-button border border-neutral-200 bg-white px-5 py-4 dark:border-dark-surface dark:bg-dark-surface">
        <Text className="text-center text-base font-semibold text-primary dark:text-dark-primary">Edit my setup</Text>
        <Text className="mt-1 text-center text-sm text-content-secondary dark:text-dark-text/80">
          Identity, daily rhythm, tiny habit, reminder, and energy
        </Text>
      </Pressable>

      <Pressable
        onPress={onSignOut}
        disabled={busy}
        accessibilityRole="button"
        accessibilityLabel={isGuest ? 'Leave guest mode' : 'Sign out'}
        className="mt-10 h-12 min-w-[200px] self-center items-center justify-center rounded-button border border-neutral-200 bg-white px-6 dark:border-dark-surface dark:bg-dark-surface">
        {busy ? (
          <ActivityIndicator color="#5B5CEB" />
        ) : (
          <Text className="font-semibold text-primary dark:text-dark-primary">
            {isGuest ? 'Leave guest mode' : 'Sign out'}
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
