# Frontend Implementation Explained

> **Note for Backend Developer:**


This document explains the structure, features, and design decisions made in the PECO mobile frontend (`frontend/mobile-peco`).

## Project Structure
- **app/**: Main folder for Expo Router navigation and screens.
  - `_layout.tsx`: Root navigation layout.
  - `auth.tsx`: Login/Register screen, shown first.
  - `(tabs)/`: Contains all main app tabs/screens.
    - `_layout.tsx`: Tab navigator.
    - `feed.tsx`: Reddit-style feed for reports, news, lessons, discussions.
    - `map.tsx`: Map screen for location-based features.
    - `game.tsx`: Leaderboard and gamification.
    - `community.tsx`: Community list, join/leave, search.
    - `profile.tsx`: User profile, stats, achievements, logout.
- **assets/**: Images and icons used in the app.
- **components/**: Reusable UI components (e.g., FeedCard, themed views).
- **constants/**: Theme colors and configuration.
- **hooks/**: Custom React hooks for color scheme and theme.
- **src/**: Legacy React Navigation screens/components (not used in Expo Router).

## Key Features & Decisions
- **Login/Register Flow**: The app starts at `auth.tsx`, prompting users to log in or register. Demo credentials are provided for easy testing.
- **Tab Navigation**: After login, users access the main app via tabs (Feed, Map, Game, Community, Profile). Each tab is a separate screen in `(tabs)`.
- **UI Design**: The app uses a clean, modern design with green as the accent color. The login/register screen uses a card layout and a leaf icon for branding.
- **Gamification**: The Game tab features a leaderboard, points, and badges to encourage user engagement.
- **Community Features**: Users can join/leave communities, search, and view details.
- **Profile**: Shows avatar, stats, achievements, recent activity, and logout.
- **Reusable Components**: UI elements like FeedCard are shared across screens for consistency.
- **Theme & Color Scheme**: Theme files and hooks allow easy switching between light/dark modes (if enabled).


