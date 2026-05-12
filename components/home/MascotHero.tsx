import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Text, useColorScheme, View } from 'react-native';

const MICROCOPY = [
  'Tiny steps still count.',
  "You're becoming more consistent.",
  'Growth happens daily.',
];

type Props = {
  streak: number;
  microcopyIndex?: number;
  reduceMotion?: boolean;
};

export function MascotHero({ streak, microcopyIndex = 0, reduceMotion = false }: Props) {
  const scheme = useColorScheme();
  const line = MICROCOPY[microcopyIndex % MICROCOPY.length];
  const gradientColors =
    scheme === 'dark'
      ? (['#2B2D42', '#3D3554'] as const)
      : (['#C9CBFF', '#FFD7C2'] as const);

  return (
    <View className="mt-6 overflow-hidden rounded-[32px] bg-surface-secondary/80 px-5 py-6 dark:bg-dark-surface/80">
      <View className="flex-row items-center gap-5">
        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: reduceMotion ? 1 : ([1, 1.04, 1] as const) }}
          transition={
            reduceMotion
              ? { type: 'timing', duration: 0 }
              : { type: 'timing', duration: 2800, loop: true }
          }>
          <LinearGradient
            colors={[...gradientColors]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 88,
              height: 88,
              borderRadius: 28,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text className="text-5xl" accessibilityLabel="Mascot placeholder">
              🌱
            </Text>
          </LinearGradient>
        </MotiView>
        <View className="flex-1">
          <Text className="text-xs font-semibold uppercase tracking-wide text-content-muted dark:text-dark-text/60">
            Day streak
          </Text>
          <Text className="mt-1 text-3xl font-bold text-content-primary dark:text-dark-text">{streak}</Text>
          <Text className="mt-3 text-base leading-6 text-content-secondary dark:text-dark-text/80">{line}</Text>
        </View>
      </View>
    </View>
  );
}
