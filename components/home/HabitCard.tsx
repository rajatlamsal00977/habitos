import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MotiView } from 'moti';
import { Pressable, Text, View } from 'react-native';

import type { HabitCardItem } from '@/types/habit-card';

export type { HabitCardItem };

type Props = {
  habit: HabitCardItem;
  onToggleComplete: () => void;
  reduceMotion?: boolean;
  lowEnergyActive?: boolean;
};

export function HabitCard({ habit, onToggleComplete, reduceMotion = false, lowEnergyActive = false }: Props) {
  const { title, progressDone, progressTotal, completed } = habit;
  const a11yLow = lowEnergyActive ? ' Low energy mode: tiny effort counts.' : '';

  return (
    <MotiView
      from={reduceMotion ? { opacity: 1, translateY: 0 } : { opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: reduceMotion ? 0 : 320 }}>
      <Pressable
        onPress={onToggleComplete}
        accessibilityRole="button"
        accessibilityState={{ selected: completed }}
        accessibilityLabel={
          completed ? `${title}, completed.${a11yLow}` : `${title}, mark complete.${a11yLow}`
        }
        className={`rounded-habit border border-neutral-100 bg-surface-card p-5 shadow-sm dark:border-white/10 dark:bg-dark-surface ${
          completed ? 'opacity-90' : ''
        }`}>
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text
              className={`text-lg font-semibold text-content-primary dark:text-dark-text ${
                completed ? 'line-through opacity-70' : ''
              }`}>
              {title}
            </Text>
            {lowEnergyActive ? (
              <Text className="mt-2 text-sm leading-5 text-content-secondary dark:text-dark-text/80">
                Gentle mode: even a few seconds counts toward your streak.
              </Text>
            ) : null}
            <View className="mt-3 flex-row gap-1.5">
              {Array.from({ length: progressTotal }).map((_, i) => (
                <View
                  key={`dot-${habit.id}-${i}`}
                  className={`h-2 flex-1 max-w-[36px] rounded-full ${
                    i < progressDone ? 'bg-accent-success' : 'bg-background-gray dark:bg-white/15'
                  }`}
                />
              ))}
            </View>
          </View>
          <View
            className={`h-14 min-w-[56px] items-center justify-center rounded-button px-4 ${
              completed ? 'bg-accent-success/20' : 'bg-primary dark:bg-dark-primary'
            }`}>
            {completed ? (
              <FontAwesome name="check" size={22} color="#73C45E" />
            ) : (
              <Text className="text-[15px] font-semibold text-white">Done</Text>
            )}
          </View>
        </View>
      </Pressable>
    </MotiView>
  );
}
