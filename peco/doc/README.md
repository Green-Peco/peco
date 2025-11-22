# PECO Project Documentation

## Project Overview
PECO is a mobile application designed to help communities protect forests and the environment. Users can report illegal activities, share news, learn best practices, and participate in gamified activities to earn points and badges. The app supports login/register, community features, a feed, map, profile, and more.

## Architecture
- **Frontend:** Built with React Native (Expo Router), organized in the `frontend/mobile-peco` folder.
- **Backend:** (Not included here) Handles user authentication, data storage, and API endpoints.
- **Docs:** All documentation is in the `doc` folder.

## Folder Structure
```
peco/
  doc/            # Documentation
  frontend/       # Mobile frontend (React Native)
    mobile-peco/
      app/        # Expo Router screens and navigation
      assets/     # Images and icons
      components/ # Reusable UI components
      constants/  # Theme and config
      hooks/      # Custom hooks
      src/        # Legacy React Navigation screens/components
```

## How the Project Works
- Users start at the login/register screen (`auth.tsx`).
- After login, users access the main app via tabs: Feed, Map, Game, Community, Profile.
- Each tab is a separate screen in `app/(tabs)/`.
- The app uses green as the accent color and a clean, modern UI.

## Contribution Guidelines
- Keep screens organized in the correct folders.
- Document new features in this README and in code comments.
- Use clear, descriptive names for files and components.


---
For more details, see the frontend README below.
