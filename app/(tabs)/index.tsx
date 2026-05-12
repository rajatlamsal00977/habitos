import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmotionCheckInSheet } from '@/components/home/EmotionCheckInSheet';
import { HabitCard } from '@/components/home/HabitCard';
import { HomeHeader } from '@/components/home/HomeHeader';
import { MascotHero } from '@/components/home/MascotHero';
import { useTabBarContentPadding } from '@/hooks/useTabBarContentPadding';
import { globalCommitmentStreak, localDateKey } from '@/lib/habits/dates';
import { highlightedHabitCards } from '@/lib/habits/view-model';
import { useHabitStore } from '@/store/useHabitStore';

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
  const reduceMotion = useReducedMotion() ?? false;

  const hydrated = useHabitStore((s) => s.hydrated);
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const lowEnergyDateKey = useHabitStore((s) => s.lowEnergyDateKey);
  const toggleTodayCompletion = useHabitStore((s) => s.toggleTodayCompletion);
  const toggleLowEnergyToday = useHabitStore((s) => s.toggleLowEnergyToday);
  const [emotionQueue, setEmotionQueue] = useState<{ id: string; title: string }[]>([]);
  const activeEmotion = emotionQueue[0];

  const isLowEnergyToday = lowEnergyDateKey === localDateKey();

  const cardItems = useMemo(
    () => highlightedHabitCards(habits, completions, 3),
    [habits, completions],
  );

  const streak = useMemo(
    () => globalCommitmentStreak(habits.map((h) => h.id), completions),
    [habits, completions],
  );

  const completedToday = cardItems.filter((h) => h.completed).length;
  const points = 80 + streak * 5 + completedToday * 10;

  const baseGradient =
    scheme === 'dark'
      ? (['#12131A', '#1B1C24', '#161821', '#12131A'] as const)
      : (['#F5EBDD', '#F4E7DA', '#F8F8F8', '#F5EBDD'] as const);
  const washGradient =
    scheme === 'dark'
      ? (['rgba(125,126,255,0.18)', 'transparent'] as const)
      : (['rgba(201,203,255,0.35)', 'transparent'] as const);

  const handleToggleHabit = useCallback(
    (habitId: string, title: string) => {
      const { added, completionId } = toggleTodayCompletion(habitId);
      if (added && completionId) {
        setEmotionQueue((q) => [...q, { id: completionId, title }]);
      }
    },
    [toggleTodayCompletion],
  );

  const onSkipEmotion = useCallback(() => {
    setEmotionQueue((q) => q.slice(1));
  }, []);

  const onEmotionSelect = useCallback((score: -1 | 0 | 1) => {
    setEmotionQueue((q) => {
      const head = q[0];
      if (head) {
        queueMicrotask(() => {
          useHabitStore.getState().setCompletionEmotion(head.id, score);
        });
      }
      return q.slice(1);
    });
  }, []);

  if (!hydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-background-cream dark:bg-dark-bg">
        <ActivityIndicator size="large" color="#5B5CEB" />
      </View>
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

        <MascotHero streak={streak} microcopyIndex={microcopyIndex} reduceMotion={reduceMotion} />

        <Pressable
          onPress={() => toggleLowEnergyToday()}
          accessibilityRole="button"
          accessibilityLabel={
            isLowEnergyToday
              ? 'Low energy mode is on for today. Tap to turn off.'
              : 'Turn on low energy mode for today'
          }
          accessibilityState={{ selected: isLowEnergyToday }}
          className={`mt-5 self-start rounded-full border px-4 py-2.5 ${
            isLowEnergyToday
              ? 'border-accent-warning/50 bg-accent-warning/15 dark:border-accent-warning/40 dark:bg-accent-warning/10'
              : 'border-neutral-200 bg-white/90 dark:border-dark-surface dark:bg-dark-surface/90'
          }`}>
          <Text
            className={`text-sm font-medium ${
              isLowEnergyToday
                ? 'text-content-primary dark:text-dark-text'
                : 'text-content-secondary dark:text-dark-text/80'
            }`}>
            {isLowEnergyToday ? 'Low energy on — tap to turn off' : 'Low energy today?'}
          </Text>
        </Pressable>

        <Text className="mb-3 mt-8 text-lg font-bold text-content-primary dark:text-dark-text">
          Today&apos;s habits
        </Text>
        <Text className="mb-4 text-sm text-content-secondary dark:text-dark-text/80">
          Up to three highlights — tap Done when you finish one.
        </Text>

        {cardItems.length === 0 ? (
          <View className="rounded-habit border border-dashed border-neutral-200 bg-white/80 px-5 py-8 dark:border-white/15 dark:bg-dark-surface/80">
            <Text className="text-center text-base leading-6 text-content-secondary dark:text-dark-text/80">
              No habits saved on this device yet. Finish onboarding to create your first tiny step — it will show up
              here automatically.
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Edit my setup"
              onPress={() => router.push('/setup-preferences')}
              className="mt-5 self-center rounded-button bg-primary px-6 py-3.5 dark:bg-dark-primary">
              <Text className="text-center text-base font-semibold text-white">Edit my setup</Text>
            </Pressable>
          </View>
        ) : (
          <View className="gap-4">
            {cardItems.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                reduceMotion={reduceMotion}
                lowEnergyActive={isLowEnergyToday}
                onToggleComplete={() => handleToggleHabit(habit.id, habit.title)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <EmotionCheckInSheet
        visible={!!activeEmotion}
        habitTitle={activeEmotion?.title ?? ''}
        reduceMotion={reduceMotion}
        onSelect={onEmotionSelect}
        onSkip={onSkipEmotion}
      />
    </View>
  );
}
