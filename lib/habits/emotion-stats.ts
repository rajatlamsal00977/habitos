import { localDateKey } from '@/lib/habits/dates';
import type { HabitCompletion } from '@/types/habit';

export type EmotionWeekSummary = {
  better: number;
  same: number;
  worse: number;
  unanswered: number;
};

/** Last 7 local days including today; maps emotionScore -1 / 0 / 1 to worse / same / better. */
export function emotionSummaryLastDays(completions: HabitCompletion[], days = 7, now = new Date()): EmotionWeekSummary {
  const today = new Date(now);
  const allowed = new Set<string>();
  for (let i = 0; i < days; i += 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    allowed.add(localDateKey(d));
  }

  const summary: EmotionWeekSummary = { better: 0, same: 0, worse: 0, unanswered: 0 };

  for (const c of completions) {
    if (!allowed.has(c.dateKey)) continue;
    if (c.emotionScore === 1) summary.better += 1;
    else if (c.emotionScore === 0) summary.same += 1;
    else if (c.emotionScore === -1) summary.worse += 1;
    else summary.unanswered += 1;
  }

  return summary;
}
