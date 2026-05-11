import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, Text, useColorScheme, View } from 'react-native';

import Colors from '@/constants/Colors';

type Props = {
  greeting: string;
  streak: number;
  points: number;
  onAvatarPress?: () => void;
};

export function HomeHeader({ greeting, streak, points, onAvatarPress }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const tint = Colors[scheme].tint;

  return (
    <View className="flex-row items-start justify-between">
      <View className="flex-1 pr-4">
        <Text className="text-base font-medium text-content-secondary dark:text-dark-text/80">{greeting}</Text>
        <Text className="mt-1 text-2xl font-bold tracking-tight text-content-primary dark:text-dark-text">
          Today
        </Text>
      </View>
      <View className="flex-row items-center gap-3">
        <View className="items-end rounded-2xl bg-white/80 px-3 py-2 dark:bg-dark-surface/90">
          <Text className="text-[11px] font-semibold uppercase tracking-wide text-content-muted dark:text-dark-text/60">
            Streak
          </Text>
          <Text className="text-lg font-bold text-accent-warning">{streak}</Text>
        </View>
        <View className="items-end rounded-2xl bg-white/80 px-3 py-2 dark:bg-dark-surface/90">
          <Text className="text-[11px] font-semibold uppercase tracking-wide text-content-muted dark:text-dark-text/60">
            Points
          </Text>
          <Text className="text-lg font-bold text-primary dark:text-dark-primary">{points}</Text>
        </View>
        <Pressable
          onPress={onAvatarPress}
          accessibilityRole="button"
          accessibilityLabel="Profile"
          className="h-12 w-12 items-center justify-center rounded-full bg-surface-secondary dark:bg-dark-surface">
          <FontAwesome name="user" size={20} color={tint} />
        </Pressable>
      </View>
    </View>
  );
}
