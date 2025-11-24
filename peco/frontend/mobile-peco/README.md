# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# PECO Mobile Frontend (Expo + React Native)

## Quick Start

1. Install dependencies:
   ```bash
   yarn install
   ```
2. Start Expo development server:
   ```bash
   expo start
   ```
3. Ensure backend is running at `http://localhost:8000`

## Main Features
- Home Awareness Feed (Reddit-style)
- Create Report (photo + location)
- Map View (reports on map)
- Auth (register/login, stores user_id)
- Profile (points, badges, logout)

## Testing Checklist
- Register a new user
- Create 3 reports (photo + location required)
- View reports on map
- Upvote/comment on feed items
- Open a lesson (placeholder)

## Folder Structure
- `src/screens/` — Main screens (Auth, HomeFeed, FeedDetail, CreateReport, Map, Profile)
- `src/components/` — UI components (FeedCard, etc.)
- `src/services/` — API helpers (all backend calls)
- `src/navigation/` — Navigation logic
- `src/assets/` — Images, icons
- `src/utils/` — Helpers, constants

## UX Notes
- Minimal, readable UI. Large tap targets.
- Feed: show short excerpt, tap to open full content.
- Reports require photo + location.
- Verified posts are visually distinct.
- Use toasts/loaders for network actions.

---

For any issues, check your backend is running and accessible at `http://localhost:8000`. All API URLs are in `src/services/api.js` for easy switching.
