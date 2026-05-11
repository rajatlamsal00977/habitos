import { useFocusEffect } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SetupNavRow, SetupProgressHeader, SetupStepBody } from '@/components/setup/SetupWizardUi';
import { SETUP_STEP_TITLES } from '@/constants/setup-flow';
import type { SetupFormFields } from '@/lib/user-setup';
import { userSetupToFormFields } from '@/lib/user-setup';
import { useHabitStore } from '@/store/useHabitStore';

export default function SetupPreferencesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [fields, setFields] = useState<SetupFormFields>({
    identity: '',
    habitGoal: '',
    tinyTitle: '',
    reminderTime: '08:00',
    energy: 'Medium',
  });

  const patchFields = useCallback((patch: Partial<SetupFormFields>) => {
    setFields((prev) => ({ ...prev, ...patch }));
  }, []);

  const rehydrateFields = useCallback(() => {
    const { userSetup, habits } = useHabitStore.getState();
    setFields(userSetupToFormFields(userSetup, habits));
    setStep(0);
  }, []);

  useFocusEffect(
    useCallback(() => {
      rehydrateFields();
    }, [rehydrateFields]),
  );

  const { identity, habitGoal, tinyTitle, reminderTime, energy } = fields;

  const canContinue =
    (step === 0 && identity.trim().length > 1) ||
    (step === 1 && habitGoal.trim().length > 1) ||
    (step === 2 && tinyTitle.trim().length > 1) ||
    step === 3;

  function onPrimary() {
    if (step < SETUP_STEP_TITLES.length - 1) {
      setStep((current) => current + 1);
      return;
    }
    useHabitStore.getState().applyUserSetupFromPayload({
      identity: identity.trim(),
      habitGoal: habitGoal.trim(),
      tinyTitle: tinyTitle.trim(),
      reminderTime: reminderTime.trim() || '08:00',
      energy,
    });
    router.back();
  }

  return (
    <>
      <Stack.Screen options={{ headerBackTitle: 'Close' }} />
      <ScrollView
        className="flex-1 bg-background-cream px-6 dark:bg-dark-bg"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: insets.bottom + 24 }}>
        <SetupProgressHeader step={step} />
        <SetupStepBody step={step} fields={fields} onChange={patchFields} showPreferencesFooter />

        <SetupNavRow
          step={step}
          canContinue={canContinue}
          lastStepPrimaryLabel="Save"
          onBack={() => setStep((current) => Math.max(0, current - 1))}
          onPrimary={onPrimary}
        />
      </ScrollView>
    </>
  );
}
