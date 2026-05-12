import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTabBarContentPadding } from '@/hooks/useTabBarContentPadding';
import { emotionSummaryLastDays } from '@/lib/habits/emotion-stats';
import { useHabitStore } from '@/store/useHabitStore';

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const bottomPad = useTabBarContentPadding();
  const completions = useHabitStore((s) => s.completions);

  const summary = useMemo(() => emotionSummaryLastDays(completions), [completions]);
  const hasEmotionData = summary.better + summary.same + summary.worse > 0;

  return (
    <View
      className="flex-1 bg-background-off px-6 dark:bg-dark-bg"
      style={{ paddingTop: insets.top + 24, paddingBottom: bottomPad }}
      accessibilityLabel="Insights tab">
      <Text
        accessibilityRole="header"
        className="text-center font-semibold text-2xl text-content-primary dark:text-dark-text">
        Insights
      </Text>
      <Text className="mt-3 max-w-sm self-center text-center text-base text-content-secondary dark:text-dark-text/80">
        Streaks and richer analytics will grow here. For now, a gentle read on how completions felt this week.
      </Text>

      <View className="mt-8 w-full max-w-sm self-center rounded-habit border border-neutral-200 bg-white px-5 py-5 dark:border-white/10 dark:bg-dark-surface">
        <Text className="text-center text-sm font-semibold uppercase tracking-wide text-content-muted dark:text-dark-text/60">
          Last 7 days (after check-in)
        </Text>
        {hasEmotionData ? (
          <View className="mt-4 gap-2">
            <Text className="text-center text-base text-content-primary dark:text-dark-text">
              Better: {summary.better}
            </Text>
            <Text className="text-center text-base text-content-primary dark:text-dark-text">
              Same: {summary.same}
            </Text>
            <Text className="text-center text-base text-content-primary dark:text-dark-text">
              Worse: {summary.worse}
            </Text>
            {summary.unanswered > 0 ? (
              <Text className="mt-2 text-center text-sm text-content-secondary dark:text-dark-text/80">
                {summary.unanswered} completion{summary.unanswered === 1 ? '' : 's'} without a check-in yet
              </Text>
            ) : null}
          </View>
        ) : (
          <Text className="mt-4 text-center text-sm leading-5 text-content-secondary dark:text-dark-text/80">
            Mark a habit done on Today, then share how you felt — we&apos;ll summarize the trend here.
          </Text>
        )}
      </View>
    </View>
  );
}
