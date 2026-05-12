# Progress

## What exists

- **Product requirements:** `prd.md` (Bloom MVP scope, flows, philosophy, data models, notifications)
- **Design system:** `ui.json` (palette, type, spacing, components, motion, screen patterns, dark mode)
- **Memory bank:** `memory-bank/` core files for cross-session context
- **App scaffold:** Expo Router, TypeScript, NativeWind (`global.css` + `tailwind.config.js` + `metro.config.js` + `babel.config.js`), Reanimated, Moti, Zustand
- **Theme:** `lib/theme/tokens.ts` imports `ui.json`; Tailwind `theme.extend.colors` mirrors key palette + dark tokens
- **Navigation:** Four tabs matching PRD (`app/(tabs)/` — Today, Journey, Insights, Profile)
- **Placeholder store:** `store/useAppStore.ts`
- **Auth:** `lib/supabase.ts`, `contexts/auth-context.tsx` (`AuthProvider`, `AuthGate`, `useAuth`), `app/(auth)/` (welcome, login, sign-up), guest session flag, Profile account actions
- **Onboarding:** `app/(onboarding)/` four-step flow with identity-first prompts, suggestions, tiny-habit setup, preference capture; completion persisted using `ONBOARDING_COMPLETED_KEY` and enforced in `AuthGate`
- **Home + tabs:** Today screen matches PRD header / hero / habits; floating glass pill tab bar (`expo-blur`); `components/home/*`, `hooks/useTabBarContentPadding`, `constants/layout` for bar overlap; Journey / Insights / Profile respect bottom inset above bar
- **Habits (local):** `types/habit.ts`, `types/habit-card.ts`, `constants/habit-storage.ts`, `lib/habits/dates.ts`, `lib/habits/view-model.ts`, `store/useHabitStore.ts`; completions with `emotionScore: null` for Phase 6; onboarding seeds one daily habit; Today persists Done toggles and derives 3-day dots + commitment streak
- **Editable setup (Phase 7):** `types/user-setup.ts`, `constants/setup-flow.ts`, `lib/user-setup.ts`, shared wizard UI in `components/setup/SetupWizardUi.tsx`; persisted `userSetup` in habit state **v2** (migrates from v1 on hydrate); `Habit.fromOnboarding`; `applyUserSetupFromPayload` updates primary habit + `userSetup`, creates first habit if none; modal route [`app/setup-preferences.tsx`](app/setup-preferences.tsx); Profile **Edit my setup**; Today empty-state CTA; `AuthGate` allows `setup-preferences` while onboarding incomplete edge case
- **Phase 6 — wellbeing + nudges:** Persisted `lowEnergyDateKey` (same-day gentle mode); [`components/home/EmotionCheckInSheet.tsx`](components/home/EmotionCheckInSheet.tsx) after marking done; `setCompletionEmotion` / `toggleLowEnergyToday` on [`store/useHabitStore.ts`](store/useHabitStore.ts); [`lib/notifications/daily-reminder.ts`](lib/notifications/daily-reminder.ts) + Profile **Daily nudge** switch (AsyncStorage pref, default off); tab layout sync on hydrate/habits/setup; [`lib/habits/emotion-stats.ts`](lib/habits/emotion-stats.ts) on Insights; reduced-motion aware [`components/home/MascotHero.tsx`](components/home/MascotHero.tsx) + [`components/home/HabitCard.tsx`](components/home/HabitCard.tsx)

## What is not built yet

- Backend API and database migrations
- Supabase project integration in app
- Mascot assets and animation integration

## Known issues / risks

- None in code yet — greenfield

## Next milestones (phased; require user approval each phase)

1. **Phase 1:** Bootstrap app + design token wiring (completed)
2. **Phase 2:** Auth shell (Supabase) (completed)
3. **Phase 3:** Onboarding flow (completed)
4. **Phase 4:** Home + tab navigation (completed)
5. **Phase 5:** Habit domain + persistence (completed)
6. **Phase 6:** Low-energy mode, emotional check-in, notifications, a11y hardening (completed)
7. **Phase 7:** Editable onboarding / setup preferences (completed)
