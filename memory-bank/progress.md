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

## What is not built yet

- Backend API and database migrations
- Supabase project integration in app
- Mascot assets and animation integration
- Notification scheduling and copy implementation

## Known issues / risks

- None in code yet — greenfield

## Next milestones (phased; require user approval each phase)

1. **Phase 1:** Bootstrap app + design token wiring (completed)
2. **Phase 2:** Auth shell (Supabase) (completed)
3. **Phase 3:** Onboarding flow (completed)
4. **Phase 4:** Home + tab navigation (completed)
5. **Phase 5:** Habit domain + persistence (next)
6. **Phase 6:** Low-energy mode, emotional check-in, notifications, a11y hardening
