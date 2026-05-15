# Technical Specification — Pavver

**Project name:** Pavver
**Domains:** pavver.com (primary marketing), pavver.app (deep links + share URLs)
**Owner:** Jay Movaliya
**Target users:** Age 15–30, friend groups walking in the same locality
**Goal:** Validate whether the "steal + share + weekly crown" loop creates daily engagement
**Timeline:** 4 weekends to working POC

---

## 1. What we are building

A mobile app where users walk physical routes, the app paints those routes in their chosen color on a shared map, and friends can "overwrite" each other's routes by walking the same streets. Once a week, whoever owns the most streets in the friend group gets a crown and territories reset.

The POC has three core loops:
1. **Walk loop:** Track GPS → snap to roads → paint segments in user's color
2. **Steal loop:** When walk overlaps friend's territory → overwrite + send push notification
3. **Crown loop:** Sunday 8pm → compute weekly winner → notify group → reset territories

Nothing else ships in v1. No badges, no streaks, no levels, no in-app purchases, no public leaderboards beyond the friend group.

---

## 1a. Brand identity reference

The app is called **Pavver** — capital P, lowercase rest. Pronounced "PAV-er" (two syllables, stress on first). The brand should be referenced consistently across code, copy, and UI.

**In code:**
- Bundle identifier (iOS): `app.pavver.client` or `com.pavver.app`
- Application ID (Android): `app.pavver.client`
- Display name on home screen: `Pavver`
- URL scheme: `pavver://`
- Universal link host: `pavver.app`
- Internal package/folder names can stay generic (e.g. `src/screens/`) — only user-facing strings carry the brand

**In user-facing copy:**
- Always "Pavver" (capital P, never all-caps PAVVER except in logo treatments, never lowercase pavver in body text)
- Verb usage is encouraged: "Pavver every street" / "Get Pavver'd" / "Who Pavver'd this road?"
- Tagline reference: "Walk. Claim. Repeat." or "Be a Pavver."

**Brand colors:**
- The Pavver wordmark itself is neutral (white on dark, black on light) — the brand is the *stage*, not one of the actors
- The six user territory colors are the actors:
  - Sunshine `#FFD60A`
  - Coral `#FF453A`
  - Mint `#30D158`
  - Sky `#0A84FF`
  - Lavender `#BF5AF2`
  - Hot Pink `#FF2D92`
- No single user color is "the Pavver color" — keep brand identity neutral so all six players feel equal

---

## 2. Tech stack

**Frontend:** React Native (bare workflow, not Expo — we need native location modules)
**Maps:** Mapbox SDK for React Native (`@rnmapbox/maps`)
**GPS tracking:** `react-native-background-geolocation` (transistorsoft, paid license ~$199 one-time, worth every rupee for Android background reliability)
**Map matching:** Mapbox Map Matching API (`/matching/v5/mapbox/walking`)
**Backend:** Firebase
  - Auth: **Social via Firebase Auth** — Google (`@react-native-google-signin/google-signin`), Apple (`expo-apple-authentication`), Email magic link. No phone OTP — see `docs/IDEAS_AND_GAPS.md` 2026-05-14 entry for the pivot rationale.
  - Database: Cloud Firestore
  - Push: Firebase Cloud Messaging
  - Scheduled jobs: Cloud Functions (2nd gen) + Cloud Scheduler
  - Storage: Firebase Storage (for share card images if cached)
**Share card rendering:** `react-native-view-shot` (client-side, no server)
**State management:** Zustand (lightweight, no Redux ceremony for POC)
**Navigation:** React Navigation v6

**Why not Expo:** Background GPS on Android requires foreground service + custom native config. Bare RN is less painful here than wrestling with Expo's managed workflow.

**Why not your own backend:** Resist the urge. Firestore + Cloud Functions covers every backend need for the POC. You can rewrite later if it scales.

---

## 3. Data model (Firestore)

All collections live at root. Document IDs are auto-generated UUIDs unless noted.

### `users/{userId}`
```
{
  userId: string                      // matches Firebase Auth UID
  email: string                       // from social provider; required
  providerId: 'google.com' | 'apple.com' | 'password' | 'emailLink'
  displayName: string
  colorHex: string                    // user's chosen color, e.g. "#FFD60A"
  colorName: string                   // "Sunshine Yellow"
  groupId: string | null              // currently in one group only for POC
  fcmToken: string                    // for push notifications
  createdAt: timestamp
  lastActiveAt: timestamp
  totalWalks: number
  totalDistanceMeters: number
  weeklyCrownsWon: number             // lifetime count of weekly crowns
}
```

> Auth pivot 2026-05-14: `phoneNumber` removed; `email` + `providerId` added. See `docs/IDEAS_AND_GAPS.md`.

### `groups/{groupId}`
```
{
  groupId: string
  name: string                        // "Surat Walkers" — user-set
  inviteCode: string                  // 6-char alphanumeric, used in share links
  createdBy: string                   // userId
  createdAt: timestamp
  memberIds: string[]                 // array of userIds, max 20 for POC
  currentWeekStart: timestamp         // start of current competition week
  lastCrownWinnerId: string | null
  lastCrownWonAt: timestamp | null
}
```

### `walks/{walkId}`
```
{
  walkId: string
  userId: string
  groupId: string
  startedAt: timestamp
  endedAt: timestamp
  distanceMeters: number
  durationSeconds: number
  rawGpsPoints: GeoPoint[]            // raw lat/lng array, kept for debug
  matchedSegmentIds: string[]         // OSM way IDs after map matching
  segmentsStolen: number              // how many were owned by someone else
  stolenFromUserIds: string[]         // unique userIds we stole from
  shareImageUrl: string | null        // optional, if we cache the share card
}
```

### `segments/{compositeId}`
**This is the hot collection. Read on every map render.**

Composite ID format: `{groupId}_{osmWayId}` — this lets us scope ownership per group and look up fast.

```
{
  compositeId: string                 // groupId_osmWayId
  groupId: string
  osmWayId: string                    // OSM road segment identifier from map matching
  ownerId: string                     // current owner userId
  ownerColorHex: string               // denormalized for fast map rendering
  claimedAt: timestamp                // last time it was claimed/stolen
  walkId: string                      // walk that claimed it
  geometry: GeoPoint[]                // line geometry, denormalized from Mapbox response
}
```

**Why denormalize color and geometry:** map rendering reads N segments per viewport. Joining to users/walks on every read would kill Firestore read costs and latency. Denormalize aggressively.

### `notifications/{notificationId}`
```
{
  notificationId: string
  userId: string                      // who receives this
  type: "steal" | "weekly_crown" | "group_invite"
  title: string
  body: string
  data: object                        // type-specific payload
  read: boolean
  createdAt: timestamp
}
```

### `weeklyResults/{groupId}_{weekStart}`
```
{
  groupId: string
  weekStart: timestamp
  weekEnd: timestamp
  winnerId: string
  winnerSegmentCount: number
  rankings: [
    { userId, displayName, colorHex, segmentCount, distanceWalked }
  ]
  celebrationImageUrl: string | null
}
```

---

## 4. Firestore indexes

Composite indexes needed:
1. `segments`: `groupId` ASC + `ownerId` ASC (for "who owns how many in this group")
2. `segments`: `groupId` ASC + `claimedAt` DESC (for recent activity feed)
3. `walks`: `userId` ASC + `startedAt` DESC (user's walk history)
4. `walks`: `groupId` ASC + `startedAt` DESC (group activity feed)
5. `notifications`: `userId` ASC + `createdAt` DESC

---

## 5. Security rules (Firestore)

Rough sketch — refine before production:

```
match /users/{userId} {
  allow read: if request.auth != null && (
    request.auth.uid == userId ||
    request.auth.uid in get(/databases/$(database)/documents/groups/$(resource.data.groupId)).data.memberIds
  );
  allow write: if request.auth.uid == userId;
}

match /groups/{groupId} {
  allow read: if request.auth.uid in resource.data.memberIds;
  allow write: if request.auth.uid in resource.data.memberIds;
  // joining via invite code happens via Cloud Function, not direct write
}

match /walks/{walkId} {
  allow read: if request.auth.uid in
    get(/databases/$(database)/documents/groups/$(resource.data.groupId)).data.memberIds;
  allow create: if request.auth.uid == request.resource.data.userId;
  allow update, delete: if false;     // walks are immutable
}

match /segments/{compositeId} {
  allow read: if request.auth.uid in
    get(/databases/$(database)/documents/groups/$(resource.data.groupId)).data.memberIds;
  allow write: if false;              // only Cloud Functions write segments
}
```

**Critical:** segment writes happen ONLY through a Cloud Function (`processWalk`). Never from client. Otherwise users can claim segments without walking.

---

## 6. Cloud Functions

### `processWalk` (HTTPS callable)
**The most important function in the app.** Called by client after walk ends.

Input: `{ walkId, rawGpsPoints, distanceMeters, durationSeconds, startedAt, endedAt }`

Logic:
1. Validate caller is the walk's userId (auth check)
2. Anti-cheat check: compute average speed. If > 12 km/h sustained, reject (human walking is ~5 km/h, running ~10 km/h, anything faster is suspicious)
3. Call Mapbox Map Matching API with rawGpsPoints (chunked to 100 points per call — Mapbox limit)
4. Extract OSM way IDs from response (Mapbox returns `osm_id` in matching response)
5. Deduplicate way IDs (a route can cross the same segment multiple times)
6. For each matched way ID:
   - Read `segments/{groupId}_{osmWayId}`
   - If doesn't exist → create it, owner = current user (count as fresh claim)
   - If exists and ownerId != current user → overwrite, increment `segmentsStolen`, add previous owner to `stolenFromUserIds`
   - If exists and ownerId == current user → skip
7. Write walk document with `matchedSegmentIds`, `segmentsStolen`, `stolenFromUserIds`
8. For each unique user in `stolenFromUserIds`, enqueue a steal notification (batched — see below)
9. Return summary to client for share card: `{ segmentsClaimed, segmentsStolen, stolenFromNames }`

**Batching notifications:** Don't send N notifications for N stolen segments. Send one per (victim user) per walk: "Rahul stole 7 streets from you including your morning route."

### `sendStealNotification` (Pub/Sub or direct call from processWalk)
Input: `{ victimUserId, thiefUserId, walkId, segmentCount, mostNotableStreet }`

Looks up victim's FCM token, formats message, sends push via Admin SDK.

Message template:
- Title: `{thiefName} stole your turf 🎯`
- Body: `They took {segmentCount} streets from you. Take them back?`
- Data payload: `{ type: "steal", walkId, thiefUserId }` so app can deep-link to walk

### `computeWeeklyCrown` (scheduled, every Sunday 20:00 IST)
Runs via Cloud Scheduler. Triggers on `0 20 * * 0` (cron, Asia/Kolkata timezone).

For each active group:
1. Query all segments WHERE `groupId == X` GROUP BY `ownerId`, count
2. Determine winner (most segments). Tie-break: most total distance walked this week.
3. Write `weeklyResults/{groupId}_{weekStart}` doc
4. Update winner's user doc: `weeklyCrownsWon += 1`
5. Increment all members' streaks if they walked at least once this week
6. **Reset:** Delete all segments where `groupId == X` (territories cleared)
7. Update `groups/{groupId}.currentWeekStart` to next Monday 00:00 IST
8. Send celebration notifications to all members
9. Generate celebration image URL (option: pre-render server-side using a headless rendering service, OR have client render on open)

### `createGroup` (HTTPS callable)
Input: `{ groupName }`. Creates a new group with the caller as the first member and creator.

Logic:
1. Validate caller is authenticated
2. Validate `groupName` is 3–24 characters, trimmed, not empty after trim
3. Check caller is not already in a group (`users/{uid}.groupId` must be null) — for POC, one group per user only
4. Generate a unique 6-character alphanumeric invite code (uppercase, exclude confusing chars: no 0/O/1/I/L). Retry on collision with `groups` collection.
5. Create `groups/{groupId}` document with: `name`, `inviteCode`, `createdBy: callerId`, `memberIds: [callerId]`, `currentWeekStart: nextMondayMidnightIST()`, timestamps
6. Update `users/{callerId}.groupId = groupId`
7. Return `{ groupId, groupName, inviteCode }` to client

**Why a Cloud Function and not direct client write:** invite code generation needs collision-checking against the whole collection, which can't be done atomically from the client. Also enforces the "one group per user" rule server-side.

### `lookupGroupByCode` (HTTPS callable)
**Public preview of a group before joining — needed for live validation on the Join screen.**

Input: `{ inviteCode }`. Returns minimal public info about the group so the user can confirm they're joining the right one before tapping the Join button.

Logic:
1. Validate caller is authenticated
2. Validate `inviteCode` format (6 chars, alphanumeric, uppercase)
3. Query `groups` where `inviteCode == X`, limit 1
4. If not found → return `{ exists: false }`
5. If found → fetch the creator's user doc to get `displayName`
6. Return `{ exists: true, groupId, groupName, creatorName, memberCount, isFull: memberCount >= 20 }`

**Why a separate function and not just reading the group doc:** Firestore security rules restrict group reads to members only. A non-member needs to see preview info before joining, and bypassing security rules from the client is impossible. This function runs with admin privileges and returns only safe public fields.

**Rate limiting:** Cap to 30 calls per minute per user to prevent invite code enumeration attacks. Use Firebase App Check + a simple in-memory counter or Firestore-backed rate limiter.

### `joinGroupByCode` (HTTPS callable)
Input: `{ inviteCode }`.

Logic:
1. Validate caller is authenticated
2. Check caller is not already in a group (one-group-per-user rule for POC)
3. Query `groups` where `inviteCode == X`, limit 1
4. If not found → throw `not-found` error
5. If `memberIds.length >= 20` → throw `resource-exhausted` error ("Group is full")
6. If caller is already in `memberIds` (edge case) → return success idempotently
7. Atomic transaction:
   - Add caller's userId to `groups/{groupId}.memberIds`
   - Update `users/{callerId}.groupId = groupId`
8. Return `{ groupId, groupName }` so client can navigate to home

### `cleanupOldWalks` (scheduled, daily)
Optional: delete `rawGpsPoints` from walk documents older than 30 days to save Firestore storage. Keep matched segments forever.

---

## 7. Client-side architecture

### Folder structure
```
src/
  screens/
    onboarding/
      SplashScreen.tsx          // phone entry
      OtpScreen.tsx             // OTP verification
      ProfileSetupScreen.tsx    // name + color picker
      GroupChoiceScreen.tsx     // "Create or Join" picker
      CreateGroupScreen.tsx     // name your group (Step 1)
      GroupCreatedScreen.tsx    // show invite code (Step 2)
      JoinGroupScreen.tsx       // enter invite code with live validation
    HomeMapScreen.tsx           // main shared map
    WalkInProgressScreen.tsx
    WalkSummaryScreen.tsx       // post-walk + share
    GroupScreen.tsx             // leaderboard + invite
    ProfileScreen.tsx
  components/
    MapView.tsx                 // wraps Mapbox, renders segments as colored lines
    ColorPicker.tsx
    WalkTimer.tsx
    ShareCard.tsx               // captured via view-shot
    CrownBanner.tsx
    InviteCodeInput.tsx         // 6-cell alphanumeric input with auto-advance
    GroupPreviewCard.tsx        // shown in live validation on join screen
  state/
    userStore.ts                // Zustand
    walkStore.ts
    groupStore.ts
  services/
    firebase.ts
    mapbox.ts
    notifications.ts
    location.ts                 // wraps background-geolocation
    groupService.ts             // wraps createGroup, lookupGroupByCode, joinGroupByCode callables
  utils/
    distance.ts
    colors.ts
    inviteCode.ts               // validation regex, formatting helpers
```

### Group flow client logic

**Create flow (CreateGroupScreen → GroupCreatedScreen):**
1. User enters group name, taps Next
2. Client calls `createGroup({ groupName })` cloud function
3. On success, navigate to GroupCreatedScreen with `inviteCode` from response
4. GroupCreatedScreen shows the code in a big card. Tap-to-copy uses Clipboard API.
5. "Share invite link" button: builds URL like `https://pavver.app/join/{inviteCode}` and opens system share sheet via `Share.share()` from React Native. Pre-filled share message: "Join my crew on Pavver 🎯 → https://pavver.app/join/{inviteCode}"
6. "Share to WhatsApp" button: uses `Linking.openURL("whatsapp://send?text=...")` with fallback to regular share

**Join flow (JoinGroupScreen):**
1. User types 6-character code in the alphanumeric input
2. **Live validation:** on every keystroke that completes the 6th character, debounce 300ms, then call `lookupGroupByCode({ inviteCode })`
3. While the call is in flight, show a small loading spinner near the input
4. On `exists: true` → show GroupPreviewCard with group name, creator, member count. Enable the Join button.
5. On `exists: false` → show coral error banner "Code not found. Check with your friend."
6. On `isFull: true` → show coral banner "This group is full (20 members max)."
7. User taps Join → call `joinGroupByCode({ inviteCode })` → navigate to HomeMapScreen on success

**Important: deep linking.** When a user receives an invite link `https://pavver.app/join/ABC123` and taps it:
- If app is installed → opens app, navigates to JoinGroupScreen with code pre-filled
- If app is not installed → falls back to App Store / Play Store listing
- Use Firebase Dynamic Links or React Native's universal links setup. For POC, even a simple deep link scheme `pavver://join/ABC123` is fine if you don't want to set up Dynamic Links yet.

**iOS associated domains setup:** Add `applinks:pavver.app` to your app's Associated Domains entitlement. Host the `apple-app-site-association` file at `https://pavver.app/.well-known/apple-app-site-association`.

**Android App Links setup:** Add `<intent-filter>` with `android:autoVerify="true"` for `pavver.app` host in AndroidManifest.xml. Host the `assetlinks.json` file at `https://pavver.app/.well-known/assetlinks.json`.

### Invite code format

- 6 characters, uppercase alphanumeric
- Exclude visually confusing characters: `0`, `O`, `1`, `I`, `L` → use only `A-Z` minus `O, I, L` and `2-9` minus `0, 1`
- Total alphabet: 23 letters + 8 digits = 31 chars → 31^6 = ~887 million combinations, more than enough for POC
- Regex for client-side validation: `^[A-HJ-KMNP-Z2-9]{6}$`
- Always uppercase input automatically as user types

### GPS tracking strategy
- Use `react-native-background-geolocation` with `desiredAccuracy: HIGH_ACCURACY`
- `distanceFilter: 5` (record a point every 5 meters of movement)
- `stopOnTerminate: false`, `startOnBoot: false` (we want manual start)
- Foreground service on Android with persistent notification ("Walk in progress")
- iOS: `NSLocationWhenInUseUsageDescription` + `NSLocationAlwaysAndWhenInUseUsageDescription` in Info.plist
- Buffer points in local SQLite (the library provides this), flush to Firestore on walk end

### Anti-cheat (client-side, defense in depth)
- Reject walks shorter than 100 meters (probably opened by accident)
- Reject walks where >50% of points fail map matching (probably indoors or in a car)
- Flag walks with implausible speed for review (don't auto-reject, log to a moderation queue)

### Map rendering
- On HomeMapScreen mount: query `segments` where `groupId == myGroupId` (paginate if >500)
- Render as Mapbox `LineLayer` with `line-color` set per feature from `ownerColorHex`
- Use `line-opacity: 0.7` so streets remain visible underneath
- Re-fetch on pull-to-refresh and on push notification

### Share card flow
1. Walk ends → WalkSummaryScreen mounts
2. Render `<ShareCard>` component off-screen with map snapshot + stats
3. User taps "Share" → `react-native-view-shot` captures it → opens system share sheet → user picks WhatsApp
4. Optional: also upload to Firebase Storage so the share has a hosted URL too (deep link back to app)

---

## 8. The road-matching gotcha

**Critical: test OSM coverage in your test neighborhood before building anything else.**

1. Open https://www.openstreetmap.org and search your area in Surat
2. Verify the streets you'd actually walk are present as ways (click on roads, check for OSM IDs)
3. Walk 1km with the Mapbox GL JS demo or any GPX recorder. Pass the GPX through Mapbox Map Matching playground. Verify >80% of points match cleanly.

If coverage is patchy in your test area, two options:
- **Option A:** Contribute to OSM yourself for the missing streets (free, but slow)
- **Option B:** Fallback architecture — store raw GPS polylines instead of OSM way IDs, do geometric intersection for overlap detection. More complex but doesn't require OSM coverage.

For POC, go with Option A or pick a test area with good coverage.

---

## 9. Mapbox cost estimate

Free tier limits at time of writing — verify in your Mapbox dashboard:
- 50k monthly active users free
- 100k Map Matching API requests free per month

For 50 active POC users walking 5 times/week = 1000 walks/month = 1000 Map Matching calls. Well within free tier.

---

## 10. Build order (4 weekends)

### Weekend 1 — Foundation
- React Native bare init, iOS + Android run
- Mapbox SDK integration, render a map centered on user location
- Firebase project, Auth (social: Google + Apple + Email link), basic user creation
- Onboarding screens: SignInScreen (social providers) → ProfileSetupScreen (name + color picker)
- Background geolocation setup, walk a route, see raw GPS points logged

**Definition of done:** You can complete onboarding, then walk around the block and see a polyline drawn on the map showing where you walked. No groups yet — single-user mode only.

### Weekend 2 — Map matching + walks
- `processWalk` Cloud Function
- Mapbox Map Matching integration
- Segment claim logic (single user, no overwrites yet — groupId is null at this stage, so segments use a temporary "solo" scope or stub groupId)
- WalkSummaryScreen with basic stats
- Persist matched segments to Firestore
- Render segments from Firestore on HomeMapScreen

**Definition of done:** You walk, see your route snap to roads, those roads stay colored on the map after the walk ends.

### Weekend 3 — Groups + multiplayer
- `createGroup`, `lookupGroupByCode`, `joinGroupByCode` Cloud Functions
- GroupChoiceScreen (create or join picker)
- CreateGroupScreen + GroupCreatedScreen (with invite code display, copy-to-clipboard, share-to-WhatsApp)
- JoinGroupScreen with live validation via `lookupGroupByCode`
- Deep link handling for `pavver://join/{code}` and `https://pavver.app/join/{code}` URLs
- Migrate `processWalk` to use real groupId from user's group membership
- Overwrite logic in `processWalk`
- FCM setup, steal notification sending
- Render multiple users' colors on the same map
- GroupScreen showing member list + segment counts

**Definition of done:** You can create a group, share the code with one test user, they install the app and join via code, both of you walk the same street and overwrite each other, push notifications fire correctly.

### Weekend 4 — Share + crown
- ShareCard component, react-native-view-shot integration
- Share-to-WhatsApp flow for walk summaries
- `computeWeeklyCrown` Cloud Function
- Crown banner UI in GroupScreen
- Weekly crown celebration screen
- Polish: loading states, error handling, empty states (especially the "no walks yet" empty state)

**Definition of done:** Full loop works end to end. Ready to give to 8–10 friends for a 2-week test.

---

## 11. Things explicitly NOT in the POC

Cut ruthlessly. Add only if validation succeeds.

- Stranger interaction / public groups
- Multiple groups per user
- Badges, achievements, levels, XP
- Streaks (beyond the implicit "walked this week or not")
- Daily challenges
- Routes recommendations
- Heatmaps of popular routes
- Apple Health / Google Fit integration
- Smartwatch support
- In-app purchases / subscriptions
- Custom map styles
- Voice cues during walks
- Social feed beyond steal notifications
- Comments / reactions on walks
- Friend requests outside the invite-link flow

---

## 12. Validation metrics (what makes the POC a success)

Two weeks after launch with 8–10 test users, success looks like:

- **DAU/MAU ratio > 0.4** (people are coming back regularly, not just once)
- **At least one user has walked 5+ times in two weeks**
- **At least 3 "revenge walks"** (a user walks within 24h of being stolen from)
- **At least 5 organic shares** to WhatsApp (the share button gets tapped)
- **Qualitative:** at least one user spontaneously messages another user about the app

If these hit, build the next layer. If they don't, the loop doesn't hook — figure out why before building more.

---

## 13. Open questions to resolve before coding

1. Hex grid fallback or stay with OSM way IDs? (Hex grid = simpler, no OSM dependency, but less satisfying visually)
2. Do you want stranger-mode (anonymous public competition) eventually? Affects auth design.
3. What happens if a friend group disagrees on the testing area? Multiple groups support is post-POC.
4. Should walks under, say, 200m count? (Probably no — encourages real walks)
5. App name. Not blocking, but pick one before App Store/Play Store submission.

---

## 14. References

- Mapbox Map Matching: https://docs.mapbox.com/api/navigation/map-matching/
- `@rnmapbox/maps`: https://github.com/rnmapbox/maps
- `react-native-background-geolocation`: https://github.com/transistorsoft/react-native-background-geolocation
- Firebase Cloud Functions 2nd gen: https://firebase.google.com/docs/functions/2nd-gen-upgrade
- OSM way data model: https://wiki.openstreetmap.org/wiki/Way
