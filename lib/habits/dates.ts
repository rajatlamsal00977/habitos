/** Local calendar day YYYY-MM-DD (device timezone). */
export function localDateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addLocalDays(date: Date, delta: number): Date {
  const out = new Date(date);
  out.setDate(out.getDate() + delta);
  return out;
}

/** Oldest → newest: last `count` local days ending at `end` (inclusive). */
export function rollingDayKeysOldestFirst(end: Date, count: number): string[] {
  const keys: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    keys.push(localDateKey(addLocalDays(end, -i)));
  }
  return keys;
}

/** Streak of consecutive local days with ≥1 completion, anchored on today or yesterday. */
export function streakFromDateKeys(allDateKeys: string[]): number {
  const set = new Set(allDateKeys);
  let anchor = new Date();
  let key = localDateKey(anchor);
  if (!set.has(key)) {
    anchor = addLocalDays(anchor, -1);
    key = localDateKey(anchor);
    if (!set.has(key)) return 0;
  }
  let streak = 0;
  while (set.has(key)) {
    streak++;
    anchor = addLocalDays(anchor, -1);
    key = localDateKey(anchor);
  }
  return streak;
}

function completionsForHabitOnDay(
  completions: { habitId: string; dateKey: string }[],
  habitId: string,
  dateKey: string,
): boolean {
  return completions.some((c) => c.habitId === habitId && c.dateKey === dateKey);
}

/**
 * Consecutive local days ending today/yesterday where every habit in `habitIds`
 * has a completion (PRD-style “kept today’s commitments”).
 */
export function globalCommitmentStreak(
  habitIds: string[],
  completions: { habitId: string; dateKey: string }[],
  now: Date = new Date(),
): number {
  if (habitIds.length === 0) return 0;

  const allDone = (dateKey: string) =>
    habitIds.every((id) => completionsForHabitOnDay(completions, id, dateKey));

  let anchor = new Date(now);
  let key = localDateKey(anchor);
  if (!allDone(key)) {
    anchor = addLocalDays(anchor, -1);
    key = localDateKey(anchor);
    if (!allDone(key)) return 0;
  }

  let streak = 0;
  while (allDone(key)) {
    streak++;
    anchor = addLocalDays(anchor, -1);
    key = localDateKey(anchor);
  }
  return streak;
}
