# Tech Context

## Stack (from PRD + `ui.json` dev notes)

| Layer        | Choice |
|-------------|--------|
| Framework   | React Native via **Expo** |
| Routing     | **Expo Router** |
| Language    | **TypeScript** |
| Styling     | **NativeWind** (Tailwind for RN) |
| Animation   | **React Native Reanimated**, **Moti** |
| State       | **Zustand** |
| Push/local  | **Expo Notifications** |
| Auth        | **Supabase Auth** (`@supabase/supabase-js`, `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`; optional `expo.extra` in `app.json`) |
| API/DB      | **FastAPI**, **PostgreSQL** (when backend phase lands) |

## Design tokens (`ui.json` — reference in implementation)

- **Primary:** `#5B5CEB` (light `#7D7EFF`, soft `#C9CBFF`, gradient `#5B5CEB` → `#6E72FF`)
- **Backgrounds:** warm cream `#F5EBDD`, off-white `#F8F8F8`, card `#FFFFFF`, etc.
- **Accents:** success `#73C45E`, warning `#F4A261`, peach `#FFD7C2`, soft red `#E76F51`, reward gold `#FFC857`
- **Text:** primary `#2C2C36`, secondary `#6F6F7B`, muted `#A0A0AE`
- **Spacing:** screen padding 24, card 20, section 24, gap 16; radii small/medium/large/pill
- **Components:** primary button ~56px height, radius 18, gradient fill; habit card radius 28, soft shadow

## Development constraints

- **60fps**-friendly animations; glassmorphism **light** (blur + semi-transparent surfaces)
- Safe areas: respect notch / Dynamic Island / home indicator
- **Single primary action** per screen where possible

## Repository status

- **Docs:** `prd.md`, `ui.json`, `memory-bank/*`
- **App:** Expo ~54 in repo root; `npm run start` / `ios` / `android` / `web`
- **NativeWind note:** use **Tailwind CSS 3.4.x** with NativeWind 4.2.x (Tailwind v4 is not supported by this NativeWind release). Add **`react-native-css-interop`** as a **direct** dependency (same version as NativeWind’s nested one, e.g. 0.2.3) so Metro resolves `react-native-css-interop/jsx-runtime` when using `jsxImportSource: "nativewind"`.
