import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/auth-context';
import { useTabBarContentPadding } from '@/hooks/useTabBarContentPadding';

export default function ProfileScreen() {
  const router = useRouter();
  const { session, isGuest, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const insets = useSafeAreaInsets();
  const bottomPad = useTabBarContentPadding();

  async function onSignOut() {
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
    }
  }

  return (
    <View
      className="flex-1 items-center justify-center bg-background-off px-6 dark:bg-dark-bg"
      style={{ paddingTop: insets.top + 24, paddingBottom: bottomPad }}>
      <Text className="text-center font-semibold text-2xl text-content-primary dark:text-dark-text">
        Profile
      </Text>
      {isGuest ? (
        <Text className="mt-3 max-w-sm text-center text-base text-content-secondary dark:text-dark-text/80">
          You&apos;re browsing as a guest. Sign up anytime to sync across devices.
        </Text>
      ) : (
        <Text className="mt-3 max-w-sm text-center text-base text-content-secondary dark:text-dark-text/80">
          {session?.user.email ?? 'Signed in'}
        </Text>
      )}

      <Pressable
        onPress={() => router.push('/setup-preferences')}
        accessibilityRole="button"
        accessibilityLabel="Edit my setup"
        className="mt-8 w-full max-w-sm rounded-button border border-neutral-200 bg-white px-5 py-4 dark:border-dark-surface dark:bg-dark-surface">
        <Text className="text-center text-base font-semibold text-primary dark:text-dark-primary">Edit my setup</Text>
        <Text className="mt-1 text-center text-sm text-content-secondary dark:text-dark-text/80">
          Identity, daily rhythm, tiny habit, reminder, and energy
        </Text>
      </Pressable>

      <Pressable
        onPress={onSignOut}
        disabled={busy}
        className="mt-10 h-12 min-w-[200px] items-center justify-center rounded-button border border-neutral-200 bg-white px-6 dark:border-dark-surface dark:bg-dark-surface">
        {busy ? (
          <ActivityIndicator color="#5B5CEB" />
        ) : (
          <Text className="font-semibold text-primary dark:text-dark-primary">
            {isGuest ? 'Leave guest mode' : 'Sign out'}
          </Text>
        )}
      </Pressable>
    </View>
  );
}
