import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '@supabase/supabase-js';
import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { GUEST_SESSION_KEY, ONBOARDING_COMPLETED_KEY } from '@/constants/auth-storage';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { useHabitStore } from '@/store/useHabitStore';

type AuthContextValue = {
  initialized: boolean;
  session: Session | null;
  isGuest: boolean;
  hasCompletedOnboarding: boolean;
  signOut: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const guestFlag = await AsyncStorage.getItem(GUEST_SESSION_KEY);
      const onboardingFlag = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
      if (!isSupabaseConfigured) {
        if (!active) return;
        setSession(null);
        setIsGuest(guestFlag === 'true');
        setHasCompletedOnboarding(onboardingFlag === 'true');
        setInitialized(true);
        await useHabitStore.getState().hydrate();
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!active) return;
      const sess = data.session ?? null;
      if (sess && guestFlag === 'true') {
        await AsyncStorage.removeItem(GUEST_SESSION_KEY);
      }
      setSession(sess);
      setIsGuest(sess ? false : guestFlag === 'true');
      setHasCompletedOnboarding(onboardingFlag === 'true');
      setInitialized(true);
      await useHabitStore.getState().hydrate();
    }

    load();

    if (!isSupabaseConfigured) {
      return () => {
        active = false;
      };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      if (event === 'SIGNED_IN') {
        await AsyncStorage.removeItem(GUEST_SESSION_KEY);
        setIsGuest(false);
      }
      setSession(nextSession);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(GUEST_SESSION_KEY);
    setIsGuest(false);
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      setSession(null);
    }
  }, []);

  const continueAsGuest = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    await AsyncStorage.setItem(GUEST_SESSION_KEY, 'true');
    setSession(null);
    setIsGuest(true);
  }, []);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    setHasCompletedOnboarding(true);
  }, []);

  const value = useMemo(
    () => ({
      initialized,
      session,
      isGuest,
      hasCompletedOnboarding,
      signOut,
      continueAsGuest,
      completeOnboarding,
    }),
    [initialized, session, isGuest, hasCompletedOnboarding, signOut, continueAsGuest, completeOnboarding],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

/** Routes users between auth, onboarding, and app tabs. */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { initialized, session, isGuest, hasCompletedOnboarding } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const inSetupPreferences = segments[0] === 'setup-preferences';
    const allowed = Boolean(session) || isGuest;

    if (!allowed && !inAuthGroup) {
      router.replace('/(auth)');
      return;
    }

    if (allowed && !hasCompletedOnboarding && !inOnboardingGroup && !inSetupPreferences) {
      router.replace('/(onboarding)');
      return;
    }

    if (allowed && hasCompletedOnboarding && (inAuthGroup || inOnboardingGroup)) {
      router.replace('/(tabs)');
    }
  }, [initialized, session, isGuest, hasCompletedOnboarding, segments, router]);

  if (!initialized) {
    return null;
  }

  return <>{children}</>;
}
