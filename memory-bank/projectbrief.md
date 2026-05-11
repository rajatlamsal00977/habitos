# Project Brief — Bloom (working title)

## Purpose

Build a **mobile-first habit formation app** grounded in behavioral psychology (Atomic Habits–style: identity, tiny steps, consistency over intensity). The product must feel like a **supportive companion**, not a guilt-driven streak tracker or generic task manager.

## Core goals

- **Retention** and daily engagement through emotional connection and simplicity
- **Consistency** over perfection; celebrate small wins
- **Premium, calm** UX: soft visuals, mascot, low cognitive load

## Non-goals (for tone and MVP discipline)

- Aggressive gamification, loud badges, competitive leaderboards
- Productivity-dashboard clutter or shame-based messaging

## Design authority

- **`/ui.json`** is the visual and interaction source of truth (colors, typography, spacing, motion, components, dark mode tokens).
- **`/prd.md`** is the product and scope source of truth.

## MVP scope (summary)

- Auth: sign up, login, guest mode (Supabase Auth)
- Onboarding: identity → daily habits → tiny habits → preferences
- Home: today-only focus, header, mascot hero, up to 3 habit cards, floating bottom nav (Today, Journey, Insights, Profile)
- Habit system: guided creation, properties per PRD (title, identity, frequency, reminder, cue, difficulty, emotional score, streak, history)
- Low energy mode, emotional check-in after completions, gentle notifications
- Accessibility: dark mode (warm/cozy), dynamic type, reduced motion, screen readers, contrast

## Tech direction (from PRD)

- **Client:** React Native, Expo Router, TypeScript, NativeWind, Reanimated, Moti, Zustand, Expo Notifications
- **Backend (MVP+):** FastAPI, PostgreSQL
- **Auth:** Supabase Auth

## Phase 2 (not MVP)

AI: suggestions, adaptive reminders, burnout detection, emotional trends, conversational coach, smart difficulty.
