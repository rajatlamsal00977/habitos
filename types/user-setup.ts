export const USER_SETUP_ENERGY_OPTIONS = ['Low', 'Medium', 'High'] as const;

export type UserSetupEnergy = (typeof USER_SETUP_ENERGY_OPTIONS)[number];

/** Local-first fields mirrored from onboarding; editable anytime from Profile. */
export type UserSetup = {
  identity: string;
  habitGoal: string;
  tinyTitle: string;
  reminderTime: string;
  energy: UserSetupEnergy;
  updatedAt: string;
};
