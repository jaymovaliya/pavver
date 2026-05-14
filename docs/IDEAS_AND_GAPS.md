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
