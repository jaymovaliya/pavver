# Pavver Brand Assets

Four production-ready SVG files. All scale infinitely without loss.

## Files

### `pavver-icon.svg` — App icon (1024×1024)
The full app icon for iOS App Store, Play Store, and home screen.
- Yellow rounded-square background (#FFD60A)
- Dark pin (#0A0A0F) with yellow double-V inside
- Corner radius matches Apple's superellipse spec (228/1024)

**Use for:**
- iOS app icon (iTunesArtwork@2x)
- Android adaptive icon (foreground layer)
- App Store / Play Store listing
- Favicon source

### `pavver-mark.svg` — Standalone pin mark (512×640)
The pin shape without the yellow tile. Transparent background.

**Use for:**
- Loading screens (animate it bouncing or pulsing)
- Push notification icon
- Watermarks on share cards
- Email signatures
- Anywhere you need just the symbol on a custom background

### `pavver-wordmark-dark.svg` — Logo + name (dark mode)
Pin mark + "Pavver" text in white. Yellow pin, white wordmark.

**Use for:**
- Splash screen on dark backgrounds
- Headers in the app (which is dark mode)
- Social media profile banners
- Dark website headers

### `pavver-wordmark-light.svg` — Logo + name (light mode)
Pin mark + "Pavver" text in near-black. Yellow pin, dark wordmark.

**Use for:**
- Light-themed marketing pages
- Print materials
- Light-background social media posts
- Press kits

---

## Color values (lock these in)

```
Primary Yellow:  #FFD60A   (the brand yellow, Pavver Yellow)
Brand Dark:      #0A0A0F   (the pin, primary text on light)
Brand White:     #FFFFFF   (primary text on dark)
```

These three colors are the entire Pavver brand palette. The six user territory colors are separate (they're the game, not the brand).

---

## Sizing recommendations

| Context | Size |
|---|---|
| iOS app icon | 1024×1024 |
| Android adaptive icon | 432×432 (foreground), 432×432 background |
| iOS notification | 60×60 |
| Favicon | 32×32, 16×16 |
| In-app header logo | 32px height |
| Splash screen wordmark | 200–280px width |
| Email signature | 40px height |
| Instagram profile | 320×320 (crop to circle from icon) |

---

## Required clear space

Around the wordmark, keep clear space equal to the height of the "P" — no other content inside this margin. This keeps the brand looking premium and uncrowded.

---

## What NOT to do

- Do NOT recolor the pin in a user color. The pin is always dark (#0A0A0F) on a yellow background, or yellow on a dark background. The six user colors belong inside the app, not in the brand mark.
- Do NOT stretch, skew, or rotate the logo.
- Do NOT add drop shadows, glows, or gradients to the icon.
- Do NOT use the wordmark smaller than 24px tall — it gets unreadable.
- Do NOT use the pin mark smaller than 16px tall — the double-V detail disappears.
- Do NOT replace the Inter font in the wordmark with something else. If you don't have Inter, use a system sans-serif at 800 weight as a fallback.

---

## Generating other formats from these SVGs

Once you start building, you'll need raster versions (PNG, ICO) for various platforms. Easiest path:

**Free tools:**
- [CloudConvert](https://cloudconvert.com/svg-to-png) — SVG → PNG at any size
- [App Icon Generator](https://www.appicon.co/) — drop in 1024×1024 PNG, get all iOS + Android sizes
- [RealFaviconGenerator](https://realfavicongenerator.net/) — for web favicons

**Workflow:**
1. Open `pavver-icon.svg` in any browser, screenshot at 1024×1024 (or convert via CloudConvert)
2. Drop the PNG into appicon.co
3. Download the zip — it gives you every size iOS and Android need
4. For web, use RealFaviconGenerator with the same source

---

## A note on the font

The wordmark uses **Inter** at weight 800 (Extra Bold). Inter is free, open source, and excellent for Latin scripts. Download from [rsms.me/inter](https://rsms.me/inter/). If you ever ship a webpage with the wordmark inline, link the font from Google Fonts or self-host.

If you want to upgrade later, **General Sans** (paid) or **Geist** (free, by Vercel) are both alternatives worth considering. But Inter at 800 is more than good enough for launch.
