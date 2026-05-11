import { localDateKey, rollingDayKeysOldestFirst } from '@/lib/habits/dates';
import type { HabitCardItem } from '@/types/habit-card';
import type { Habit, HabitCompletion } from '@/types/habit';

export function habitToCardItem(habit: Habit, completions: HabitCompletion[], now: Date = new Date()): HabitCardItem {
  const todayKey = localDateKey(now);
  const windowKeys = rollingDayKeysOldestFirst(now, 3);
  const keySet = new Set(completions.filter((c) => c.habitId === habit.id).map((c) => c.dateKey));
  const progressDone = windowKeys.filter((k) => keySet.has(k)).length;

  return {
    id: habit.id,
    title: habit.title,
    progressDone,
    progressTotal: 3,
    completed: keySet.has(todayKey),
  };
}

export function highlightedHabitCards(
  habits: Habit[],
  completions: HabitCompletion[],
  max: number,
  now?: Date,
): HabitCardItem[] {
  const t = now ?? new Date();
  const sorted = [...habits].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  return sorted.slice(0, max).map((h) => habitToCardItem(h, completions, t));
}
