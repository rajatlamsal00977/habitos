import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { HABIT_STATE_STORAGE_KEY } from '@/constants/habit-storage';
import { globalCommitmentStreak, localDateKey } from '@/lib/habits/dates';
import { highlightedHabitCards } from '@/lib/habits/view-model';
import {
  deriveUserSetupFromHabits,
  mapEnergyToDifficulty,
  payloadToUserSetup,
  primaryHabitForSetup,
} from '@/lib/user-setup';
import type { HabitCardItem } from '@/types/habit-card';
import type { Habit, HabitCompletion, HabitPersistedStateV1, HabitPersistedStateV2 } from '@/types/habit';
import type { UserSetup, UserSetupEnergy } from '@/types/user-setup';

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function normalizeLegacyHabits(habits: Habit[]): Habit[] {
  if (habits.length === 1 && habits[0].fromOnboarding !== true) {
    return [{ ...habits[0], fromOnboarding: true }];
  }
  return habits;
}

type ReadResult = { data: HabitPersistedStateV2; migratedFromV1: boolean };

async function readPersisted(): Promise<ReadResult | null> {
  const raw = await AsyncStorage.getItem(HABIT_STATE_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as HabitPersistedStateV1 | HabitPersistedStateV2;
    if (!parsed || (parsed.version !== 1 && parsed.version !== 2)) return null;
    if (!Array.isArray(parsed.habits) || !Array.isArray(parsed.completions)) return null;

    if (parsed.version === 2) {
      const lowEnergyDateKey =
        typeof parsed.lowEnergyDateKey === 'string' ? parsed.lowEnergyDateKey : null;
      return {
        data: {
          version: 2,
          habits: normalizeLegacyHabits(parsed.habits),
          completions: parsed.completions,
          userSetup: parsed.userSetup ?? null,
          lowEnergyDateKey,
        },
        migratedFromV1: false,
      };
    }

    const habits = normalizeLegacyHabits(parsed.habits);
    const userSetup = deriveUserSetupFromHabits(habits);
    return {
      data: {
        version: 2,
        habits,
        completions: parsed.completions,
        userSetup,
        lowEnergyDateKey: null,
      },
      migratedFromV1: true,
    };
  } catch {
    return null;
  }
}

async function writePersisted(state: HabitPersistedStateV2): Promise<void> {
  await AsyncStorage.setItem(HABIT_STATE_STORAGE_KEY, JSON.stringify(state));
}

export type OnboardingHabitSeed = {
  identity: string;
  habitGoal: string;
  tinyTitle: string;
  reminderTime: string;
  energy: UserSetupEnergy;
};

export type ToggleCompletionResult = { added: boolean; completionId: string | null };

type HabitStore = {
  hydrated: boolean;
  habits: Habit[];
  completions: HabitCompletion[];
  userSetup: UserSetup | null;
  lowEnergyDateKey: string | null;
  hydrate: () => Promise<void>;
  /** Persists `userSetup` always; creates first habit only when none exist. */
  seedFromOnboarding: (payload: OnboardingHabitSeed) => void;
  /** Save setup from Profile / setup screen; updates primary habit fields when one exists. */
  applyUserSetupFromPayload: (payload: OnboardingHabitSeed) => void;
  toggleTodayCompletion: (habitId: string) => ToggleCompletionResult;
  /** Toggle low-energy framing for the current local day (PRD §10). */
  toggleLowEnergyToday: () => void;
  setCompletionEmotion: (completionId: string, score: -1 | 0 | 1) => void;
  todayCardItems: (max?: number, now?: Date) => HabitCardItem[];
  commitmentStreak: (now?: Date) => number;
};

function toV2(
  habits: Habit[],
  completions: HabitCompletion[],
  userSetup: UserSetup | null,
  lowEnergyDateKey: string | null,
): HabitPersistedStateV2 {
  return { version: 2, habits, completions, userSetup, lowEnergyDateKey };
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  hydrated: false,
  habits: [],
  completions: [],
  userSetup: null,
  lowEnergyDateKey: null,

  hydrate: async () => {
    const result = await readPersisted();
    if (result) {
      const { data, migratedFromV1 } = result;
      set({
        habits: data.habits,
        completions: data.completions,
        userSetup: data.userSetup,
        lowEnergyDateKey: data.lowEnergyDateKey ?? null,
        hydrated: true,
      });
      if (migratedFromV1) {
        await writePersisted(data);
      }
    } else {
      set({ habits: [], completions: [], userSetup: null, lowEnergyDateKey: null, hydrated: true });
    }
  },

  seedFromOnboarding: (payload) => {
    const { habits, completions, lowEnergyDateKey } = get();
    const userSetup = payloadToUserSetup({
      identity: payload.identity,
      habitGoal: payload.habitGoal,
      tinyTitle: payload.tinyTitle,
      reminderTime: payload.reminderTime,
      energy: payload.energy,
    });

    let nextHabits = [...habits];
    if (nextHabits.length === 0) {
      const habit: Habit = {
        id: makeId(),
        title: payload.tinyTitle,
        identityCategory: payload.identity,
        frequency: 'daily',
        reminderTime: payload.reminderTime,
        cue: payload.habitGoal,
        difficulty: mapEnergyToDifficulty(payload.energy),
        createdAt: new Date().toISOString(),
        fromOnboarding: true,
      };
      nextHabits = [habit];
    }

    const next = toV2(nextHabits, completions, userSetup, lowEnergyDateKey);
    set({ habits: next.habits, completions: next.completions, userSetup: next.userSetup, lowEnergyDateKey });
    void writePersisted(next);
  },

  applyUserSetupFromPayload: (payload) => {
    const { habits, completions, lowEnergyDateKey } = get();
    const userSetup = payloadToUserSetup({
      identity: payload.identity,
      habitGoal: payload.habitGoal,
      tinyTitle: payload.tinyTitle,
      reminderTime: payload.reminderTime,
      energy: payload.energy,
    });

    const primary = primaryHabitForSetup(habits);
    let nextHabits = [...habits];
    if (primary) {
      nextHabits = habits.map((h) =>
        h.id === primary.id
          ? {
              ...h,
              title: payload.tinyTitle,
              identityCategory: payload.identity,
              cue: payload.habitGoal,
              reminderTime: payload.reminderTime,
              difficulty: mapEnergyToDifficulty(payload.energy),
              fromOnboarding: h.fromOnboarding ?? true,
            }
          : h,
      );
    } else if (nextHabits.length === 0) {
      nextHabits = [
        {
          id: makeId(),
          title: payload.tinyTitle,
          identityCategory: payload.identity,
          frequency: 'daily',
          reminderTime: payload.reminderTime,
          cue: payload.habitGoal,
          difficulty: mapEnergyToDifficulty(payload.energy),
          createdAt: new Date().toISOString(),
          fromOnboarding: true,
        },
      ];
    }

    const next = toV2(nextHabits, completions, userSetup, lowEnergyDateKey);
    set({ habits: next.habits, completions: next.completions, userSetup: next.userSetup, lowEnergyDateKey });
    void writePersisted(next);
  },

  toggleTodayCompletion: (habitId) => {
    const { habits, completions, userSetup, lowEnergyDateKey } = get();
    if (!habits.some((h) => h.id === habitId)) {
      return { added: false, completionId: null };
    }

    const todayKey = localDateKey();
    const existing = completions.find((c) => c.habitId === habitId && c.dateKey === todayKey);

    let nextCompletions: HabitCompletion[];
    let result: ToggleCompletionResult = { added: false, completionId: null };

    if (existing) {
      nextCompletions = completions.filter((c) => c.id !== existing.id);
    } else {
      const row: HabitCompletion = {
        id: makeId(),
        habitId,
        dateKey: todayKey,
        completedAt: new Date().toISOString(),
        emotionScore: null,
      };
      nextCompletions = [...completions, row];
      result = { added: true, completionId: row.id };
    }

    const next = toV2(habits, nextCompletions, userSetup, lowEnergyDateKey);
    set({ completions: nextCompletions, userSetup: next.userSetup, lowEnergyDateKey });
    void writePersisted(next);
    return result;
  },

  toggleLowEnergyToday: () => {
    const { habits, completions, userSetup, lowEnergyDateKey } = get();
    const todayKey = localDateKey();
    const nextKey = lowEnergyDateKey === todayKey ? null : todayKey;
    const next = toV2(habits, completions, userSetup, nextKey);
    set({ lowEnergyDateKey: nextKey });
    void writePersisted(next);
  },

  setCompletionEmotion: (completionId, score) => {
    if (score !== -1 && score !== 0 && score !== 1) return;
    const { habits, completions, userSetup, lowEnergyDateKey } = get();
    if (!completions.some((c) => c.id === completionId)) return;
    const nextCompletions = completions.map((c) =>
      c.id === completionId ? { ...c, emotionScore: score } : c,
    );
    const next = toV2(habits, nextCompletions, userSetup, lowEnergyDateKey);
    set({ completions: nextCompletions });
    void writePersisted(next);
  },

  todayCardItems: (max = 3, now = new Date()) => {
    const { habits, completions } = get();
    return highlightedHabitCards(habits, completions, max, now);
  },

  commitmentStreak: (now = new Date()) => {
    const { habits, completions } = get();
    const ids = habits.map((h) => h.id);
    return globalCommitmentStreak(ids, completions, now);
  },
}));
