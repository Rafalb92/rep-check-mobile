# RepCheck

> On-device movement screening for coaches and physiotherapists — record a movement, get instant joint-angle analysis, rep segmentation, and a shareable report. No video ever leaves the device.

**Status:** 🚧 Early development — MVP in progress

---

## Overview

RepCheck turns a phone into a movement-analysis tool. A trainer records a client performing a standard screen (e.g. an overhead squat), and the app runs pose estimation **entirely on-device** to compute joint angles, segment repetitions, flag asymmetries, and produce a clean report the trainer can share with the client.

Built mobile-first for the gym/clinic floor, with privacy by design: analysis runs locally, and only derived metrics — never raw video — are stored or synced.

## Tech stack

**App (current)**

- Expo SDK 56 / React Native (New Architecture)
- TypeScript
- UniWind (Tailwind-for-React-Native styling)
- Expo Router

**Computer vision & analysis (in progress)**

- `react-native-vision-camera` — capture
- MediaPipe Pose Landmarker — on-device pose estimation (BlazePose, 33 landmarks)
- `react-native-skia` — real-time skeleton overlay
- Custom DSP (TypeScript) — joint angles, rep segmentation, scoring
- `victory-native` — charts

**Persistence**

- `expo-sqlite` + Drizzle ORM (local-first)

**Planned (post-MVP)**

- NestJS API + PostgreSQL (Neon) — auth, sync, billing
- Stripe — subscriptions

## Requirements

- Node.js 22.11+
- **JDK 17** — required. Newer JDKs (21/26) are **not** supported by the Android toolchain for RN 0.83. JDK 17 is the current LTS standard.
- Android Studio + Android SDK (Platform 35/36, platform-tools, emulator)
- A physical Android device (recommended for camera / pose testing)

> ⚠️ **JDK note:** This project builds only on **JDK 17**. If your default `JAVA_HOME` points at a newer JDK, Android builds fail at the Gradle toolchain step. Point `JAVA_HOME` at your JDK 17 install for this project (you can keep other JDKs installed for other work).

## Getting started

```bash
# install dependencies
npm install

# build & install the dev client on a connected device/emulator (first run is slow)
npx expo run:android

# daily loop, once the dev client is installed
npx expo start --dev-client
```

RepCheck relies on native modules (camera, pose detection), so it runs in a **development build**, not Expo Go. Rebuild with `npx expo run:android` only when native dependencies change — JavaScript changes hot-reload instantly.

## Project structure

_(grows as the app develops)_

```
app/              # screens (expo-router)
src/
  components/     # UI components
  vision/         # camera + pose pipeline
  analysis/       # DSP: joint angles, segmentation, scoring
  db/             # drizzle schema + queries
  store/          # zustand state
global.css        # UniWind / Tailwind entry
```

## Roadmap

High level: **capture → on-device pose → analysis → report → local history → shareable report.**
Detailed 2-week MVP breakdown lives in `ROADMAP.md`.

## License

TBD
