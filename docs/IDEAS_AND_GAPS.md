# Pavver — Spec Drift, Open Gaps, Parked Ideas

A running log of inconsistencies between the specs (`CLAUDE.md`, `TECH_SPEC_1.md`, `DESIGN_SPEC_2.md`, `WORKFLOW_1.md`), the decisions made to resolve them, and ideas that surface mid-build that we explicitly chose NOT to do.

**Check this file before assuming any spec is gospel.** When in doubt, the decisions logged here override the older spec wording. When you spot a new gap, log it here in the "Open questions" section rather than guessing.

Three sections: **Resolved decisions** (with date and rationale) · **Open questions** (still waiting on a call) · **Parked ideas** (NOT building; here so we don't re-litigate).

---

## Resolved decisions

### 2026-05-14 — Routing: Expo-router (D1)
**Conflict:** `CLAUDE.md` originally specified "React Navigation v6 (native stack + bottom tabs)". The scaffold from `create-expo-app` uses Expo-router 6 with file-based routing in `app/`.
**Decision:** Expo-router. Screens live in `app/`; reusable UI lives in `src/components/`. `CLAUDE.md` and `WORKFLOW_1.md` updated. Use `router.push()` / `<Link>` for navigation — no separate `Stack.Navigator`.

### 2026-05-14 — Folder layout: `src/` for everything except `app/` (D2)
**Conflict:** `CLAUDE.md` originally put screens under `src/screens/`; Expo-router requires `app/` at the repo root.
**Decision:** `app/` stays at root for Expo-router routes. Everything else (`components`, `state`, `services`, `theme`, `types`, `utils`) lives under `src/`. The `@/*` TypeScript alias remaps to `./src/*` (it currently maps to `./*` — needs updating during scaffold cleanup).
**Migration:** The existing root-level `theme/` folder moves into `src/theme/` during scaffold cleanup.

### 2026-05-14 — Workflow: Expo managed + custom dev client from day 1 (D3, D4)
**Conflicts resolved together:**
- `TECH_SPEC_1.md` §2 specifies bare React Native + `react-native-background-geolocation` (transistorsoft, ~$199 paid).
- `CLAUDE.md` (correctly) overrides to Expo managed + `expo-location` background updates.
- `WORKFLOW_1.md` hedged Mapbox with "react-native-maps as fallback if Mapbox is painful in Expo managed".

**Decision:** Expo managed workflow, **custom dev client from day one**, no Expo Go ever. Mapbox commits to `@rnmapbox/maps` + its config plugin in `app.config.ts`. GPS uses `expo-location` (foreground) + `expo-task-manager` (background). The react-native-maps fallback language is cut from `WORKFLOW_1.md`.
**Trade-off:** Android background GPS is less reliable than the transistorsoft library. If reliability becomes a blocker (not before), eject to bare workflow.

### 2026-05-14 — Firebase SDK: `@react-native-firebase/*` (D3)
**Conflict:** `TECH_SPEC_1.md` says "Firebase Auth phone OTP, Firestore, Cloud Functions, FCM" but didn't specify SDK choice. Two options: `firebase` JS SDK (works in Expo Go, weaker on iOS phone auth, FCM via web push only) vs `@react-native-firebase/*` (native modules, requires a dev client, full FCM support).
**Decision:** `@react-native-firebase/*` native modules across the board. Since we're already committed to a dev client for Mapbox, there's no upside to the JS SDK.
**Implication:** Any Firebase tutorial that imports from `firebase/*` must be translated to the `@react-native-firebase/<module>` API surface (they differ — modular JS SDK uses `getAuth()`, RNFirebase uses `auth()`).

### 2026-05-14 — Secrets and environment (D6)
**Decision:** `app.config.ts` (not `app.json`) loads `.env` via `dotenv` and exposes values through `Constants.expoConfig.extra`. Typed access wrapper at `src/services/env.ts`.
**Gitignored:** `.env`, `.env.*`, `google-services.json`, `GoogleService-Info.plist`, Mapbox `MAPBOX_DOWNLOADS_TOKEN`.
**Tracked:** `app.config.ts` itself (it reads from env, doesn't store secrets).

### 2026-05-14 — Logo asset path (D7)
**Decision:** Logos move from `assets/images/Logo/` → `assets/images/logo/` (lowercase). Four SVG files plus `BRAND_ASSETS.md`. The case change happens during scaffold cleanup. `CLAUDE.md` already references the lowercase path.

### 2026-05-14 — Screen count clarification (D10)
**Note:** `DESIGN_SPEC_2.md` defines 12 numbered main screens (1–12) **plus** 3 sub-screens for the group flow (4a, 4b, 4c) — that's **15 total layouts**, not 14 as initially summarized. `WORKFLOW_1.md` updated with the correct count.

### 2026-05-14 — Auth method: social (Google + Apple + Email), no phone OTP
**Conflict:** `TECH_SPEC_1.md` §2 and `DESIGN_SPEC_2.md` Screens 1+2 mandated Firebase phone OTP with a dedicated OTP entry screen. User dropped a new Sign-in mockup showing Google + Apple + Email sign-in buttons (no phone field).
**Decision:** Switch to **social-only auth**: Google + Apple + Email magic link via Firebase Auth.
**Rationale:** Cleaner global onboarding (no India-only +91 default); no SMS costs; lower friction; matches the dropped mockup.
**Implications:**
- `TECH_SPEC_1.md` §2 updated (auth provider list)
- `TECH_SPEC_1.md` §3 `users/{userId}` schema: `phoneNumber: string` → removed; `email: string` and `providerId: 'google.com' | 'apple.com' | 'password' | 'emailLink'` added
- `TECH_SPEC_1.md` §10 Weekend 1: OTP screen task removed; "SplashScreen → OtpScreen → ProfileSetupScreen" → "SignInScreen → ProfileSetupScreen"
- `DESIGN_SPEC_2.md` Screen 1 rewritten to the social-buttons layout; Screen 2 (OTP) marked DELETED
- `CLAUDE.md` Firebase tech-stack line updated
- New native modules will be needed (deferred to follow-up plan): `@react-native-google-signin/google-signin`, `expo-apple-authentication`
- The Sign-in screen ships with stubbed auth handlers until those native modules are installed and real OAuth client IDs + Apple capability are configured

### 2026-05-14 — Sign-in screen: stubbed handlers + decorative map background skipped
**Decision:** First Sign-in delivery uses stubbed auth handlers in `src/services/auth.ts` (~800ms simulated delay → fake authenticated user). Solid `colors.bg.primary` background instead of the spec's "faded city-streets illustration at 15% opacity" — that asset doesn't exist yet and isn't blocking.
**Follow-ups:**
- Real Google/Apple/Email provider wiring once Firebase project + OAuth credentials land
- Decorative map illustration asset (commission a render, or generate from Mapbox at build time once Mapbox plugin is enabled)

### 2026-05-14 — Firebase auth wiring landed (code); Firebase project setup pending (user side)
**What changed:** `src/services/auth.ts` is no longer stubbed. Real Firebase implementations now wired:
- **Google** via `@react-native-google-signin/google-signin` → Firebase credential exchange
- **Apple** via `expo-apple-authentication` (+ `expo-crypto` for nonce) → Firebase credential exchange
- **Email + password** via `auth().signInWithEmailAndPassword` / `createUserWithEmailAndPassword`. Magic-link UX is deferred — Firebase Dynamic Links is deprecated and a hosted continueUrl page wasn't worth setting up for v1.

**New files / changes:**
- `src/services/firebase.ts` — RNFirebase auto-init + `GoogleSignin.configure({ webClientId })` at module load
- `app/email-signin.tsx` — sub-screen with email + password fields, sign-in/sign-up toggle, Firebase error message prettifier
- `app.config.ts` — added plugins: `@react-native-firebase/app`, `@react-native-firebase/auth`, `@react-native-google-signin/google-signin`, `expo-apple-authentication`; added `ios.usesAppleSignIn: true`; added `googleServicesFile` paths for both platforms
- `.env.example` — added `FIREBASE_WEB_CLIENT_ID`, `GOOGLE_IOS_URL_SCHEME`
- `src/state/userStore.ts` — narrowed `signInWith` to `'google' | 'apple'`; added `signInWithEmailPassword(email, password, mode)`
- `AuthGate` allows `/email-signin` while `status === 'idle'` (doesn't bounce back to `/`)

**🛑 USER-SIDE SETUP NEEDED before sign-in actually works on device:**
1. Create Firebase project at console.firebase.google.com
2. Register iOS app with bundle `app.pavver.client` → download `GoogleService-Info.plist` → drop at repo root (gitignored)
3. Register Android app with package `app.pavver.client` + SHA-1 from dev keystore → download `google-services.json` → drop at repo root (gitignored)
4. Enable providers in Firebase Console → Authentication:
   - Google: enable, then copy the OAuth 2.0 **Web Client ID** into `.env` as `FIREBASE_WEB_CLIENT_ID`
   - Apple: enable, configure Apple Services ID (requires Apple Developer membership + "Sign in with Apple" capability on bundle `app.pavver.client`)
   - Email/Password: enable
5. Open `GoogleService-Info.plist`, copy `REVERSED_CLIENT_ID` into `.env` as `GOOGLE_IOS_URL_SCHEME`
6. `npx expo install expo-build-properties`, then add the plugin to `app.config.ts` with `ios: { useFrameworks: 'static' }` (RNFirebase v24 requirement)
7. `npx expo prebuild --clean` then `expo run:ios` / `expo run:android` to compile a dev client with Firebase wired

Until those steps complete, the new auth code runs but every `signIn*` call will fail at the native module level. The Sign-in screen UI still renders correctly (no crash) — it's just that buttons throw on press.

**Magic-link email auth** intentionally deferred. If we want it later, plan needs to cover:
- A hosted continueUrl page (Firebase Dynamic Links was deprecated 2025; need a self-hosted alternative or 3rd-party)
- Universal link config for `pavver.app`
- A separate "Check your email" screen between request and link-tap

### 2026-05-15 — New Architecture disabled + react-native-reanimated removed
**Conflict triple-bind hit during first iOS dev-client build:**
1. RNFirebase v24 + `use_frameworks!(:static)` (required for RNFB pods) + RN New Architecture → iOS build fails with `-Werror,-Wnon-modular-include-in-framework-module` errors in `RNFBApp` headers. The standard `CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES = YES` post_install patch (auto-added by RNFB's config plugin) doesn't silence the error when new arch is on.
2. Disabling new arch (`newArchEnabled: false`) resolves #1 — but then `react-native-reanimated@4.x` refuses to install: "Reanimated requires the New Architecture to be enabled."
3. Reanimated was only ever a side-effect import in `app/_layout.tsx` (`import 'react-native-reanimated'` left over from the `create-expo-app` scaffold). No actual `Animated.*` calls anywhere in `app/` or `src/`.

**Decision (both at once):**
- `newArchEnabled: false` in `app.config.ts`
- `react-native-reanimated` and `react-native-worklets` uninstalled; import removed from `app/_layout.tsx`

**Re-enable when:** RNFirebase ships a version that builds clean against the new architecture + static frameworks (track [react-native-firebase issues](https://github.com/invertase/react-native-firebase/issues) for `useFrameworks` + new-arch keywords), OR we replace `@react-native-firebase/*` with another Firebase SDK.

**Re-add reanimated when:** we actually need animations (spec mentions "bouncy springs" microinteractions). Until then it's just dead weight on the bundle.

### 2026-05-15 — CocoaPods 1.16 + Ruby 3.4 Unicode/locale gotcha
**Symptom:** `pod install` fails with `Encoding::CompatibilityError: Unicode Normalization not appropriate for ASCII-8BIT`.
**Fix:** Set `LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8` before running `pod install` (or `npx expo prebuild`).
**Permanent fix:** Add `export LANG=en_US.UTF-8` and `export LC_ALL=en_US.UTF-8` to your `~/.zshrc` / `~/.bash_profile`.

---

## Open questions

### Doc filenames carry numeric suffixes
The actual files are `docs/TECH_SPEC_1.md`, `docs/DESIGN_SPEC_2.md`, `docs/WORKFLOW_1.md`. The suffixes look like versioning artifacts. `CLAUDE.md` now references the suffixed paths so links work, but the user (and casual readers) refer to them without suffixes.
**Options:**
(a) Rename the files to drop `_1` / `_2` and update `CLAUDE.md` to match
(b) Keep the suffixes and live with the friction
**Status:** Awaiting your call.

### OSM coverage check in the test neighborhood (D5)
`TECH_SPEC_1.md` §8 makes this pre-blocking for any map-matching work. You said you'd run the check before Weekend 1 step 5 (GPS + map). Do not write `processWalk` or any Mapbox Map Matching code until results are reported here.
**What to capture when you check:**
- Test area + how many km walked
- % of GPS points that snapped to OSM ways
- Any obvious missing streets
**Status:** Awaiting your check.

### Stub `groupId` for solo-mode walks (Weekend 1 + 2)
`TECH_SPEC_1.md` §10 Weekend 2 says "groupId is null at this stage, so segments use a temporary 'solo' scope or stub groupId" but never defines the stub. Affects:
- `walks/{walkId}.groupId` (schema in §3 implies required string)
- `segments/{compositeId}` composite ID format (`{groupId}_{osmWayId}` — fails on null)
- Firestore security rules in §5 dereference `resource.data.groupId` — null breaks them
**Proposal:** Use `solo_${userId}` as a sentinel groupId during solo mode. Segments are scoped per-user. When the user joins a real group in Weekend 3, either run a one-time migration of solo segments OR discard them (simpler, probably fine for POC).
**Status:** Awaiting your call.

### What happens if a user taps "Skip for now" on Screen 4 (Group Choice)?
`DESIGN_SPEC_2.md` Screen 4 offers "Skip for now — I'll add friends later". But `TECH_SPEC_1.md` §6 `processWalk` requires a groupId. If a user skips, where do their walks go? This is the same question as the solo-groupId stub above, just from the UI side.
**Status:** Awaiting your call. (Tied to the solo-groupId decision.)

### Streaks data missing from user schema
`TECH_SPEC_1.md` §6 `computeWeeklyCrown` step 5 says "increment all members' streaks if they walked at least once this week", but the `users/{userId}` schema in §3 has no `weeklyStreak` (or similar) field. Either add `weeklyStreak: number` + `lastStreakWeek: timestamp` to the schema, or cut streaks from the crown function for v1 (Weekend 4 is when it lands).
**Status:** Awaiting your call.

### Weekly result celebration image — pre-render or client-render?
`TECH_SPEC_1.md` §6 `computeWeeklyCrown` step 9 lists both as options ("pre-render server-side using a headless rendering service, OR have client render on open"). For POC speed, client-render via `react-native-view-shot` is simpler (no extra infra). Pre-rendering means a Cloud Function + headless Chrome or equivalent.
**Proposal:** Client-render for POC. `celebrationImageUrl` stays null until first share; the share action captures + uploads.
**Status:** Awaiting your call.

---

## Parked ideas (NOT building in POC)

*(Empty — log here anything that surfaces during the build and gets explicitly deferred, so we don't keep re-litigating.)*
