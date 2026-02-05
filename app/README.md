# How2split (Expo)

Cross-platform app: **web**, **iOS**, and **Android** from one TypeScript + React Native (Expo) codebase. Uses **Bun** as the package manager and runtime.

This is the migrated version of the original `frontend/` (React web) interface: same flows (create event, add expenses/transfers, settle) with React Navigation and native-friendly UI.

## Prerequisites

- [Bun](https://bun.sh/) installed
- For iOS: macOS with Xcode
- For Android: Android Studio / Android SDK
- For physical devices: [Expo Go](https://expo.dev/go) app (optional)

## Install

```bash
bun install
```

Optional: copy `.env.example` to `.env` and set `EXPO_PUBLIC_SERVER_URL` to your backend URL (defaults to production if unset).

## Run

| Platform | Command |
|----------|--------|
| **Web** | `bun run web` |
| **iOS** (simulator) | `bun run ios` |
| **Android** (emulator) | `bun run android` |
| **Dev server** (choose in terminal) | `bun run start` |

## Add Expo packages

Use Expo’s installer so versions stay compatible:

```bash
bunx expo install <package-name>
```

## Build for production

- **Web**: `bunx expo export --platform web` → output in `dist/` (or use EAS for hosting).
- **iOS / Android**: use [EAS Build](https://docs.expo.dev/build/introduction/) or run `bunx expo prebuild` then build with Xcode/Android Studio.

## Project layout

- `App.tsx` – root UI component (shared across web, iOS, Android)
- `app.json` – Expo config (name, slug, icons, splash, web favicon)
- `index.ts` – entry that registers the app with Expo

One codebase runs on all three platforms; use `Platform.OS` or responsive layout when you need platform-specific behavior.
