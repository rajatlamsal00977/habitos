import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/auth-context';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { continueAsGuest } = useAuth();
  const [busy, setBusy] = useState(false);

  async function onGuest() {
    setBusy(true);
    try {
      await continueAsGuest();
    } finally {
      setBusy(false);
    }
  }

  return (
    <View
      className="flex-1 bg-background-cream px-6 dark:bg-dark-bg"
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 16 }}>
      <Text className="text-3xl font-bold tracking-tight text-content-primary dark:text-dark-text">
        Bloom
      </Text>
      <Text className="mt-3 max-w-sm text-base leading-6 text-content-secondary dark:text-dark-text/80">
        A calm space to become who you want to be — one tiny step at a time.
      </Text>

      <View className="mt-12 gap-4">
        <Link href="/(auth)/login" asChild>
          <Pressable className="h-14 items-center justify-center rounded-button bg-primary shadow-md shadow-primary/20 active:opacity-90 dark:bg-dark-primary">
            <Text className="text-[17px] font-semibold text-white">Log in</Text>
          </Pressable>
        </Link>

        <Link href="/(auth)/sign-up" asChild>
          <Pressable className="h-14 items-center justify-center rounded-button border border-neutral-200 bg-white active:opacity-90 dark:border-dark-surface dark:bg-dark-surface">
            <Text className="text-[17px] font-semibold text-primary dark:text-dark-primary">Sign up</Text>
          </Pressable>
        </Link>

        <Pressable
          onPress={onGuest}
          disabled={busy}
          className="h-14 flex-row items-center justify-center rounded-button bg-background-off active:opacity-90 dark:bg-dark-surface">
          {busy ? (
            <ActivityIndicator color="#5B5CEB" />
          ) : (
            <Text className="text-[17px] font-semibold text-content-secondary dark:text-dark-text">
              Continue as guest
            </Text>
          )}
        </Pressable>
      </View>

      {!isSupabaseConfigured ? (
        <Text className="mt-8 text-center text-sm text-content-muted dark:text-dark-text/60">
          Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to use email sign-in. Guest mode
          still works.
        </Text>
      ) : null}
    </View>
  );
}
