# Habit Formation Mobile App — PRD

## Product Name
Bloom (working title)

Alternative names:
- Grow
- Tiny
- Sprout
- Momentum
- Becoming

---

# 1. Product Vision

Build a mobile-first habit formation application inspired by the behavioral psychology principles from Atomic Habits by James Clear.

The app should NOT feel like:
- a productivity tracker
- a task manager
- a guilt-based streak app

Instead, it should feel like:
- a supportive companion
- a calming coach
- an emotionally intelligent growth system

The app should guide users through:
- identity-based habit building
- low-friction interactions
- emotionally rewarding feedback
- soft gamification
- AI-assisted coaching

Core focus:
- retention
- emotional connection
- consistency
- simplicity
- daily engagement

---

# 2. Product Philosophy

Users fail habits because:
- habits are too difficult
- systems create pressure
- apps overwhelm users
- motivation fades

This app should:
- reduce pressure
- celebrate tiny wins
- encourage consistency
- emotionally support users
- make progress visually satisfying

The experience should feel:
- calm
- modern
- emotionally safe
- premium
- lightweight

---

# 3. Technical Stack

## Frontend
- React Native
- Expo Router
- TypeScript

## Backend
- FastAPI
- PostgreSQL

## Authentication
- Supabase Auth

## Styling
- NativeWind

## Animations
- React Native Reanimated
- Moti

## State Management
- Zustand

## Notifications
- Expo Notifications

---

# 4. Design System Source

IMPORTANT:

A file already exists:

/ui.json

This file contains:
- colors
- typography
- spacing
- animation guidelines
- motion rules
- component styles
- mascot direction
- visual identity
- interaction patterns

The app MUST use:
- ui.json as the primary design system
- ui.json as the visual source of truth

DO NOT invent a conflicting design language.

The UI must feel:
- soft
- calm
- emotionally supportive
- modern
- playful
- minimal
- mobile-native

---

# 5. MVP Scope

The first version should include:

## Authentication
- Sign up
- Login
- Guest mode

---

# 6. Onboarding Flow

## Goal
Create emotional investment immediately.

## Step 1
Ask:
"Who do you want to become?"

Example identities:
- Healthy person
- Focused developer
- Calm person
- Consistent learner
- Better sleeper

---

## Step 2
Ask:
"What would someone like that do daily?"

Generate suggested habits.

---

## Step 3
Suggest tiny habits:
- Walk 5 minutes
- Read 1 page
- Drink water once
- Meditate 2 minutes

The app should encourage:
- tiny starting habits
- low resistance
- consistency over intensity

---

## Step 4
Ask:
- preferred reminder time
- preferred cue
- energy level

---

# 7. Home Screen

The home screen should:
- focus only on today
- reduce cognitive load
- feel emotionally calm
- use large whitespace
- use soft gradients
- include mascot illustration

## Sections

### Header
- User avatar
- Greeting
- Streak counter
- Reward points

---

### Hero Section
Display:
- mascot
- current streak
- motivational microcopy

Examples:
- "Tiny steps still count."
- "You're becoming more consistent."
- "Growth happens daily."

---

### Today's Habits
Display:
- max 3 highlighted habits
- progress state
- completion CTA

Habit cards should:
- be large
- rounded
- image-supported
- thumb-friendly

---

### Bottom Navigation
Tabs:
- Today
- Journey
- Insights
- Profile

Navigation style:
- floating
- glassmorphism-inspired
- soft shadows
- rounded pill container

---

# 8. Habit System

## Habit Creation Flow

The habit creation flow should:
- feel guided
- be conversational
- avoid long forms

Use:
- one question per screen
- smooth transitions
- emotional language

---

## Habit Properties

Each habit should support:
- title
- identity category
- frequency
- reminder time
- cue
- difficulty
- emotional score
- streak
- completion history

---

# 9. Atomic Habits Integration

## Make It Obvious
- reminders
- visual hierarchy
- clear progress
- habit visibility

---

## Make It Attractive
- mascot animations
- soft gradients
- streak visuals
- reward interactions

---

## Make It Easy
- one-tap completion
- swipe gestures
- low-energy mode

---

## Make It Satisfying
- completion animations
- emotional reinforcement
- progress visuals
- streak growth

---

# 10. Low Energy Mode

Core feature.

Users can tap:
"Low energy today?"

The app automatically:
- reduces difficulty
- shrinks requirements
- preserves streak momentum

Example:
Instead of:
"Walk 30 minutes"

Switch to:
"Walk 2 minutes"

Goal:
Consistency > perfection

---

# 11. Emotional Check-In System

After completing habits:
Ask:
"How do you feel?"

Options:
- Worse
- Same
- Better

Track emotional patterns to later power:
- AI insights
- habit recommendations
- burnout detection

---

# 12. Reward System

DO NOT use:
- aggressive gamification
- loud badges
- competitive leaderboards

The reward system should feel:
- supportive
- cozy
- emotionally rewarding

Use:
- soft glowing animations
- streak progression
- evolving mascot
- calming visual feedback

---

# 13. Mascot System

The mascot is a major emotional feature.

The mascot should:
- feel alive
- react emotionally
- celebrate progress
- comfort users after missed habits

Style:
- soft
- rounded
- cute
- low-detail
- emotionally expressive

The mascot should:
- animate subtly
- idle on screens
- react to streaks
- evolve visually over time

---

# 14. Motion Design

Motion should feel:
- soft
- organic
- calm
- rewarding

Use:
- spring physics
- fade transitions
- floating cards
- glow pulses
- subtle parallax

Avoid:
- harsh movement
- flashy effects
- over-stimulation

---

# 15. Accessibility

Support:
- dark mode
- dynamic font scaling
- reduced motion
- screen readers
- high contrast text

---

# 16. Dark Mode

Dark mode should feel:
- warm
- cozy
- soft

Avoid:
- pure black
- neon colors

Use colors from:
- /ui.json

---

# 17. AI Features (Phase 2)

Future AI features:
- AI habit suggestions
- adaptive reminders
- burnout detection
- emotional trend analysis
- conversational habit coach
- smart difficulty adjustment

---

# 18. Suggested Folder Structure

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

---

# 19. Database Models

## Users
- id
- name
- email
- avatar
- created_at

---

## Habits
- id
- user_id
- title
- identity_type
- frequency
- cue
- difficulty
- created_at

---

## Habit Completions
- id
- habit_id
- completed_at
- emotion_score
- notes

---

## Streaks
- user_id
- current_streak
- best_streak

---

# 20. Notifications

Notifications should feel:
- gentle
- identity-based
- emotionally supportive

Examples:
- "Tiny steps still count 🌱"
- "A calm person takes a small pause today."
- "Don't break the chain."

Avoid:
- guilt
- pressure
- shame

---

# 21. Success Metrics

Primary metrics:
- daily retention
- streak continuation
- emotional positivity trend
- habit consistency

NOT:
- total tasks completed

---

# 22. UX Rules

IMPORTANT:
- Minimize typing
- Minimize friction
- Prioritize one-thumb usage
- Never overwhelm users
- Guide users emotionally
- Focus on today's progress only

---

# 23. Inspiration Apps

Inspiration references:
- Headspace
- Duolingo
- Habitica
- Notion

But the final product should feel:
- softer
- calmer
- emotionally intelligent
- more premium

---

# 24. Final Product Goal

The app should make users feel:

"I'm slowly becoming the person I want to be."

NOT:

"I failed today."

The app should feel:
- emotionally intelligent
- beautiful
- calming
- rewarding
- effortless
