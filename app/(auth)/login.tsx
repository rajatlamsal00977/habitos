import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!isSupabaseConfigured) {
      Alert.alert(
        'Supabase not configured',
        'Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to your environment, or use guest mode.',
      );
      return;
    }
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Enter your email and password.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Could not log in', error.message);
      return;
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background-cream dark:bg-dark-bg"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="grow px-6"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
        }}>
        <Pressable onPress={() => router.back()} className="mb-6 self-start py-2">
          <Text className="font-medium text-primary dark:text-dark-primary">← Back</Text>
        </Pressable>

        <Text className="text-2xl font-bold text-content-primary dark:text-dark-text">Welcome back</Text>
        <Text className="mt-2 text-base text-content-secondary dark:text-dark-text/80">
          Log in to keep your habits and streaks in sync.
        </Text>

        <View className="mt-8 gap-2">
          <Text className="text-sm font-medium text-content-secondary dark:text-dark-text/80">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="you@example.com"
            placeholderTextColor="#A0A0AE"
            className="rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base text-content-primary dark:border-dark-surface dark:bg-dark-surface dark:text-dark-text"
          />
        </View>

        <View className="mt-4 gap-2">
          <Text className="text-sm font-medium text-content-secondary dark:text-dark-text/80">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholder="••••••••"
            placeholderTextColor="#A0A0AE"
            className="rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base text-content-primary dark:border-dark-surface dark:bg-dark-surface dark:text-dark-text"
          />
        </View>

        <Pressable
          onPress={onSubmit}
          disabled={loading}
          className="mt-8 h-14 items-center justify-center rounded-button bg-primary active:opacity-90 dark:bg-dark-primary">
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-[17px] font-semibold text-white">Log in</Text>
          )}
        </Pressable>

        <Link href="/(auth)/sign-up" asChild>
          <Pressable className="mt-6 items-center py-2">
            <Text className="text-center text-base text-content-secondary dark:text-dark-text/80">
              New here? <Text className="font-semibold text-primary dark:text-dark-primary">Create an account</Text>
            </Text>
          </Pressable>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
