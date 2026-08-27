# 👤 User Profiles & GCP Cloud Sync Feature

## 📌 Overview
The `user-profiles` feature allows players to manage multiple independent save profiles (e.g. different farm runs, challenge files, multi-player accounts) and synchronize them bidirectional with the GCP JSON Document DB (`db.dunhas.com`).

## 📁 Architecture
- `types.ts`: TypeScript interfaces for profiles, cloud response structs, and avatar definitions.
- `defaultProfiles.ts`: Avatar catalog and profile factory.
- `userProfileApi.ts`: REST API client for `https://db.dunhas.com/api/coral_fish_users`.
- `UserProfileContext.tsx`: Main profile provider, active profile switching, and debounced cloud sync.
- `UserProfileSelector.tsx`: Compact profile selector button for sidebars and headers.
- `UserProfileCard.tsx`: Individual profile item card with progress badges and actions.
- `UserProfileModal.tsx`: Management dialog with local profiles, cloud explorer, and server config.
- `CloudSyncIndicator.tsx`: Visual connection & synchronization status badge.

## 📏 Architecture Rules
- All files must remain strictly under 300 lines.
- Local-first architecture: Offline caching via `localStorage`.
