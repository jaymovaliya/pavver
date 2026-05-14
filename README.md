# Pavver

Gamified walking app. Walk routes → paint streets in your color → friends overwrite → weekly crown + reset.

For project conventions, tech stack, brand rules, and anti-patterns, read **[CLAUDE.md](./CLAUDE.md)** first.

| Doc | What's in it |
| --- | --- |
| [`CLAUDE.md`](./CLAUDE.md) | Project memory: stack, conventions, theme tokens, anti-patterns |
| [`docs/TECH_SPEC_1.md`](./docs/TECH_SPEC_1.md) | Data models, Cloud Functions, security rules, build order |
| [`docs/DESIGN_SPEC_2.md`](./docs/DESIGN_SPEC_2.md) | Screen-by-screen visual specifications (12 main + 3 sub = 15 layouts) |
| [`docs/WORKFLOW_1.md`](./docs/WORKFLOW_1.md) | Figma → code workflow + weekend checklists |
| [`docs/IDEAS_AND_GAPS.md`](./docs/IDEAS_AND_GAPS.md) | Spec drift, resolved decisions, parked ideas |

## Get started (custom dev client — NOT Expo Go)

```bash
npm install
cp .env.example .env          # then fill in Mapbox tokens
# drop Firebase config files at repo root (gitignored):
#   GoogleService-Info.plist  (iOS)
#   google-services.json      (Android)
npx expo prebuild --clean
npx expo run:ios              # or run:android
```
