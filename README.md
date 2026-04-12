# DotFlag

**DotFlag** is an open-source Capture The Flag (CTF) platform built with React + TypeScript on the frontend and .NET 8 + PostgreSQL on the backend. It provides a complete environment for hosting cybersecurity competitions, including real-time scoreboards, virtual container support, and a full admin panel.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture & Data Model](#architecture--data-model)
- [Use Case Diagram](#use-case-diagram)
- [UML Diagrams](#uml-diagrams)
- [Platform Screenshots](#platform-screenshots)
- [Getting Started](#getting-started)
- [License](#license)

---

## About

DotFlag is designed to be a self-hosted, extensible CTF platform suitable for university-level competitions and cybersecurity training. It follows a layered architecture to keep the codebase decoupled and maintainable.

---

## Features

| Feature | Description |
|---|---|
| Challenges | Browse, filter, and access challenges across multiple categories (Web, Pwn, Crypto, Reverse, Forensics, OSINT, Misc) with dynamic scoring |
| Flag Submission | Submit flags with instant verification and automatic score calculation |
| Dynamic Scoring | Challenge points decay as more users solve them (configurable min/max points, decay rate, first-blood bonus) |
| Leaderboard | Real-time scoreboard ranked by score with last-solve tiebreaker |
| Teams | Create or join teams via invite code, team management (leave, disband, regenerate invite) |
| User Profiles | View solved challenges, points earned, and performance statistics |
| Admin Panel | Challenge CRUD, user management (ban/unban, promote/demote), role-based access |
| Authentication | JWT-based auth with registration and login |
| Virtual Containers | Integrated support for spawning isolated Docker environments per challenge |

---

## Tech Stack

### Frontend

| Technology | Role |
|---|---|
| React 19 | UI framework |
| TypeScript 5.9 | Type-safe development |
| Vite 7 + SWC | Build tool and dev server |
| Tailwind CSS 3 | Styling |
| Axios | HTTP client with interceptors |
| React Router 7 | Client-side routing |

### Backend

| Technology | Role |
|---|---|
| .NET 8 | Web API framework (ASP.NET Core) |
| Entity Framework Core | Data access and migrations |
| PostgreSQL | Primary database |
| Swagger / OpenAPI | API documentation |

---

## Architecture & Data Model

The project follows a **layered architecture** with separation of concerns across four layers: Api, BusinessLayer, DataAccessLayer, and Domain.

The system is built around four core entities:

### User

| Field | Type | Description |
|---|---|---|
| Id | int | Primary key (auto-increment) |
| Username | string(30) | Display name |
| Email | string(50) | Login email |
| PasswordHash | string | Hashed password |
| Role | UserRole | `Guest` (0), `User` (1), `Admin` (20), `Owner` (30) |
| IsBanned | bool | Whether the user is banned |
| RegisteredOn | datetime | Registration date |
| TeamId | int? | Foreign key to Team (nullable) |
| TeamRole | TeamRole? | `Member` (0), `Leader` (1) |

### Challenge

| Field | Type | Description |
|---|---|---|
| Id | int | Primary key |
| Name | string(50) | Challenge name |
| Description | string(500) | Problem statement |
| Category | ChallengeCategory | `Web`, `Pwn`, `Crypto`, `Reverse`, `Forensics`, `Misc`, `OSINT` |
| Difficulty | ChallengeDifficulty | `Easy`, `Medium`, `Hard`, `Impossible` |
| MinPoints | int | Minimum points after full decay (default: 50) |
| MaxPoints | int | Starting points before any solves (default: 500) |
| CurrentPoints | int | Current point value (recalculated on each solve) |
| DecayRate | int | Controls how fast points decay (default: 30) |
| FirstBloodBonus | int | Extra points for the first solver (default: 10) |
| SolveCount | int | Number of correct submissions |
| FlagHash | string | Hashed flag (never exposed to users) |
| IsActive | bool | Whether the challenge is visible |
| CreatedOn | datetime | Creation date |

### Submission

| Field | Type | Description |
|---|---|---|
| Id | int | Primary key |
| UserId | int | Foreign key to User |
| ChallengeId | int | Foreign key to Challenge |
| Flag | string | The flag the user submitted |
| IsCorrect | bool | Whether the submission was correct |
| CreatedOn | datetime | Time of submission (used for tiebreaking) |

### Team

| Field | Type | Description |
|---|---|---|
| Id | int | Primary key |
| Name | string(25) | Team name (min 3 characters) |
| InviteCode | string(12) | Auto-generated invite code |
| CreatedOn | datetime | Creation date |
| IsActive | bool | Whether the team is active |

### Relationships

- One **User** can have many **Submissions**, one **Challenge** can have many **Submissions**
- One **Team** has many **Users** (members), a **User** belongs to at most one **Team**

---

## Use Case Diagram

The diagram below illustrates the three actor types and their allowed interactions with the platform.

![Use Case Diagram](./images/Use_cases.jpg)

| Actor | Capabilities |
|---|---|
| Guest | View the landing page, public scoreboard; register or log in |
| User | Browse and filter challenges; submit flags with instant verification; view own profile and statistics |
| Admin | Create, edit, and delete challenges; manage users (ban, change roles); view activity logs |
| Owner | Initial seeded account; can create Admin users; full platform control |

---

## UML Diagrams

### Component Diagram

High-level view of the system's layered architecture and external dependencies.

![Component Diagram](./images/Component_Arhitecture_UML.png)

### Class Diagrams

**Domain Entities** — core data models and their relationships.

![Class Diagram — Entities](./images/Class_Entities_UML.png)

**Data Access Layer** — EF Core context hierarchy and session management.

![Class Diagram — DataAccessLayer](./images/Class_DataAccessLayer_UML.png)

### Activity Diagrams

**Challenge Submission Flow** — user journey from browsing to solving a challenge.

![Activity — Challenge Submission](./images/Activity_Challenge_Submission_UML.png)

**Admin Panel Flow** — admin authentication, role check, and management operations.

![Activity — Admin Flow](./images/Activity_Admin_Flow_UML.png)

### Sequence Diagrams

**User Registration**

![Sequence — Register](./images/Register_UML.png)

**User Login**

![Sequence — Login](./images/Login_UML.png)

**Flag Submission**

![Sequence — Send Flag](./images/Send_Flag_UML.png)

**Admin Panel Operations**

![Sequence — Admin Panel](./images/Sequence_Admin_Panel_UML.png)

**Docker Container Startup**

![Sequence — Start Docker](./images/Start_Docker_UML.png)

---

## Platform Screenshots

| Page | Preview |
|---|---|
| Home Page | ![Home](./images/Home_page.png) |
| Dashboard | ![Dashboard](./images/Dashboard.png) |
| About | ![About](./images/About_page.png) |
| Challenges List | ![Challenges](./images/Challenges_page.png) |
| Challenge Overview | ![Challenge Overview](./images/Challange_overview.png) |
| Leaderboard | ![Leaderboard](./images/Leaderboard.png) |
| User Profile | ![User Profile](./images/User_profile_page.png) |
| Team | ![Team](./images/Team_page.png) |
| Admin — Challenges | ![Admin Challenges](./images/Admin_challenges_page.png) |
| Admin — Users | ![Admin Users](./images/Admin_users_page.png) |
| Admin — Docker | ![Admin Docker](./images/Admin_dockers_page.png) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- .NET 8 SDK
- PostgreSQL instance

### Frontend

```bash
git clone https://github.com/IvanGazul/DotFlag.git
cd DotFlag/frontend
npm install
```

By default the frontend runs with **mock data** so you can explore the UI without a backend.

To connect to a real backend, create a `.env.local` file **inside the `frontend/` folder** (next to `package.json`). You can copy the provided template and edit it:

```bash
# from DotFlag/frontend
cp .env.example .env.local
```

Then set `VITE_USE_MOCK=false` in that file:

```env
VITE_USE_MOCK=false
```

Now start the dev server:

```bash
npm run dev
```

> **Note:** `.env.local` is git-ignored and will not be committed. Each developer must create their own copy locally.

| Variable | Default | Description |
|---|---|---|
| `VITE_USE_MOCK` | `true` (set in `.env.example`) | Set to `false` in `.env.local` to use the real API instead of mock data |

### Backend

```bash
cd DotFlag/backend
```

Update the connection string in `appsettings.json` to point to your PostgreSQL instance:

```json
"ConnectionStrings": {
  "Default": "Host=localhost;Database=dotflag;Username=postgres;Password=yourpassword"
}
```

Apply migrations and run:

```bash
dotnet ef database update
dotnet run
```

---

## License

This project is licensed under the [MIT License](LICENSE).
