# Pavver Screen Implementation Workflow

How to translate Figma designs into React Native code without Figma MCP.

> **Screen count:** the design spec defines 12 numbered main screens (1–12) plus 3 sub-screens for the group flow (4a, 4b, 4c) = **15 total layouts**. Build them in the weekend order below — don't skip ahead.

## The loop, every screen

1. **Open the screen in Figma.** Select the frame.
2. **Export as PNG @ 2x.** Right-click frame → Export → PNG → 2x → Export.
3. **In Antigravity, open Claude Code.** Start a new conversation for each screen.
4. **Drag the PNG into the chat.**
5. **Paste this prompt template** (filled in):

```
Implement Screen [N] — [SCREEN NAME] from docs/DESIGN_SPEC_2.md.

Reference:
- Read CLAUDE.md (repo root) for project conventions
- Read docs/DESIGN_SPEC_2.md → Screen [N] section for exact specifications
- Read docs/TECH_SPEC_1.md → relevant sections for state and services
- Check docs/IDEAS_AND_GAPS.md for any open questions or resolved decisions touching this screen
- The attached PNG shows the visual target

Implementation requirements:
- Path: app/[route].tsx (Expo-router file-based routing — onboarding screens at root, post-onboarding under (tabs)/, walk flow under walk/)
- Use theme tokens from @/theme — never hardcode hex or px values
- Match the spec's spacing exactly (4px grid)
- Match the screenshot's visual layout
- Implement state/effects/navigation per the spec — navigate via expo-router's `router.push()` / `<Link>`, NOT a separate React Navigation stack
- TypeScript strict, zero `any`
- Handle loading, error, empty states

Before writing code, summarize:
1. What components/routes already exist that I should reuse
2. What new state, services, or types this screen needs
3. Any open questions about the spec that I should resolve before coding

Then implement.
```

6. **Review Claude's plan** before letting it generate the file. Catch wrong assumptions early.
7. **Test the screen** on iOS simulator + Android emulator before moving on.
8. **Note any spec gaps** in `docs/IDEAS_AND_GAPS.md` for later resolution.

## Per-screen build order

Match the tech spec's weekend order. Don't skip ahead.

### Weekend 1 — Foundation
- [ ] Clean up the create-expo-app scaffold (delete sample tabs/modal screens, themed-* components, `constants/theme.ts`, color-scheme hooks, sample react-logo PNGs)
- [ ] Migrate folder layout: keep `app/` at root, move everything else under `src/` (including the existing `theme/`); update `tsconfig.json` so `@/*` maps to `./src/*`
- [ ] Move logos: `assets/images/Logo/` → `assets/images/logo/` (lowercase)
- [ ] Convert `app.json` → `app.config.ts`; set iOS `bundleIdentifier` and Android `package` to `app.pavver.client`; add Mapbox + RNFirebase config plugins; dark splash with Pavver yellow
- [ ] Set up `.env` + `src/services/env.ts`; add `.env`, `google-services.json`, `GoogleService-Info.plist` to `.gitignore`
- [ ] Install Weekend-1 deps: `@expo-google-fonts/inter`, `zustand`, `@react-native-async-storage/async-storage`, `@react-native-firebase/{app,auth,firestore}`, `expo-location`, `@rnmapbox/maps`
- [ ] Build a custom dev client (`npx expo prebuild` + EAS dev build, or local `expo run:ios` / `run:android`) — Expo Go is NOT used on this project
- [ ] Wire Inter fonts into `app/_layout.tsx`; gate render on `fontsLoaded`; force dark mode and dark status bar
- [ ] Initialize Firebase via `@react-native-firebase/app` in `src/services/firebase.ts` (config files live in `ios/` and `android/`, untracked)
- [ ] Screen 1 — Splash & Phone Entry (`app/index.tsx`)
- [ ] Screen 2 — OTP Verification (`app/otp.tsx`)
- [ ] Screen 3 — Profile Setup, name + color picker (`app/profile-setup.tsx`)
- [ ] Basic GPS tracking via `expo-location` (foreground only this weekend)
- [ ] `@rnmapbox/maps` integration: dark map style centered on user location
- [ ] Draw a polyline on the map from recorded GPS points

### Weekend 2 — Walks
- [ ] Background location updates via `expo-task-manager`
- [ ] `processWalk` Cloud Function
- [ ] Mapbox Map Matching API integration in the function
- [ ] Walk-in-progress screen
- [ ] Walk summary screen
- [ ] Persist matched segments to Firestore (solo mode, no groups yet)
- [ ] Render owned segments on home map

### Weekend 3 — Groups + Multiplayer
- [ ] `createGroup`, `lookupGroupByCode`, `joinGroupByCode` Cloud Functions
- [ ] Screen 4 — Group Choice
- [ ] Screen 4a — Create Group
- [ ] Screen 4b — Group Created (invite code)
- [ ] Screen 4c — Join Group with Code
- [ ] Deep link handling
- [ ] Migrate `processWalk` to scope segments by groupId
- [ ] Overwrite logic + steal notifications via FCM
- [ ] Screen 9 — Group Leaderboard

### Weekend 4 — Share + Crown
- [ ] Screen 7 — Walk Summary share card with `react-native-view-shot`
- [ ] WhatsApp share intent
- [ ] `computeWeeklyCrown` Cloud Function + Cloud Scheduler
- [ ] Screen 10 — Weekly Crown celebration
- [ ] Screen 11 — Profile / Settings
- [ ] Screen 12 — Empty state polish
- [ ] Loading and error states across the app
- [ ] Push to TestFlight + Play Store internal testing

## When Claude gets it wrong

The two most common failure modes and how to recover:

**Failure 1: Claude hardcoded colors despite the rule.**
Tell it: "You hardcoded `#FFD60A` on line X. Replace all hardcoded hex values with imports from `@/theme`. The rule is in CLAUDE.md."

**Failure 2: Claude added a feature not in the spec.**
Tell it: "The spec for this screen does not include [feature]. Remove it. If you think it's needed, add it to `docs/IDEAS_AND_GAPS.md` instead."

**Failure 3: Claude installed a dependency that's not in our stack.**
Tell it: "We don't use [library] in this project. The approved stack is in CLAUDE.md. Use [the right library from our stack] instead and uninstall [the wrong one]."

**Failure 4: Claude imported from `firebase/*` (the JS SDK).**
Tell it: "We use `@react-native-firebase/*`, not the `firebase` JS SDK. The APIs differ. Translate to `import auth from '@react-native-firebase/auth'` (or the matching module) and re-derive the call site."

**Failure 5: Claude added a React Navigation `Stack.Navigator`.**
Tell it: "We use Expo-router, not a separate React Navigation stack. Replace this with file-based routes in `app/` and `router.push()` / `<Link>` for navigation."

## Antigravity-specific tips

Antigravity is Google's IDE built on Codeium's stack. The Claude Code extension inside it should behave identically to standalone Claude Code, but there are a few things to know:

- The chat panel sometimes loses context across very long sessions. Start a fresh conversation for each screen — don't try to build the whole app in one chat.
- File creation through the Claude Code extension writes to your project directory directly. Always commit before letting Claude make sweeping changes.
- If Claude proposes a multi-file change, review the diff carefully before accepting. Antigravity's diff UI is usable but small.

## Git hygiene

- Commit before each Claude Code session: `git add -A && git commit -m "WIP: before [screen name]"`
- After accepting changes: `git diff` to verify, then commit again with descriptive message
- Branch per weekend: `weekend-1-foundation`, `weekend-2-walks`, etc.
- Don't merge to main until each weekend's "Definition of done" passes

## When to ask for help vs. when to push through

Push through if: TypeScript errors, missing imports, prop type mismatches, styling that's almost right.

Ask for help if: Cloud Function logic is unclear, security rules are blocking writes you expect to work, background GPS isn't firing on Android, Mapbox is exhausting your free tier.
