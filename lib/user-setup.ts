import type { Habit, HabitDifficulty } from '@/types/habit';
import type { UserSetup, UserSetupEnergy } from '@/types/user-setup';

export function mapEnergyToDifficulty(energy: UserSetupEnergy): HabitDifficulty {
  if (energy === 'Low') return 'easy';
  if (energy === 'High') return 'challenging';
  return 'medium';
}

export function mapDifficultyToEnergy(d: HabitDifficulty): UserSetupEnergy {
  if (d === 'easy') return 'Low';
  if (d === 'challenging') return 'High';
  return 'Medium';
}

export function payloadToUserSetup(payload: {
  identity: string;
  habitGoal: string;
  tinyTitle: string;
  reminderTime: string;
  energy: UserSetupEnergy;
}): UserSetup {
  return {
    ...payload,
    updatedAt: new Date().toISOString(),
  };
}

/** Prefer explicit `fromOnboarding`; else single habit counts as primary for setup sync. */
export function primaryHabitForSetup(habits: Habit[]): Habit | null {
  const flagged = habits.filter((h) => h.fromOnboarding);
  if (flagged.length === 1) return flagged[0];
  if (flagged.length > 1) {
    return [...flagged].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )[0];
  }
  if (habits.length === 1) return habits[0];
  return null;
}

export function deriveUserSetupFromHabits(habits: Habit[]): UserSetup | null {
  const h = primaryHabitForSetup(habits);
  if (!h) return null;
  return payloadToUserSetup({
    identity: h.identityCategory,
    habitGoal: h.cue,
    tinyTitle: h.title,
    reminderTime: h.reminderTime,
    energy: mapDifficultyToEnergy(h.difficulty),
  });
}

export type SetupFormFields = {
  identity: string;
  habitGoal: string;
  tinyTitle: string;
  reminderTime: string;
  energy: UserSetupEnergy;
};

export function userSetupToFormFields(userSetup: UserSetup | null, habits: Habit[]): SetupFormFields {
  if (userSetup) {
    return {
      identity: userSetup.identity,
      habitGoal: userSetup.habitGoal,
      tinyTitle: userSetup.tinyTitle,
      reminderTime: userSetup.reminderTime,
      energy: userSetup.energy,
    };
  }
  const d = deriveUserSetupFromHabits(habits);
  if (d) {
    return {
      identity: d.identity,
      habitGoal: d.habitGoal,
      tinyTitle: d.tinyTitle,
      reminderTime: d.reminderTime,
      energy: d.energy,
    };
  }
  return {
    identity: '',
    habitGoal: '',
    tinyTitle: '',
    reminderTime: '08:00',
    energy: 'Medium',
  };
}
