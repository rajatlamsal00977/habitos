import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTabBarContentPadding } from '@/hooks/useTabBarContentPadding';

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const bottomPad = useTabBarContentPadding();

  return (
    <View
      className="flex-1 items-center justify-center bg-background-off px-6 dark:bg-dark-bg"
      style={{ paddingTop: insets.top + 24, paddingBottom: bottomPad }}>
      <Text className="text-center font-semibold text-2xl text-content-primary dark:text-dark-text">
        Insights
      </Text>
      <Text className="mt-3 max-w-sm text-center text-base text-content-secondary dark:text-dark-text/80">
        Streaks, emotion trends, and gentle analytics will appear here.
      </Text>
    </View>
  );
}
