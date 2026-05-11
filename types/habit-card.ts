/** View model for `HabitCard` (Today list). */
export type HabitCardItem = {
  id: string;
  title: string;
  progressDone: number;
  progressTotal: number;
  completed: boolean;
};
