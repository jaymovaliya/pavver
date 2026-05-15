# Design Specification — Pavver

**App name:** Pavver (capital P, lowercase rest). Pronounced "PAV-er." Wherever a screen needs to show the app name (splash, push notifications, share cards, etc.), use exactly "Pavver."
**Target audience:** 15–30 year olds. Gen Z + young millennials.
**Tone:** Bold, playful, slightly chaotic, mobile-native. Think Duolingo's confidence + BeReal's casualness + Strava's data clarity.
**Platform:** iOS and Android (React Native, native feel on both)

---

## Global design system

**Paste this as context first when starting a Stitch session, then paste individual screen prompts after.**

### Design philosophy
Pavver is a playful competition game disguised as a fitness app. The aesthetic should feel more like a social game (Pokémon GO, BeReal) than a serious fitness tracker (Strava, Nike Run Club). Energetic, colorful, slightly maximalist. Never corporate, never beige.

### Color palette
The app uses two color systems running in parallel:

**System 1 — UI chrome (neutral, calm, lets user colors pop):**
- Background primary: `#0A0A0F` (near-black with blue tint, dark mode default)
- Background secondary: `#16161D` (cards, sheets)
- Background tertiary: `#22222E` (input fields, dividers)
- Text primary: `#FFFFFF`
- Text secondary: `#9999A8`
- Text tertiary: `#5C5C6B`
- Border: `#2A2A38`
- Light mode mirror: background `#FAFAFC`, text `#0A0A0F` — but design dark-first

**System 2 — User territory colors (vibrant, saturated, the stars of the show):**
Six colors users can pick from. Each user owns one. These are the colors that paint streets.
- Sunshine `#FFD60A`
- Coral `#FF453A`
- Mint `#30D158`
- Sky `#0A84FF`
- Lavender `#BF5AF2`
- Hot Pink `#FF2D92`

These should feel high-saturation, almost neon, against the dark map.

### Typography
- Headings: **Inter** or **General Sans**, weight 700, tight letter-spacing (-0.02em)
- Body: **Inter**, weight 400–500
- Numbers/stats: **Inter Display** or **JetBrains Mono** for emphasis on metrics
- Display sizes: hero 48px, h1 32px, h2 24px, h3 18px
- Body: 16px base, 14px secondary

### Component style
- Border radius: 16px for cards, 24px for buttons, full pill for tags
- Shadows: subtle, mostly avoid in favor of layered backgrounds
- Buttons: large, thumb-friendly (min height 56px for primary actions)
- Icons: outlined, 24px standard, 2px stroke weight. Phosphor or Tabler icon style.
- Microinteractions implied: bouncy springs (not linear ease), satisfying haptic taps
- No glassmorphism, no skeuomorphism. Flat with thoughtful color.

### Map style
The map uses Mapbox with a custom dark style:
- Base map: very dark gray streets (`#1A1A24`) on near-black background (`#0A0A0F`)
- Water: slightly bluer dark (`#0F1620`)
- Parks: dark muted green (`#1A2418`)
- Labels: muted white at 60% opacity
- **User territory lines:** 4px wide, vibrant user color, slight glow (subtle outer stroke at 50% opacity)
- This makes user-claimed streets pop visually against the dark map

### Iconography & illustrations
- Use bold, playful illustrations where appropriate (empty states, onboarding)
- Crown icon is hero — show it gold/shimmery for weekly winner
- Avoid stock fitness imagery (people running, smiling models). Lean abstract/geometric instead.

### Voice & copy
- Casual, second person, slightly sassy
- Use emoji sparingly but deliberately (🎯 for steals, 👑 for crown, 🔥 for streaks)
- Examples:
  - Good: "Rahul stole your turf 🎯 Take it back."
  - Bad: "User Rahul has captured 7 of your previously owned route segments."
- Numbers should feel celebratory: "+7 streets" not "7 segments claimed"

---

## Screen 1 — Splash & Social Sign-in

**Paste to Stitch:**

```
Design a mobile splash and social sign-in screen for a gamified walking app targeting 15-30 year olds.

The screen has a dark, near-black background (#0A0A0F) with a faded, abstract map illustration behind everything at 15% opacity. The map shows curving city streets in subtle gray, with three small colored line segments highlighted — one yellow (#FFD60A), one coral (#FF453A), one sky blue (#0A84FF) — to hint at the app's territory mechanic.

At the top, 80px from safe area: the wordmark "Pavver" in white, bold, 32px, centered. The double-v in "Pavver" is a key visual feature of the brand — render it as two distinct V letters touching (not as a "w"). Below the wordmark, 8px gap, smaller text in muted gray: "Walk. Claim. Repeat."

Center of screen, vertically: a large playful headline in white, 28-32px bold, 2 lines: "Claim every street you walk."

Below headline, 32px gap: three social sign-in buttons stacked with 12px gaps. All full width minus 32px margins, 56px height, rounded-pill (radius 28).
- Button 1: "Continue with Google" — solid WHITE background, near-black (#0A0A0F) bold 17px text, multicolor Google "G" icon (Ionicons logo-google) at left of label.
- Button 2: "Continue with Apple" — solid DARK gray (#16161D) background, white bold 17px text, white Apple logo (Ionicons logo-apple) at left of label.
- Button 3: "Continue with Email" — TRANSPARENT background, 1px white-ish border (#2A2A38), white bold 17px text, white envelope outline (Ionicons mail-outline) at left of label.

At bottom, 24-32px from safe area: tiny text in muted gray (#9999A8), 12px, centered: "By continuing, you agree to our Terms and Privacy Policy" with Terms and Privacy as underlined links (no-op for v1).

Mood: playful, energetic, modern. Like a game, not a fitness app. Targets Gen Z. No phone field — auth is purely via social providers (decision logged 2026-05-14 in docs/IDEAS_AND_GAPS.md).
```

---

## Screen 2 — OTP Verification *(DELETED)*

**DELETED on 2026-05-14.** Auth pivoted from phone OTP to social sign-in (Google + Apple + Email). See Screen 1 above and `docs/IDEAS_AND_GAPS.md` for the decision and rationale. Screen numbering preserved so downstream references (Screen 5, Screen 7, etc.) don't shift.

---

## Screen 3 — Profile Setup (Name + Color Picker)

**Paste to Stitch:**

```
Design a profile creation screen where the user picks their display name and their territory color. Dark background (#0A0A0F). This is the most visually exciting onboarding screen — show off the colors.

Top: progress dots at top showing "Step 2 of 2" — two small horizontal pills, first one filled yellow (#FFD60A), second one filled white. Below, a back arrow in top-left.

Headline in white, 28px bold: "Pick your colors."
Subheadline in muted gray: "This is how your friends will see your territory."

40px gap below: a large input field for display name. Label above field "Your name" in small caps muted gray. Field is full width, 56px tall, background #22222E, rounded 16px, placeholder "Jay" in light gray. Active border in user's currently selected color.

48px gap below the name field: color picker section. Label above "Your color" in muted gray.

Six color circles in a 2x3 grid (or single row of 6 if it fits). Each circle is 64px diameter. Colors are:
- Sunshine #FFD60A
- Coral #FF453A
- Mint #30D158
- Sky #0A84FF
- Lavender #BF5AF2
- Hot Pink #FF2D92

Selected color has a thick white ring around it (3px stroke, 4px offset) and a subtle bouncy scale (1.1x). Unselected colors are at 80% opacity. Tapping triggers a haptic feel (visual: subtle pulse).

Below color picker, 32px gap: a preview card. Card background #16161D, rounded 20px, padding 20px. Inside the card, show a small map snippet with 2-3 streets highlighted in the user's chosen color. Above the map: text "Preview" in muted gray, small caps. Below map: "Your streets will look like this."

Bottom of screen: primary button "Let's go" — full width, 56px tall, pill shape, background in the user's selected color, text in near-black. Hint of playfulness in copy.

Mood: vibrant, exciting, the moment where the user commits to their identity in the game.
```

---

## Screen 4 — Join or Create Group

**Paste to Stitch:**

```
Design a screen where a new user either creates a new walking group or joins an existing one with an invite code. Dark background (#0A0A0F).

Top: back arrow in top-left. Headline below in white, 28px bold: "Get your crew."
Subheadline in muted gray, 16px: "Walk with friends. Steal each other's streets."

32px gap below: two large option cards stacked vertically.

Card 1 — "Create a group":
- Full width, 120px tall, rounded 20px
- Background #16161D with a subtle yellow accent stripe down the left edge (4px wide, #FFD60A)
- Inside, left side: icon of a plus inside a circle (outlined, 32px, yellow color)
- Right of icon, text content: "Create a group" in white 18px bold, then below "Start fresh with your friends" in muted gray 14px
- Chevron arrow on the right edge, muted gray

Card 2 — "Join with code":
- Same size and style as card 1
- Accent stripe in coral (#FF453A)
- Icon: a small key or arrow-into-box icon, outlined
- Text: "Join a group" / "Got an invite code from a friend?"

32px gap below the two cards: a small tertiary link in muted gray, centered: "Skip for now — I'll add friends later" (this lets users explore the app first)

Mood: friendly, low-friction, clear binary choice. The accent stripes give visual texture without clutter.
```

---

## Screen 4a — Create Group

**Paste to Stitch:**

```
Design a screen where the user creates a new walking group. Dark background (#0A0A0F).

Top: a back arrow in top-left (white, 24px outlined). To the right of the back arrow, in the top bar: small "Step 1 of 2" indicator — two horizontal pills, first one filled yellow (#FFD60A), second one filled #2A2A38 (inactive). 16px padding from safe area.

Headline below, 48px gap: "Name your group" in white, 28px bold.
Subheadline below, 8px gap: "Pick something your friends will recognize." in muted gray (#9999A8), 16px regular.

40px gap below: a large input field for the group name. Label above field "Group name" in small caps muted gray with letter-spacing. Field is full width minus 32px margins, 64px tall, background #22222E, rounded 16px, placeholder text "The Surat Walkers" in light gray (#5C5C6B), 18px regular. Active state shows a 2px yellow border (#FFD60A). On the right side of the field, a character counter "0/24" in muted gray (limit group name to 24 chars).

Below input, 12px gap: 3 small suggestion chips arranged horizontally with horizontal scroll if needed. Each chip is a pill shape, 36px tall, background #16161D, 1px border #2A2A38, padding 12px horizontal, text in muted gray 13px. Tapping a chip fills the input field. Suggestions:
- "Morning Crew 🌅"
- "Walk Wars"
- "Street Hunters"

32px gap below: a preview card. Card background #16161D, rounded 20px, padding 20px. Title at top in muted gray small caps: "PREVIEW". Below: a mini representation of how the group will appear in the home screen pill — shows the group name typed (live updates as user types) with a small chevron-down icon, styled exactly like the floating pill on the home map. If the field is empty, shows placeholder text in #5C5C6B.

Below preview card, 16px gap: a small info row with a tiny info icon (outlined, muted gray) and text in muted gray 13px: "You can rename your group later in settings."

Bottom of screen, 32px from safe area:
Primary button "Next" — full width minus 32px margins, height 56px, rounded pill, background yellow (#FFD60A), text near-black bold 17px. Disabled at 30% opacity until at least 3 characters are entered in the group name field.

Mood: focused single-task screen. Friendly, low-pressure. The suggestion chips reduce friction for users who can't think of a name. The live preview confirms what they're creating.
```

---

## Screen 4b — Group Created / Invite Friends

**Paste to Stitch:**

```
Design the success screen shown immediately after a group is created — this is where the user gets their invite code to share with friends. Dark background (#0A0A0F).

Top: a back arrow in top-left, and on the right side of the top bar: "Step 2 of 2" indicator — two horizontal pills, both filled yellow (#FFD60A) now.

40px gap below: a small celebratory illustration centered, 80px tall — a stylized graphic of two hands fist-bumping, or a folded paper invite icon, in yellow color. Slightly playful, not corporate.

Below illustration, 24px gap: headline centered in white, 28px bold: "Your group is live."
Below headline, 8px gap: subheadline centered in muted gray 16px: "Share this code with friends to invite them."

32px gap below: THE HERO CODE DISPLAY. A large card, full width minus 32px margins, height 160px, rounded 24px, background gradient from #16161D to a very subtle yellow tint at top-right (#16161D to #1A1815). Inside the card, vertically centered:
- Tiny caps muted gray label at top "GROUP CODE" with letter-spacing
- 8px gap below: the 6-character code in MASSIVE bold monospace yellow (#FFD60A), 48px, letter-spacing 0.1em, centered. Example: "K7M4PZ"
- 12px gap below: a small "Tap to copy" hint in muted gray 12px with a small copy icon next to it. When tapped, the entire card briefly flashes green (#30D158) at 20% opacity and the text changes to "Copied!" with a checkmark for 1.5 seconds.

Below the code card, 24px gap: two action buttons stacked vertically.

Primary button: "Share invite link" — full width minus 32px margins, height 56px, rounded pill, background yellow (#FFD60A), near-black text bold 17px. Small share/arrow-up icon on the left of text. Tapping opens the system share sheet with a pre-filled message: "Join my crew on Pavver 🎯 → pavver.app/join/K7M4PZ"

16px gap, secondary button: "Share to WhatsApp" — same dimensions, outline style (1px white border, transparent background, white text bold 17px). Small WhatsApp icon on left.

32px gap below: a tertiary text link, centered, in muted gray 14px: "Skip for now — I'll invite later"

At the very bottom, 24px from safe area, tiny dismissable hint in muted gray (#5C5C6B), 12px, centered: "Friends will see your group when they enter this code."

Mood: triumphant, celebratory, action-oriented. The big code is the hero — it's the thing the user needs to copy and share. The two share buttons reduce friction to the smallest possible step. The "skip" option lets users explore the app first if they're not ready to invite anyone yet.
```

---

## Screen 4c — Join Group with Code

**Paste to Stitch:**

```
Design a screen where the user enters an invite code to join an existing walking group. Dark background (#0A0A0F).

Top: a back arrow in top-left (white, 24px outlined). No step indicator on this screen — it's a single action.

48px gap below: headline in white, 28px bold: "Enter the code"
Subheadline below, 8px gap, in muted gray 16px: "Ask your friend for their group's 6-character code."

48px gap below: 6 large code input boxes side by side, similar to OTP entry but for alphanumeric characters. Each box is 48px wide, 64px tall, background #22222E, rounded 12px, 1px border #2A2A38. Active/focused box has a bright coral (#FF453A) border (using coral instead of yellow to visually differentiate the join flow from the create flow). Characters inside are white, 28px bold uppercase monospace, centered. Auto-advances to next box on input. Auto-uppercases everything.

24px gap below: a small text in muted gray 14px, centered, with a small paste icon: "Paste code from clipboard" — this becomes a tappable link if the clipboard contains a 6-char string matching the pattern.

LIVE VALIDATION STATE — show three possible states below the input boxes (only one visible at a time):

State 1 (default/typing): no message visible.

State 2 (valid code found, all 6 chars entered): a small card appears 24px below the inputs, background #16161D, rounded 16px, padding 16px, full width minus 32px margins. Inside:
- Left: a small group avatar — a colored circle (using the group creator's color) with the group's initial inside, 48px diameter
- Middle: group name in white 16px bold "The Surat Walkers", below it in muted gray 13px "Created by Rahul · 7 members"
- Right: a tiny green dot (#30D158) and "Valid" in green caps 11px
- A subtle 1px green border (#30D158) at 30% opacity surrounds the card

State 3 (invalid code): a small banner 24px below the inputs, background #FF453A at 15% opacity, border 1px coral at 40% opacity, rounded 12px, padding 12px. Inside: a small alert icon (outlined coral) and text "Code not found. Check with your friend." in coral (#FF453A) 14px.

Bottom of screen, 32px from safe area:
Primary button: "Join group" — full width minus 32px margins, height 56px, rounded pill, background coral (#FF453A), white text bold 17px. Disabled at 30% opacity until a valid code is entered (state 2 active).

Below button, 16px gap: tertiary text link in muted gray, centered: "I don't have a code — create a group instead" → links back to Screen 4a.

Mood: clear single purpose. The coral accent throughout (instead of yellow) subtly signals "join" vs "create." Live validation reassures the user before they tap join — they see exactly what group they're about to join, including the creator's name and member count, so there's no surprise.
```

---

## Screen 5 — Home / Shared Map (THE HERO SCREEN)

**Paste to Stitch:**

```
Design the main map screen — this is the home screen of the app and the most important visual. It must look striking.

The entire screen is a full-bleed dark mode map. Map base style: streets in #1A1A24, background #0A0A0F, water in #0F1620, parks in muted dark green. Mapbox-style dark map.

OVER THE MAP, several streets are painted in vibrant colors — these are the territories owned by the friend group. Show a realistic mix:
- A long winding street in yellow (#FFD60A)
- An L-shaped section in coral (#FF453A)
- A short straight street in sky blue (#0A84FF)
- A few short segments in mint (#30D158)
- Hot pink (#FF2D92) on a couple of streets
Lines are 4px wide with a subtle outer glow in the same color at 30% opacity. Streets that aren't owned remain the muted dark gray of the base map.

Top of screen, overlaying the map with a slight blur backdrop:
- A floating pill at top-center: shows group name "Surat Walkers" in white bold 16px, with a small chevron down to switch groups
- Top-left: a profile avatar (circle, 40px, user's color as background, initial inside)
- Top-right: a bell/notification icon with a small red dot badge if there are unread steals

Bottom of screen, 24px from safe area: the START WALK button. This is the most important CTA in the app. Make it big and satisfying:
- Full-width minus 32px side margins
- Height 72px
- Rounded 36px (pill)
- Background bright yellow (#FFD60A) — extremely high contrast against the dark map
- Text "Start walk" in near-black, 20px bold, centered
- Subtle play icon (triangle) on the left of the text

Above the START button, 16px gap: a small floating status pill showing today's tally. Background #16161D with 80% opacity (slight blur), rounded full pill. Inside: small dot in user's color + text "You own 12 streets today · #2 in group" — text in white 13px.

Floating right side, vertically centered: a small recenter button (compass/locate icon) — 48px circle, #16161D background, white icon. Above it (16px gap), a layers/toggle button to filter map view.

Mood: this should feel like opening Pokémon GO — immediate, alive, visually rewarding. The colored streets are the wow moment.
```

---

## Screen 6 — Walk in Progress

**Paste to Stitch:**

```
Design the active walking screen — what shows when the user is currently on a walk. Dark map background (same dark Mapbox style as home).

The user's current path is being drawn live on the map in their color (let's say yellow #FFD60A for this mockup). The line should look like it's actively being drawn — a small pulsing dot at the leading edge.

Top of screen overlaying the map:
- A pause button on the top-left (48px circle, #16161D background, white pause icon)
- Top-right: a stats toggle/expand icon

Most of the screen is map. The user's current walk path is yellow, 5px wide, with a slight bright pulse animation at the head.

Bottom of screen, raised in a curved panel (rounded top corners, 24px) with background #16161D. Panel takes about 30% of bottom of screen. Inside:

Row 1 (top of panel, centered): a large time display — "00:14:32" in white, 40px bold, monospace numbers (JetBrains Mono or Inter with tabular-nums).

Row 2 (below time, 3 columns equally spaced):
- Column 1: small label "Distance" in muted gray 11px caps, value below "1.24 km" in white 20px bold
- Column 2: small label "Streets claimed" in muted gray, value "7" in white 20px bold, with a small +3 hint in green if recently increased
- Column 3: small label "Steals" in muted gray, value "2" in coral (#FF453A) 20px bold — this number is in coral to imply aggression/excitement

Bottom of panel: a large END WALK button. Full width minus 32px margins, 64px tall, rounded pill, background coral red (#FF453A) — different from the start button to signal stopping. Text "End walk" white, bold 18px. Press-and-hold to confirm (subtle visual cue: a small text below the button "Press and hold to end").

Mood: focused, live, energized. The user is in the middle of a workout — minimize distractions but show the rewarding stats prominently.
```

---

## Screen 7 — Walk Summary (THE SHAREABLE MOMENT)

**Paste to Stitch:**

```
Design the post-walk summary screen — this is what appears immediately after the user ends their walk. It must feel like a reward. This is also the screen where the share image is generated.

Background: a soft gradient from #0A0A0F at top to #16161D at bottom. Above 50% of the screen is dominated by a "summary card" that will be the shareable image.

THE SHAREABLE CARD (top 65% of screen, padded 16px from edges, rounded 24px, background #16161D):

Inside the card, from top to bottom:
- Header row: user's avatar circle (color background, initial inside) on left, then user's name "Jay" in white 16px bold, with timestamp below in muted gray "Today, 7:42 AM". Right side: app logo small.
- Below header, 16px gap: the headline metric — "+12 streets" in user's color (yellow #FFD60A), MASSIVE — 56px bold, with a small "claimed" label below in muted gray
- Below the big number, 8px gap: a sub-line: "Stole 4 from Priya 🎯" in coral (#FF453A), 16px medium
- Below that, 16px gap: a map snapshot showing the walk's route highlighted in yellow against the dark map. The map fills the width of the card, height 200px, rounded 16px.
- Below map, 16px gap: a stats row — three centered columns. Each shows a small label (caps muted gray) and a value (white 18px bold): "1.84 KM" / "23 MIN" / "5.2 KM/H"

Below the card (bottom 35% of screen), action buttons stacked:

Primary button: "Share to WhatsApp" — full width minus 32px margins, 56px tall, pill, background WhatsApp green or yellow (#FFD60A). White text bold 18px. Small WhatsApp icon on left of text.

16px gap: secondary button "Share elsewhere" — same size, outline style (1px white border, transparent background, white text).

16px gap: tertiary text link, centered "Done" in muted gray.

At very top of screen, very small: a back/close X icon in top-left to dismiss.

Mood: triumphant. This is the dopamine hit. The "+12 streets" headline number should feel like a celebration. The card design must look great when screenshotted and shared on WhatsApp — high contrast, clear text, brand-recognizable.
```

---

## Screen 8 — Steal Notification (Push Preview + In-App)

**Paste to Stitch:**

```
Design two related views: (1) the push notification preview that appears on the user's lockscreen, and (2) the in-app banner / detail view that opens when they tap the notification.

View 1 — Push notification preview (show as it would appear on iOS lockscreen, dark mode):
Standard iOS notification card. App icon on left. App name in bold "Pavver" with timestamp "now". Title: "Rahul stole your turf 🎯" Body: "He took 7 streets from you, including your morning route. Take them back?"

View 2 — In-app full screen after tapping notification:
Dark background (#0A0A0F).

Top of screen: a large coral red (#FF453A) banner taking the top 30% of the screen. Inside the banner:
- Tiny label at top: "STOLEN" in white 12px bold caps with letter-spacing
- Main text below: "Rahul stole 7 of your streets" in white 28px bold, 2 lines
- Subtext below in white at 80% opacity: "Including the lane behind your house"

Below the banner, 24px gap: a map view (60% of screen height) showing the contested area. The streets Rahul stole are now in his color (e.g. #BF5AF2 lavender), overlaid on the dark map. The user's remaining streets are still yellow. A small annotation pin marks "Stolen" on the lavender streets.

Bottom of screen, 24px from safe area:
Primary button — "Revenge walk" — full width, 64px tall, pill, background yellow #FFD60A, text near-black 18px bold. Small running icon on left.
16px gap, secondary outline button: "Maybe later" — same size, transparent with white outline.

Mood: confrontational but playful. The coral banner is aggressive. The "Revenge walk" button is the action we want users to take. This screen should make the user feel a tiny bit fired up.
```

---

## Screen 9 — Group Leaderboard

**Paste to Stitch:**

```
Design the group leaderboard / standings screen. Dark background (#0A0A0F).

Top of screen: tab bar at the top with two tabs: "This week" (active, white text with yellow underline) and "All time" (muted gray, no underline). Below tabs, 16px gap: a small status pill — "Week ends in 2 days, 14 hours" in muted gray, with a small countdown clock icon.

24px gap below: the leaderboard list. Each row represents a group member.

Each row (height 80px, padding 16px horizontal, separated by a 1px line in #22222E):
- Left: rank number — "1", "2", "3", etc. — in muted gray, 24px bold. Rank 1 has a small gold crown icon next to/above the number.
- Avatar circle (48px, member's color background, initial inside, with a thin 2px ring in their color)
- Member name in white 16px bold, below it a small line in muted gray showing "12.4 km walked"
- Right side: large number showing streets owned — "47" in their color, 28px bold. Below the number, "streets" in muted gray 11px caps.

The first row (current leader, rank 1) has a special treatment: a subtle gradient background in the leader's color at 10% opacity, plus a small "current king" or "current queen" label as a tiny pill at the top.

Below the list, 32px gap: an "Invite friends" CTA — pill button, full width minus 32px margins, 56px tall, background #16161D with 1px white border (outline style). White text "Invite more friends" with a small share icon.

Below that, 16px gap: a tertiary text link "Group settings" in muted gray.

Mood: competitive, gamified, status-driven. The streets count should be the dominant metric on the row. Color is everywhere — every user's color identifies them.
```

---

## Screen 10 — Weekly Crown / Sunday Celebration

**Paste to Stitch:**

```
Design the weekly crown celebration screen — what appears on Sunday at 8pm when the weekly winner is announced. This is the most celebratory screen in the app.

Background: dark base (#0A0A0F) with a subtle animated/static confetti effect — small colored dots and shapes in all six user colors scattered across the background at low opacity.

Center of screen, vertically centered:
- A large 3D-style or layered crown icon at top, golden (#FFD700) with a subtle glow. Size around 96px.
- Below crown, 24px gap: headline "Week 14 winner" in muted gray, 14px caps with letter-spacing.
- Below, 8px gap: the winner's name in their color, MASSIVE — 56px bold. Example "JAY 👑"
- Below name, 16px gap: stat — "Owned 67 streets this week" in white 18px medium

Below this, 40px gap: a "podium" visual — three vertical bars side by side showing 2nd, 1st, 3rd place (in that left-to-right order, like an Olympic podium). Each bar is colored in the user's color, rounded top, with the user's name and street count on top of the bar. The 1st place bar is tallest (180px), 2nd is medium (140px), 3rd is shortest (100px). Below each bar, a small avatar circle.

Bottom of screen, 24px from safe area:
- Primary button: "Share the win" — pill, full width, 56px tall, background yellow #FFD60A, near-black text bold "Share to group chat"
- 16px gap, tertiary text link "Continue to map" in muted gray

Bottom-most tiny text in muted gray, centered: "Territories reset. New week starts now. 🎯"

Mood: triumph, celebration, fun. The confetti and 3D crown make it feel special. The reset message at the bottom prevents losers from feeling defeated — everyone starts fresh.
```

---

## Screen 11 — Profile / Settings

**Paste to Stitch:**

```
Design the profile and settings screen. Dark background (#0A0A0F).

Top: a header section, 200px tall, with a gradient background in the user's color (e.g. yellow #FFD60A) blending into #0A0A0F as it descends. In the center of the header:
- Large avatar circle (96px) with user's initial in white bold, background slightly darker shade of their color
- Below avatar, 12px gap: user's name in white, 24px bold "Jay Movaliya"
- Below name, 6px gap: phone number in muted gray "+91 9876543210"

Below header, 24px gap: stat row. Three stat cards in a row, each rounded 16px, background #16161D, padding 16px. Each card shows: small label caps muted gray (top), big value white 24px bold (middle), tiny sub-label muted gray (bottom).
- Card 1: TOTAL WALKS / 47 / since you started
- Card 2: KM WALKED / 124.3 / lifetime
- Card 3: CROWNS WON / 3 / weekly wins

Below stats, 24px gap: settings list. Each row 56px tall, rounded 12px on first and last, padding 16px:
- Row: "My color" — shows current color circle on right
- Row: "Notifications" — chevron right
- Row: "Privacy" — chevron right
- Row: "Group settings" — chevron right
- Row: "Help & feedback" — chevron right
- Row: "About" — chevron right

Last row, separated with 24px gap, full width destructive button: "Log out" — outline style, coral text and border (#FF453A).

Bottom: tiny version number text in muted gray, centered "v0.1.0 (1)"

Mood: clean, simple, lets the user's identity (color) come through in the header.
```

---

## Screen 12 — Empty State (No Walks Yet)

**Paste to Stitch:**

```
Design the empty state shown on the home map when a user has just joined and hasn't taken any walks yet, and neither has anyone in their group. The map is shown but contains no colored streets — just the dark base.

Over the map, centered, a floating card with subtle backdrop blur:
- Card background #16161D at 90% opacity, rounded 24px, padding 24px, max width 320px
- Inside card, top: an illustration or animated icon — a stylized footprint or a paint-bucket-tipping-onto-map graphic. Bold and playful, in yellow color.
- Below illustration, 16px gap: headline "No streets claimed yet" in white 20px bold
- Below headline, 8px gap: subtext in muted gray 14px "Take your first walk to paint these streets in your color."
- Below text, 24px gap: primary button "Start your first walk" — pill, full width of card, 48px tall, yellow background, near-black text bold

Below the card, 16px gap: secondary text link in muted gray, centered "Invite friends to play with you" with a small arrow icon.

Mood: inviting, low-pressure, points clearly to the next action.
```

---

## Notes for Stitch usage

1. **Always paste the Global Design System section first** as system context, then paste an individual screen prompt.
2. After Stitch generates a screen, you may need to nudge with follow-ups like "make the buttons larger and more pill-shaped" or "the map color blocks need to look more like neon paint."
3. If Stitch gives you a result that's too corporate or beige, push back with "make this feel more like a game, not a fitness app — think Pokémon GO meets BeReal."
4. Generate iOS and Android variations of the home map screen — they may need slightly different status bar treatments.
5. Once you have static designs, capture them and feed them back to Claude Code as visual references when implementing screens in React Native.

---

## Final note on the aesthetic direction

The whole point of leaning into bold, gamified visuals is to differentiate from Strava and INTVL, which both look like serious athletic tools. Your audience (15–30) responds to apps that feel *fun* and *expressive*, not *clinical* and *data-heavy*. Every screen should pass the test: "Would a 17-year-old send a screenshot of this to their group chat without irony?" If not, push it more playful.
