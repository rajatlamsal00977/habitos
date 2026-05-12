import type { UserSetup } from '@/types/user-setup';

export type HabitFrequency = 'daily';

export type HabitDifficulty = 'easy' | 'medium' | 'challenging';

/** Mirrors PRD §8 + DB habits table; stored locally until backend sync. */
export type Habit = {
  id: string;
  title: string;
  identityCategory: string;
  frequency: HabitFrequency;
  reminderTime: string;
  cue: string;
  difficulty: HabitDifficulty;
  createdAt: string;
  /** Seeded from first onboarding finish; used when applying setup edits. */
  fromOnboarding?: boolean;
};

/** Mirrors PRD habit completions. Check-in: `-1` worse, `0` same, `1` better, `null` skipped. */
export type HabitCompletion = {
  id: string;
  habitId: string;
  /** Local calendar day YYYY-MM-DD when the habit was marked done. */
  dateKey: string;
  completedAt: string;
  emotionScore: number | null;
};

export type HabitPersistedStateV1 = {
  version: 1;
  habits: Habit[];
  completions: HabitCompletion[];
};

export type HabitPersistedStateV2 = {
  version: 2;
  habits: Habit[];
  completions: HabitCompletion[];
  /** Last saved onboarding-style setup; may exist before first habit is seeded. */
  userSetup: UserSetup | null;
  /** When equal to today's local date key, low-energy framing is active for that day. */
  lowEnergyDateKey?: string | null;
};
