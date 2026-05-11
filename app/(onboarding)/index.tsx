import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/auth-context';

const STEP_TITLES = ['Identity', 'Daily rhythm', 'Tiny start', 'Preferences'] as const;
const SUGGESTED_HABITS = ['Drink water', 'Stretch for 2 mins', 'Read one page', 'Plan your top 1'];
const ENERGY_OPTIONS = ['Low', 'Medium', 'High'] as const;

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useAuth();
  const [step, setStep] = useState(0);
  const [identity, setIdentity] = useState('');
  const [habit, setHabit] = useState('');
  const [tinyVersion, setTinyVersion] = useState('');
  const [reminderTime, setReminderTime] = useState('08:00');
  const [energy, setEnergy] = useState<(typeof ENERGY_OPTIONS)[number]>('Medium');

  const progress = useMemo(() => ((step + 1) / STEP_TITLES.length) * 100, [step]);

  const canContinue =
    (step === 0 && identity.trim().length > 1) ||
    (step === 1 && habit.trim().length > 1) ||
    (step === 2 && tinyVersion.trim().length > 1) ||
    step === 3;

  async function onContinue() {
    if (step < STEP_TITLES.length - 1) {
      setStep((current) => current + 1);
      return;
    }
    await completeOnboarding();
  }

  return (
    <ScrollView
      className="flex-1 bg-background-cream px-6 dark:bg-dark-bg"
      contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: insets.bottom + 24 }}>
      <Text className="text-sm font-medium text-content-secondary dark:text-dark-text/80">
        Step {step + 1} of {STEP_TITLES.length}
      </Text>
      <View className="mt-3 h-2 overflow-hidden rounded-full bg-background-off dark:bg-dark-surface">
        <View className="h-2 rounded-full bg-primary dark:bg-dark-primary" style={{ width: `${progress}%` }} />
      </View>

      <Text className="mt-8 text-3xl font-bold tracking-tight text-content-primary dark:text-dark-text">
        {STEP_TITLES[step]}
      </Text>

      {step === 0 ? (
        <View className="mt-5 gap-3">
          <Text className="text-base leading-6 text-content-secondary dark:text-dark-text/80">
            Who do you want to become?
          </Text>
          <TextInput
            value={identity}
            onChangeText={setIdentity}
            placeholder="A calm and consistent person"
            placeholderTextColor="#A0A0AE"
            className="rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base text-content-primary dark:border-dark-surface dark:bg-dark-surface dark:text-dark-text"
          />
        </View>
      ) : null}

      {step === 1 ? (
        <View className="mt-5 gap-4">
          <Text className="text-base leading-6 text-content-secondary dark:text-dark-text/80">
            What would that person do daily?
          </Text>
          <TextInput
            value={habit}
            onChangeText={setHabit}
            placeholder="Take a short walk after lunch"
            placeholderTextColor="#A0A0AE"
            className="rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base text-content-primary dark:border-dark-surface dark:bg-dark-surface dark:text-dark-text"
          />
          <View className="flex-row flex-wrap gap-2">
            {SUGGESTED_HABITS.map((item) => (
              <Pressable
                key={item}
                onPress={() => setHabit(item)}
                className="rounded-full border border-neutral-200 bg-white px-3 py-2 dark:border-dark-surface dark:bg-dark-surface">
                <Text className="text-sm text-content-secondary dark:text-dark-text/80">{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      {step === 2 ? (
        <View className="mt-5 gap-3">
          <Text className="text-base leading-6 text-content-secondary dark:text-dark-text/80">
            Make it tiny so it is easy to keep.
          </Text>
          <TextInput
            value={tinyVersion}
            onChangeText={setTinyVersion}
            placeholder="Just 2 minutes"
            placeholderTextColor="#A0A0AE"
            className="rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base text-content-primary dark:border-dark-surface dark:bg-dark-surface dark:text-dark-text"
          />
        </View>
      ) : null}

      {step === 3 ? (
        <View className="mt-5 gap-5">
          <View className="gap-2">
            <Text className="text-base leading-6 text-content-secondary dark:text-dark-text/80">
              Reminder time
            </Text>
            <TextInput
              value={reminderTime}
              onChangeText={setReminderTime}
              placeholder="08:00"
              placeholderTextColor="#A0A0AE"
              className="rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base text-content-primary dark:border-dark-surface dark:bg-dark-surface dark:text-dark-text"
            />
          </View>
          <View className="gap-3">
            <Text className="text-base leading-6 text-content-secondary dark:text-dark-text/80">Energy preference</Text>
            <View className="flex-row gap-2">
              {ENERGY_OPTIONS.map((option) => {
                const selected = energy === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => setEnergy(option)}
                    className={`rounded-full px-4 py-2 ${
                      selected
                        ? 'bg-primary dark:bg-dark-primary'
                        : 'border border-neutral-200 bg-white dark:border-dark-surface dark:bg-dark-surface'
                    }`}>
                    <Text className={selected ? 'font-semibold text-white' : 'text-content-secondary dark:text-dark-text/80'}>
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      ) : null}

      <View className="mt-10 flex-row gap-3">
        <Pressable
          onPress={() => setStep((current) => Math.max(0, current - 1))}
          disabled={step === 0}
          className="h-14 flex-1 items-center justify-center rounded-button border border-neutral-200 bg-white disabled:opacity-50 dark:border-dark-surface dark:bg-dark-surface">
          <Text className="text-base font-semibold text-content-secondary dark:text-dark-text/80">Back</Text>
        </Pressable>
        <Pressable
          onPress={onContinue}
          disabled={!canContinue}
          className="h-14 flex-1 items-center justify-center rounded-button bg-primary disabled:opacity-60 dark:bg-dark-primary">
          <Text className="text-base font-semibold text-white">{step === STEP_TITLES.length - 1 ? 'Finish' : 'Continue'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
