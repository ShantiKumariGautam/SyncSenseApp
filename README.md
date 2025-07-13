# SyncSenseApp – Behavioral Biometrics Data Logger 

SyncSenseApp is a privacy-conscious mobile app built with **React Native** and **Expo**, designed to collect **gesture-based behavioral data** for training AI models in continuous authentication.

Instead of traditional password systems, this app captures real-world user behaviors like **touch patterns**, **scroll speed**, **device motion**, and **location context**, forming a solid base for training models in **behavior-based authentication**.

## 🔗 APK Installation

> ⚠️ This is a standalone APK build. You do **not** need Expo Go.

- Download the APK directly via this [Expo Install Link](https://expo.dev/accounts/shantikumarigautam/projects/SyncSenseApp/builds/fd6e0eac-ebfc-4b5a-91f2-c22d46b5fb17)
- Install the APK on your mobile phone
- Open the app and proceed to interact with the screens (touch, scroll, etc.)
- Ignore any warnings during install — the build is safe and production-ready

---

##  What SyncSenseApp Collects

### 1️ Touch & Gesture Data
- X and Y coordinates of finger movement
- Duration of the swipe/gesture
- Scroll speed and normalized Y position
- Time-based gesture logs per session

📍 _Saved under:_ `users/{username}/{sessionId}/collectedGestures`

---

### 2️ Gyroscope Data
- Captures angular velocity on X, Y, Z axes
- Logged every 100ms with timestamps

📍 _Saved under:_ `users/{username}/{sessionId}/gyroscopeData`

---

### 3️ Accelerometer Data
- Raw acceleration across X, Y, Z
- Captured every 100ms for motion profiling

📍 _Saved under:_ `users/{username}/{sessionId}/accelerometerData`

---

### 4️ Scroll Behavior Summary
- Tracks direction-based scroll speeds
  - Average upward scroll speed
  - Average downward scroll speed
- Scroll completion % tracked via custom indicator

📍 _Saved via utility:_ `saveGesture()` with type `scrollSummary`

---

### 5 Geolocation
- Captures initial GPS coordinates on session start
- Timestamped with session metadata

📍 _Saved under:_ `users/{username}/{sessionId}/location`

---

## 🛠️ Tech Stack

| Layer         | Technology Used        |
|---------------|-------------------------|
| Frontend      | React Native + Expo SDK |
| Backend       | Firebase Realtime DB    |
| Sensors       | Expo Location, Gyroscope, DeviceMotion |
| Deployment    | Expo Build → APK link   |

---

##  Use Case

SyncSenseApp enables **real-time gesture data collection** on mobile devices. This behavioral dataset is ideal for:
- Continuous authentication systems
- Personalized UX behavior tracking
- Cybersecurity for shared/public devices
- Privacy-first biometric research

---

## Conclusion

As mobile threats rise and passwords fall short, **behavioral biometrics** offer a promising new path. SyncSenseApp captures subtle user behaviors — like how you scroll, swipe, and move — in a secure and device-local way. With its minimal UI, regional language support potential, and APK-based delivery, it’s **tailored for real users**, especially those not tech-savvy.

Built with empathy, engineered for intelligence.

---




