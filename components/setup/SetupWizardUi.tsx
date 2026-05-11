import { Pressable, Text, TextInput, View } from 'react-native';

import { SETUP_SUGGESTED_HABITS, SETUP_STEP_TITLES } from '@/constants/setup-flow';
import type { SetupFormFields } from '@/lib/user-setup';
import { USER_SETUP_ENERGY_OPTIONS, type UserSetupEnergy } from '@/types/user-setup';

export function SetupProgressHeader({ step }: { step: number }) {
  const progress = ((step + 1) / SETUP_STEP_TITLES.length) * 100;
  return (
    <>
      <Text className="text-sm font-medium text-content-secondary dark:text-dark-text/80">
        Step {step + 1} of {SETUP_STEP_TITLES.length}
      </Text>
      <View className="mt-3 h-2 overflow-hidden rounded-full bg-background-off dark:bg-dark-surface">
        <View className="h-2 rounded-full bg-primary dark:bg-dark-primary" style={{ width: `${progress}%` }} />
      </View>

      <Text className="mt-8 text-3xl font-bold tracking-tight text-content-primary dark:text-dark-text">
        {SETUP_STEP_TITLES[step]}
      </Text>
    </>
  );
}

type StepBodyProps = {
  step: number;
  fields: SetupFormFields;
  onChange: (patch: Partial<SetupFormFields>) => void;
  /** When true, preferences step shows copy about habit sync (edit-setup flow). */
  showPreferencesFooter?: boolean;
};

export function SetupStepBody({ step, fields, onChange, showPreferencesFooter }: StepBodyProps) {
  const { identity, habitGoal, tinyTitle, reminderTime, energy } = fields;

  if (step === 0) {
    return (
      <View className="mt-5 gap-3">
        <Text className="text-base leading-6 text-content-secondary dark:text-dark-text/80">
          Who do you want to become?
        </Text>
        <TextInput
          value={identity}
          onChangeText={(t) => onChange({ identity: t })}
          placeholder="A calm and consistent person"
          placeholderTextColor="#A0A0AE"
          className="rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base text-content-primary dark:border-dark-surface dark:bg-dark-surface dark:text-dark-text"
        />
      </View>
    );
  }

  if (step === 1) {
    return (
      <View className="mt-5 gap-4">
        <Text className="text-base leading-6 text-content-secondary dark:text-dark-text/80">
          What would that person do daily?
        </Text>
        <TextInput
          value={habitGoal}
          onChangeText={(t) => onChange({ habitGoal: t })}
          placeholder="Take a short walk after lunch"
          placeholderTextColor="#A0A0AE"
          className="rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base text-content-primary dark:border-dark-surface dark:bg-dark-surface dark:text-dark-text"
        />
        <View className="flex-row flex-wrap gap-2">
          {SETUP_SUGGESTED_HABITS.map((item) => (
            <Pressable
              key={item}
              onPress={() => onChange({ habitGoal: item })}
              className="rounded-full border border-neutral-200 bg-white px-3 py-2 dark:border-dark-surface dark:bg-dark-surface">
              <Text className="text-sm text-content-secondary dark:text-dark-text/80">{item}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  if (step === 2) {
    return (
      <View className="mt-5 gap-3">
        <Text className="text-base leading-6 text-content-secondary dark:text-dark-text/80">
          Make it tiny so it is easy to keep.
        </Text>
        <TextInput
          value={tinyTitle}
          onChangeText={(t) => onChange({ tinyTitle: t })}
          placeholder="Just 2 minutes"
          placeholderTextColor="#A0A0AE"
          className="rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base text-content-primary dark:border-dark-surface dark:bg-dark-surface dark:text-dark-text"
        />
      </View>
    );
  }

  return (
    <View className="mt-5 gap-5">
      <View className="gap-2">
        <Text className="text-base leading-6 text-content-secondary dark:text-dark-text/80">Reminder time</Text>
        <TextInput
          value={reminderTime}
          onChangeText={(t) => onChange({ reminderTime: t })}
          placeholder="08:00"
          placeholderTextColor="#A0A0AE"
          className="rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base text-content-primary dark:border-dark-surface dark:bg-dark-surface dark:text-dark-text"
        />
      </View>
      <View className="gap-3">
        <Text className="text-base leading-6 text-content-secondary dark:text-dark-text/80">Energy preference</Text>
        <View className="flex-row gap-2">
          {USER_SETUP_ENERGY_OPTIONS.map((option) => {
            const selected = energy === option;
            return (
              <Pressable
                key={option}
                onPress={() => onChange({ energy: option as UserSetupEnergy })}
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
      {showPreferencesFooter ? (
        <Text className="text-sm leading-5 text-content-muted dark:text-dark-text/60">
          Saving updates your setup. If you have one primary habit from onboarding, its title and details on Today will
          match this too — your completion history is kept.
        </Text>
      ) : null}
    </View>
  );
}

type NavProps = {
  step: number;
  canContinue: boolean;
  lastStepPrimaryLabel: 'Finish' | 'Save';
  onBack: () => void;
  onPrimary: () => void;
};

export function SetupNavRow({ step, canContinue, lastStepPrimaryLabel, onBack, onPrimary }: NavProps) {
  const isLast = step === SETUP_STEP_TITLES.length - 1;
  return (
    <View className="mt-10 flex-row gap-3">
      <Pressable
        onPress={onBack}
        disabled={step === 0}
        className="h-14 flex-1 items-center justify-center rounded-button border border-neutral-200 bg-white disabled:opacity-50 dark:border-dark-surface dark:bg-dark-surface">
        <Text className="text-base font-semibold text-content-secondary dark:text-dark-text/80">Back</Text>
      </Pressable>
      <Pressable
        onPress={onPrimary}
        disabled={!canContinue}
        className="h-14 flex-1 items-center justify-center rounded-button bg-primary disabled:opacity-60 dark:bg-dark-primary">
        <Text className="text-base font-semibold text-white">
          {isLast ? lastStepPrimaryLabel : 'Continue'}
        </Text>
      </Pressable>
    </View>
  );
}
