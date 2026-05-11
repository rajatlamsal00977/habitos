# System Patterns

## Architecture direction

- **Mobile app** as primary surface; **Supabase Auth** for identity (email/password in app; session in **AsyncStorage** via `createClient` `auth.storage`); **guest mode** = AsyncStorage flag `habitos_guest_session`, cleared on real sign-in; **FastAPI + PostgreSQL** for domain data when backend is live (models in PRD: Users, Habits, Habit Completions, Streaks).
- **Routing:** `AuthGate` in `app/_layout.tsx` sends unauthenticated users to `/(auth)`; signed-in or guest users go to `/(onboarding)` until `ONBOARDING_COMPLETED_KEY`, then `/(tabs)`.
- **Habits (local MVP):** `useHabitStore` persists **v2** `{ habits, completions, userSetup }` to AsyncStorage (`habitos_habit_state_v1`, migrates from v1 on hydrate); onboarding finish always saves `userSetup` and seeds the first `Habit` (`fromOnboarding`) when none exist; **`applyUserSetupFromPayload`** updates `userSetup` + primary habit fields without clearing completions, or creates the first habit if the list is empty; modal **`/setup-preferences`** for edits (Profile + Today empty CTA); Today toggles create/remove same-day `HabitCompletion` rows (`emotionScore` reserved for Phase 6).

## Folder structure (PRD target)

```
/app
/components
/features
/hooks
/lib
/services
/store
/types
/utils
/assets
```

## State and UI

- **Zustand** for client state
- **NativeWind** for styling; tokens should trace to **`ui.json`** (colors, spacing, radii, shadows)
- **Reanimated + Moti** for motion; respect **reduced motion** where applicable

## Navigation

- **Expo Router** for file-based routes
- **Bottom navigation:** floating pill, glass/blur, rounded — active `#5B5CEB`, inactive `#6F6F7B` per `ui.json`

## Behavioral mapping (Atomic Habits)

| Principle   | UI patterns |
|------------|-------------|
| Obvious    | Large CTAs, clear progress, reminders, visibility of today’s habits |
| Attractive | Mascot, gradients, soft rewards, streak visuals |
| Easy       | One-tap complete, swipe where appropriate, low-energy mode |
| Satisfying | Completion animations, emotional reinforcement, streak growth |

## Notifications

- **Gentle, identity-based** copy; avoid guilt/shame (examples in PRD §20).

## Accessibility

- Dark mode: use **`ui.json` dark** tokens (`#12131A` background, `#1B1C24` surface, `#7D7EFF` primary, `#F5F5F7` text)
- Dynamic type, screen readers, high-contrast text, reduced motion
