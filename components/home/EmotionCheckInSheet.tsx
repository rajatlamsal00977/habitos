import { MotiView } from 'moti';
import { Modal, Pressable, Text, View } from 'react-native';

type Props = {
  visible: boolean;
  habitTitle: string;
  reduceMotion: boolean;
  onSelect: (score: -1 | 0 | 1) => void;
  onSkip: () => void;
};

export function EmotionCheckInSheet({ visible, habitTitle, reduceMotion, onSelect, onSkip }: Props) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onSkip}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss check-in"
        className="flex-1 justify-end bg-black/40"
        onPress={onSkip}>
        <Pressable
          accessibilityRole="none"
          className="rounded-t-[28px] bg-white px-6 pb-10 pt-6 dark:bg-dark-surface"
          onPress={(e) => e.stopPropagation()}>
          <MotiView
            from={reduceMotion ? { opacity: 1, translateY: 0 } : { opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: reduceMotion ? 0 : 240 }}>
            <Text className="text-center text-lg font-bold text-content-primary dark:text-dark-text">
              How do you feel?
            </Text>
            <Text className="mt-2 text-center text-sm leading-5 text-content-secondary dark:text-dark-text/80">
              After &quot;{habitTitle}&quot; — optional; helps Bloom stay gentle over time.
            </Text>
            <View className="mt-6 gap-3">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Feeling worse"
                onPress={() => onSelect(-1)}
                className="rounded-button border border-neutral-200 bg-background-off py-3.5 dark:border-white/15 dark:bg-dark-bg">
                <Text className="text-center text-base font-semibold text-content-primary dark:text-dark-text">
                  Worse
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Feeling the same"
                onPress={() => onSelect(0)}
                className="rounded-button border border-neutral-200 bg-background-off py-3.5 dark:border-white/15 dark:bg-dark-bg">
                <Text className="text-center text-base font-semibold text-content-primary dark:text-dark-text">
                  Same
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Feeling better"
                onPress={() => onSelect(1)}
                className="rounded-button bg-primary py-3.5 dark:bg-dark-primary">
                <Text className="text-center text-base font-semibold text-white">Better</Text>
              </Pressable>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Skip emotional check-in"
              onPress={onSkip}
              className="mt-5 py-2">
              <Text className="text-center text-sm font-medium text-content-muted dark:text-dark-text/60">
                Skip
              </Text>
            </Pressable>
          </MotiView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
