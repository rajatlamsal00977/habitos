# Active Context

## Current focus

- **Phase 0 complete:** Memory bank initialized from `prd.md` and `ui.json`.
- **Phase 1 complete:** Expo ~54 + Expo Router tabs app in repo root; NativeWind v4 with **Tailwind CSS v3.4.x** (NativeWind 4.x does not support Tailwind v4); Zustand + Moti installed; `lib/theme` reads `ui.json`; PRD tab names (Today, Journey, Insights, Profile); `prd.md` restored after scaffold merge.
- **Phase 2 complete:** Supabase Auth (`@supabase/supabase-js` + AsyncStorage persistence + `react-native-url-polyfill`); `app/(auth)/` welcome, login, sign-up; guest mode via `GUEST_SESSION_KEY` in AsyncStorage; `AuthProvider` + `AuthGate` in root layout; Profile sign-out / leave guest; `.env.example` for `EXPO_PUBLIC_SUPABASE_*`.
- **Phase 3 complete:** Onboarding flow in `app/(onboarding)/` with four-step identity-first journey (identity, daily habit, tiny version, preferences), AsyncStorage completion gate via `ONBOARDING_COMPLETED_KEY`, and route orchestration in `AuthGate` (`(auth)` -> `(onboarding)` -> `(tabs)`).
- **Phase 4 complete:** Today home layout (PRD §7 + `ui.json` home pattern): soft layered gradients, header (greeting, streak, points, avatar → Profile), mascot hero with Moti + gradient tile, low-energy chip, up to three habit cards with progress bars and Done toggle; floating pill tab bar with blur (`expo-blur`), glass-style fill, and shared spacing via `constants/layout` + `useTabBarContentPadding`.

## Immediate next step (pending user approval)

- **Phase 5:** Habit domain + persistence (PRD §8 and data models).

## Working agreements

- Ask **user permission before executing each phase** (per user instruction).
- Do **not** invent a conflicting visual language — implement from **`ui.json`**.
- Keep diffs focused; no drive-by refactors unrelated to the requested phase.

## Open decisions (to resolve in later phases)

- Whether **FastAPI + PostgreSQL** ships in MVP or after local-first MVP
- Supabase project setup and env handling
- Asset pipeline for mascot illustrations (placeholders vs. final art)

## Recent changes

- Created `memory-bank/` with six core documents (Phase 0).
- Phase 1: Expo app, NativeWind + Tailwind 3, theme from `ui.json`, four tabs; `prd.md` restored to full PRD text after merge left an empty file on disk.
- Phase 3: Added onboarding route group and screen, completion persistence, and auth/onboarding/tab routing gate in `contexts/auth-context.tsx`.
- Phase 4: Home components under `components/home/`, Today screen polish, floating tab bar in `app/(tabs)/_layout.tsx`, `expo-blur` + `expo-linear-gradient`.
