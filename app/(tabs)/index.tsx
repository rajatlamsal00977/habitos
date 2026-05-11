import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HabitCard, type HabitCardItem } from '@/components/home/HabitCard';
import { HomeHeader } from '@/components/home/HomeHeader';
import { MascotHero } from '@/components/home/MascotHero';
import { useTabBarContentPadding } from '@/hooks/useTabBarContentPadding';

const MOCK_HABITS: HabitCardItem[] = [
  { id: '1', title: 'Morning stretch', progressDone: 2, progressTotal: 3, completed: false },
  { id: '2', title: 'Drink water', progressDone: 3, progressTotal: 3, completed: false },
  { id: '3', title: 'Read one page', progressDone: 0, progressTotal: 3, completed: false },
];

function greetingForNow(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function TodayScreen() {
  const scheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();
  const bottomPad = useTabBarContentPadding();
  const router = useRouter();
  const greeting = useMemo(() => greetingForNow(), []);
  const microcopyIndex = useMemo(() => Math.floor(Date.now() / 86400000) % 3, []);

  const [habits, setHabits] = useState<HabitCardItem[]>(MOCK_HABITS);
  /** Placeholder until Phase 5 persistence — PRD streak model hooks here later. */
  const [streak] = useState(7);
  const completedToday = habits.filter((h) => h.completed).length;
  const points = 120 + completedToday * 10;

  const baseGradient =
    scheme === 'dark'
      ? (['#12131A', '#1B1C24', '#161821', '#12131A'] as const)
      : (['#F5EBDD', '#F4E7DA', '#F8F8F8', '#F5EBDD'] as const);
  const washGradient =
    scheme === 'dark'
      ? (['rgba(125,126,255,0.18)', 'transparent'] as const)
      : (['rgba(201,203,255,0.35)', 'transparent'] as const);

  function toggleHabit(id: string) {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h)),
    );
  }

  return (
    <View className="flex-1 bg-background-cream dark:bg-dark-bg">
      <LinearGradient
        colors={[...baseGradient]}
        locations={[0, 0.35, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        pointerEvents="none"
        colors={[...washGradient]}
        style={[StyleSheet.absoluteFill, { height: '42%' }]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 24,
          paddingBottom: bottomPad,
        }}
        showsVerticalScrollIndicator={false}>
        <HomeHeader
          greeting={greeting}
          streak={streak}
          points={points}
          onAvatarPress={() => router.push('/profile')}
        />

        <MascotHero streak={streak} microcopyIndex={microcopyIndex} />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Low energy mode"
          className="mt-5 self-start rounded-full border border-neutral-200 bg-white/90 px-4 py-2.5 dark:border-dark-surface dark:bg-dark-surface/90">
          <Text className="text-sm font-medium text-content-secondary dark:text-dark-text/80">
            Low energy today?
          </Text>
        </Pressable>

        <Text className="mb-3 mt-8 text-lg font-bold text-content-primary dark:text-dark-text">
          Today&apos;s habits
        </Text>
        <Text className="mb-4 text-sm text-content-secondary dark:text-dark-text/80">
          Up to three highlights — tap Done when you finish one.
        </Text>

        <View className="gap-4">
          {habits.slice(0, 3).map((habit) => (
            <HabitCard key={habit.id} habit={habit} onToggleComplete={() => toggleHabit(habit.id)} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
