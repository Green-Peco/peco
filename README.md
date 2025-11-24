
# PECO: Forest Protection & Community Engagement Platform

**Team Name:** Green  
**Track:** Forest Protection, Data Collection, Community Engagement  
**Team Members:**  
- Aisha (Lead)  
- Rita  
- Rene  

---

##  1. Project Overview: The Story of PECO

PECO is more than an application; it is a digital ecosystem that turns the daunting task of saving the planet into a daily, habit-forming lifestyle. It bridges the gap between knowing you should protect the environment and actually doing it. By weaving together the addictive progression of gamified learning, the instant connectivity of modern chat apps, and the viral speed of social media, PECO creates a world where a 12-year-old student, a 25-year-old activist, and a 60-year-old community leader can all stand on equal ground as "Eco-Guardians."

Here is the story of how PECO works, told through a day in the life of its users.

feature 1: The Morning Ritual (Gamified Education)
The journey begins with Education, but not the boring kind. Imagine a user, let’s call her Maya (12 years old). She opens PECO in the morning not to scroll mindlessly, but to save her "Streak."

The Feature: A Gamified Learning Engine (Duolingo-style).

The Experience: Maya sees a colorful path of nodes representing her course: "Introduction to Tree Planting." She clicks a bouncing node.

The Lesson: She doesn't read a textbook. She swipes through bite-sized, interactive cards—a 30-second video on how to dig a hole, a drag-and-drop quiz on identifying native seeds, and a true/false question on soil health.

The Reward: In 5 minutes, she finishes. The app celebrates with a burst of confetti. She earns 50 XP (Experience Points) and levels up to "Seedling Scout." A notification tells her: "You kept your forest alive for 15 days straight!"

feature 2: The Digital Town Square (Social Feed & Reporting)
While Maya learns, Samuel (25), a university student, is on his commute. He opens the Social Feed to see what is happening in the environmental world around him.

The Feature: A Social News Feed (Twitter/X-style) with a "Watchdog" capability.

The Experience: The feed is alive with photos, videos, and updates. Samuel sees a post from a neighbor showing a pile of uncollected waste near the river.

The Interaction:

Reactions: He reacts with a "Sad Seed" emoji.

Tagging: He comments and tags the local environmental group: "@RiverCleanUpTeam, have you seen this?"

The Watchdog Tool: Samuel notices a different post containing illegal logging activity. He hits the Report Button. A specialized menu pops up allowing him to categorize the report ("Illegal Logging"), add a geolocation, and escalate it to community moderators. This isn't just complaining; it's digital patrolling.

feature 3: The War Room (Community & Governance)
The alert from Samuel reaches Mama Wangari (55), a community organizer. She manages the "Green Warriors," a local group on PECO. She needs to mobilize people fast.

The Feature: Community Groups & Chat (WhatsApp-style).

The Experience: Wangari opens her Group Chat. It feels familiar—instant messaging, voice notes, and media sharing. But unlike WhatsApp, this group has Democratic Superpowers.

The Governance:

Polls: Wangari doesn't just demand action; she asks. She creates a Poll: "Where should our cleanup be this Saturday? Option A: Riverbank, Option B: Market."

Voting: The 50 members of the group vote instantly. The progress bar fills up. "Riverbank" wins.

Leadership: The group also uses the Election Tool to vote for their monthly Treasurer. It is transparent, fair, and automated.

Moderation: If a member starts spamming or being abusive, the group guidelines kick in. Users can report the offender, and the democratic moderation tools allow admins to remove them, ensuring the space remains safe and focused.

feature 4: The Loop of Action (Real-World Impact)
The story culminates when the digital world meets the physical world.

On Saturday, Maya (the student), Samuel (the activist), and Wangari (the leader) meet at the Riverbank.

Maya knows how to plant the trees because of her Morning Lessons.

Samuel is there because he saw the Social Feed Post.

Wangari is leading because the Community Poll selected this location.

After the event, they take a photo. They post it as a "Moment" on PECO.

Maya gets a "River Hero" Badge on her profile.

The Community earns Group XP to climb the regional leaderboard.

## PECO makes conservation accessible to the child, actionable for the youth, and manageable for the leader.


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
