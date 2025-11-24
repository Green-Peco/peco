
# PECO: Forest Protection & Community Engagement Platform

**Team Name:** Green  
**Track:** Forest Protection, Data Collection, Community Engagement  
**Team Members:**  
- Aisha (Lead)  
- Rita  
- Rene  

---

##  1. Project Overview

PECO is a mobile-first platform empowering communities, rangers, and citizen scientists to protect forests and biodiversity. It enables real-time reporting, community engagement, environmental education, and gamified participation. Inspired by Wangari Maathai’s vision, PECO supports the goals of WMF/GBM with scalable, modern technology.

---

##  2. Problem Statement

Illegal logging, encroachment, and low community engagement threaten forests. Existing systems are fragmented and slow. PECO solves this by providing a unified, user-friendly platform for:
- Real-time incident reporting
- Community-driven data collection
- Environmental education
- Transparent monitoring and accountability

---

##  3. Solution & Features

- **Mobile App:** React Native (Expo) for Android/iOS
- **Feed:** Real-time updates (news, reports, lessons, discussions)
- **Map:** Location-based reporting/viewing
- **Game/Leaderboard:** Points, badges, achievements
- **Community:** Join/search/interact with forest groups
- **Profile:** Stats, achievements, recent activity
- **Admin Panel:** Node.js backend for authentication, data, and APIs

**Innovation Highlights:**
- Gamified conservation (points, badges, leaderboards)
- Real-time, geo-tagged incident reporting
- Community features for collaboration
- Scalable, modular architecture

---

##  4. Technical Architecture

### Frontend
- **Framework:** React Native (Expo Router)
- **Structure:** `/frontend/mobile-peco`
- **Key Components:** FeedCard, Community, GameScreen, ProfileScreen

### Backend
- **Framework:** Node.js, Express
- **Structure:** `/backend`
- **Session Management:** express-session + SQLite
- **Database:** SQLite (`peco.sqlite`)
- **Seed Data:** Demo user, achievements, course content

### Database Schema
- **Users:** Auth, XP, levels, streaks, admin flag
- **Posts:** Community feed, media, tags, reports
- **Communities:** Group info, membership
- **Chat:** Rooms, participants, messages
- **Courses/Lessons:** Environmental education, quizzes
- **Achievements:** Gamification, progress tracking

### API Endpoints

#### Authentication
- `POST /api/v1/auth/register` — Register new user
- `POST /api/v1/auth/login` — Login
- `POST /api/v1/auth/logout` — Logout

#### Courses & Lessons
- `GET /api/v1/courses` — List all courses
- `GET /api/v1/courses/:courseId` — Course details
- `GET /api/v1/lessons/:lessonId` — Lesson content
- `POST /api/v1/lessons/:lessonId/complete` — Complete lesson (gamified)

#### Users
- `GET /api/v1/users/profile` — User profile
- `GET /api/v1/users/progress` — Progress tracking
- `GET /api/v1/users/achievements` — Achievements
- `GET /api/v1/users/leaderboard` — Leaderboard

#### Posts (Feed)
- `GET /api/v1/posts` — All posts
- `GET /api/v1/posts/:postId` — Single post
- `POST /api/v1/posts` — Create post

#### Communities
- `GET /api/v1/communities` — List communities
- `GET /api/v1/communities/:communityId` — Community details
- `POST /api/v1/communities` — Create community (admin)
- `POST /api/v1/communities/:communityId/join` — Join community

#### Chat
- `GET /api/v1/chat/rooms` — List chat rooms
- `GET /api/v1/chat/rooms/:roomId/messages` — Get messages

---

## 5. Data Flow

1. **User Authentication:** Secure login/register via REST API.
2. **Reporting:** Users submit reports (location, photo, description) via mobile app.
3. **Feed/Map:** Data displayed in real-time feed and map.
4. **Community:** Users join groups, access chat, and collaborate.
5. **Gamification:** Completing lessons and reports earns points, badges, and leaderboard status.

---

##  6. Impact & Feasibility

- **Environmental Impact:** Faster, transparent reporting; increased engagement; data-driven decisions.
- **Feasibility:** Mobile-first, scalable, open-source, designed for integration with WMF/GBM workflows.

---

## 7. Scalability & Sustainability

- Modular design for easy feature addition
- Integrates with external APIs (e.g., GNews for Kenya news)
- Long-term maintainability with clear documentation
- Flexible for different forest contexts and user groups

---

##  8. How to Run Locally

**Backend:**
```bash
cd peco/backend
npm install
node serve.js
```

**Frontend:**
```bash
cd peco/frontend/mobile-peco
npm install
npx expo start
```

**Database:**
- SQLite file: `/backend/data/peco.sqlite`
- Schema: `/backend/database-schema.sql`
- Seed script: `/backend/data/initialize-db.js`

---

##  9. Why PECO Wins

- **Real Impact:** Solves real problems for forest protection and community engagement.
- **Technical Excellence:** Modern stack, clean code, robust APIs, scalable backend.
- **User Experience:** Beautiful UI, gamified features, real-time data.
- **Open & Extensible:** Ready for future growth, integration, and collaboration.

---

##  10. Authors & Contact

- **Project Lead:** Aisha
- **Team Members:** Rene, Rita
- **Contact:** [aishaomarfarah@gmail.com]

---

*PECO: Protecting Forests, Empowering Communities, Inspiring Change.*

---
