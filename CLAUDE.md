# Pavver

This is the project memory file for Claude Code. Read this first on every session.

## What we're building

Pavver is a gamified walking app where users walk physical routes, the app paints those routes in their chosen color on a shared map, and friends can "overwrite" each other's routes by walking the same streets. Once a week, whoever owns the most streets in the friend group gets a crown and territories reset.

Three core loops: **walk** (track GPS, paint streets), **steal** (overwrite friends, push notification), **crown** (Sunday 8pm weekly winner, reset).

## Required reading

Before making architectural decisions, read these files in order:
1. `docs/TECH_SPEC_1.md` — full technical architecture, data models, Cloud Functions, security rules
2. `docs/DESIGN_SPEC_2.md` — screen-by-screen visual specifications
3. `docs/WORKFLOW_1.md` — how Figma screens become code (prompt template + weekend checklists)
4. `docs/IDEAS_AND_GAPS.md` — running log of spec inconsistencies, resolved decisions, and parked ideas. Check this before assuming any spec is gospel.

If your current task touches data models or backend logic → re-read the relevant section of `TECH_SPEC_1.md`.
If your current task is a UI screen → re-read the relevant screen section in `DESIGN_SPEC_2.md`.

## Tech stack (non-negotiable for the POC)

- React Native via **Expo** (managed workflow, NOT bare workflow)
- **Custom dev client from day one, NOT Expo Go.** Phone OTP via `@react-native-firebase/auth` and Mapbox both require native modules that Expo Go doesn't ship. Don't try to make Expo Go work.
- TypeScript everywhere, strict mode
- Firebase via **`@react-native-firebase/*` native modules**, NOT the `firebase` JS SDK. Modules in use: `app`, `auth`, `firestore`, `functions`, `messaging`.
- Maps: `@rnmapbox/maps` (Mapbox SDK), wired via its config plugin in `app.config.ts`
- GPS: `expo-location` for foreground tracking; background tracking via `expo-task-manager` + `expo-location` background updates
- State: **Zustand**, NOT Redux, NOT React Context for app state
- Navigation: **Expo-router** (file-based routing in `app/`). Reusable UI lives in `src/components/`. Do NOT add a separate React Navigation stack — use Expo-router's `Stack` / `Tabs` primitives, which sit on top of React Navigation already.
- Storage during walks: in-memory + `@react-native-async-storage/async-storage` for crash recovery

> Note on background GPS: the tech spec mentions `react-native-background-geolocation` (a bare-workflow library). Since we're on Expo managed workflow, we use `expo-location` background updates instead. This is less reliable on Android but adequate for the POC. If background tracking becomes a blocker, we'll eject to bare workflow at that point — not before.

## Secrets and environment

- Use `app.config.ts` (NOT `app.json`) so we can read environment variables at build time. Migrate the existing `app.json` to `app.config.ts` during scaffold cleanup.
- Environment variables live in a local `.env` at the repo root, loaded via `dotenv` and surfaced to JS through `expo-constants` (`Constants.expoConfig.extra`).
- **Always gitignored, never commit:**
  - `.env` and `.env.*` variants
  - `google-services.json` (Android Firebase config)
  - `GoogleService-Info.plist` (iOS Firebase config)
  - Mapbox `MAPBOX_DOWNLOADS_TOKEN` (secret) — distinct from the public token used at runtime
- Keys to define in `.env` for Weekend 1: `MAPBOX_PUBLIC_TOKEN`, `MAPBOX_DOWNLOADS_TOKEN`. Firebase project credentials come from the platform config files, not `.env`.
- Access secrets in code via a typed wrapper at `src/services/env.ts`. Do not call `Constants.expoConfig.extra` directly from screens or other services.

## Brand identity

App name: **Pavver** (capital P, never all caps PAVVER except in logo, never lowercase pavver in body).
Pronunciation: "PAV-er" (two syllables, stress on first).
Tagline: "Walk. Claim. Repeat."
Bundle ID (iOS) / Application ID (Android): `app.pavver.client`
URL scheme: `pavver://`
Universal link host: `pavver.app`
Logo assets (SVG): `assets/images/logo/` — `pavver-icon.svg` (app icon), `pavver-mark.svg` (pin only), `pavver-wordmark-dark.svg`, `pavver-wordmark-light.svg`. Usage rules in `assets/images/logo/BRAND_ASSETS.md`. Never recolor the pin in a user color and never use the wordmark below 24px tall.

## Color system (use theme tokens, NEVER hardcode hex)

All colors live in `src/theme/colors.ts`. Import them, don't inline hex values.

**UI chrome:**
- `colors.bg.primary` — `#0A0A0F` (page background)
- `colors.bg.secondary` — `#16161D` (cards, sheets)
- `colors.bg.tertiary` — `#22222E` (input fields)
- `colors.text.primary` — `#FFFFFF`
- `colors.text.secondary` — `#9999A8`
- `colors.text.tertiary` — `#5C5C6B`
- `colors.border.default` — `#2A2A38`
- `colors.accent.brand` — `#FFD60A` (Pavver yellow, primary CTA)

**User territory colors** (the six picker options):
- `colors.user.sunshine` — `#FFD60A`
- `colors.user.coral` — `#FF453A`
- `colors.user.mint` — `#30D158`
- `colors.user.sky` — `#0A84FF`
- `colors.user.lavender` — `#BF5AF2`
- `colors.user.hotPink` — `#FF2D92`

**Semantic:**
- `colors.semantic.success` — `#30D158`
- `colors.semantic.danger` — `#FF453A`
- `colors.semantic.warning` — `#FFD60A`

## Typography

- Font family: **Inter** (load via `@expo-google-fonts/inter`)
- Weights used: 400 (regular), 500 (medium), 700 (bold), 800 (extra bold for hero numbers/headlines)
- All headings: weight 700 or 800, letter-spacing -0.02em
- Body: 16px regular
- No font smaller than 11px
- Tabular numbers (`fontVariant: ['tabular-nums']`) on all stat numbers and timers

## Spacing scale

4px grid. Use multiples: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
Standard side padding for screens: 16px.
Standard gap between major sections: 24px or 32px.

## Component rules

- Every screen is dark-mode-by-default. Light mode comes later.
- Buttons: minimum height 56px (primary), 48px (secondary), pill-shaped (`borderRadius: 28` for 56px height)
- Cards: `borderRadius: 16` or `20` depending on prominence
- Inputs: `borderRadius: 16`, height 56px, background `colors.bg.tertiary`
- Never use `position: 'absolute'` for fixed UI — use SafeAreaView + flex

## File and folder conventions

```
app/                  Expo-router file-based routes — ALL screens live here
  _layout.tsx         root layout: fonts, auth gate, dark status bar
  index.tsx           Screen 1: Splash & phone entry
  otp.tsx             Screen 2: OTP verification
  profile-setup.tsx   Screen 3: name + color picker
  (onboarding)/       group create/join flow (Screens 4, 4a, 4b, 4c — route group, no URL segment)
  (tabs)/             post-onboarding tabs: HomeMap (5), Group (9), Profile (11)
  walk/               walk-in-progress (6) and summary (7)

src/
  components/         reusable UI: Button, ColorPicker, MapView wrapper, ShareCard, etc.
  state/              Zustand stores: userStore, walkStore, groupStore
  services/           Firebase, Mapbox, location, notifications, env wrappers
  utils/              pure helper functions
  theme/              colors, typography, spacing — single source of truth
  types/              shared TypeScript types
```

The `@/*` TypeScript alias maps to `./src/*` (NOT to repo root). Import the theme as `import { colors } from '@/theme'`. The `app/` directory sits outside `@/` because Expo-router resolves routes by file path, not by import.

One route per file. One Zustand store per domain. Services wrap external SDKs so screens never import Firebase, Mapbox, or `expo-location` directly.

## When implementing a screen from a Figma screenshot

The user will drop a Figma export PNG and reference a screen number from `docs/DESIGN_SPEC_2.md`. Your workflow:

1. **Open the corresponding section of `docs/DESIGN_SPEC_2.md`** for that screen. The spec has exact spacings, colors, behaviors that may not be visible in the static screenshot.
2. **Match the screenshot for layout** but pull all colors from `src/theme/colors.ts` tokens. Never hardcode `#FFD60A` — use `colors.accent.brand`.
3. **Implement state and side effects from the spec**, not the screenshot. The screenshot can't show what happens on tap.
4. **Match the 4px spacing grid**. If a measurement looks like 30px in the screenshot, it's probably 32px in the design.
5. **Build dumb and reusable when possible.** If a screen has a button that appears elsewhere, extract it into `src/components/`.

## Anti-patterns to avoid

- Don't hardcode hex colors anywhere except in `src/theme/colors.ts`
- Don't use inline styles for anything other than dynamic values; use `StyleSheet.create`
- Don't fetch from Firestore inside a screen component; do it via the corresponding Zustand store or service
- Don't add features not in the tech spec's "phase 1/2/3" sections. If tempted to add badges, streaks, daily challenges, etc., resist — note it in `docs/IDEAS_AND_GAPS.md` instead
- Don't introduce a new dependency without asking. The stack above is fixed for the POC
- Don't write a Cloud Function from the client. Functions live in `functions/` and are deployed separately
- Don't use `any` type. If you don't know the type, look it up or ask
- Don't import from `firebase/*` (the JS SDK). Use `@react-native-firebase/<module>` — they have different APIs. Translate any tutorial code you find.
- Don't write code that only runs in Expo Go. We're on a custom dev client; native modules (Mapbox, RNFirebase, background location) are expected to work.
- Don't commit `.env`, `google-services.json`, or `GoogleService-Info.plist`. Add to `.gitignore` if you see them untracked.

## Validation gates

A feature is "done" when:
1. It compiles in TypeScript strict mode with zero `any`
2. It runs on the iOS simulator AND an Android device/emulator
3. It uses theme tokens for all colors and spacing
4. It handles loading, error, and empty states
5. It matches the spec's "Definition of done" for that weekend

## Open questions to ask before guessing

- If a Firestore document structure is unclear → re-read TECH_SPEC section 3
- If a screen interaction isn't in the spec → ask the user, don't invent
- If a library install is needed → ask first, especially if it's not in the tech stack list above

## Current build phase

Update this section at the start of each weekend's work:

**Current: Weekend 1 — Foundation**
Goal: Onboarding (Splash → OTP → ProfileSetup) + GPS walk recording with line drawn on map. Single-user only, no groups yet.
