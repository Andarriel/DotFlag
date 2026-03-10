# DotFlag

**DotFlag** is an open-source Capture The Flag (CTF) platform built with React + TypeScript on the frontend and .NET 10 + PostgreSQL on the backend. It provides a complete environment for hosting cybersecurity competitions, including real-time scoreboards, virtual container support, and a full admin panel.

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

DotFlag is designed to be a self-hosted, extensible CTF platform suitable for university-level competitions and cybersecurity training. It follows Clean Architecture principles to keep the codebase decoupled, testable, and maintainable.

---

## Features

| Feature | Description |
|---|---|
| Challenges List | Browse, filter, and access challenges across multiple categories (Web, Pwn, Crypto, Reverse Engineering, etc.) |
| Challenge Detail | Dedicated page per challenge with a flag submission field and instant feedback |
| Admin Panel | Full control over challenge creation, user management, and activity logs |
| Leaderboard | Real-time scoreboard ranked by points and submission time |
| Virtual Containers | Integrated support for spawning isolated environments per challenge |
| User Profile | Detailed history of solved challenges, points earned, and performance statistics |
| Team Chat *(in progress)* | Collaboration tools for team-based competition strategy |

---

## Tech Stack

### Frontend

| Technology | Role |
|---|---|
| React 18 | UI framework |
| TypeScript | Type-safe development |
| SWC | Fast compilation |
| Vite | Build tool and dev server |

### Backend

| Technology | Role |
|---|---|
| .NET 10 | Web API framework (ASP.NET Core) |
| Entity Framework Core | Data access and migrations |
| PostgreSQL | Primary database |
| Session-based Auth | Stateful authentication without JWT tokens |

---

## Architecture & Data Model

The project follows **Clean Architecture** to ensure separation of concerns across layers: API, Application, Domain, and Infrastructure.

The system is built around three core entities:

### User

| Field | Type | Description |
|---|---|---|
| Id | int / guid | Primary key |
| Username | string | Display name |
| Email | string | Login email |
| PasswordHash | string | Hashed password |
| Role | enum | `Admin` or `User` |
| CurrentPoints | int | Accumulated score |

### Challenge

| Field | Type | Description |
|---|---|---|
| Id | int | Primary key |
| Title | string | Challenge name |
| Description | string | Problem statement |
| Points | int | Score value |
| Category | string / enum | e.g. Web, Crypto, Pwn |
| Flag | string | Correct answer (hidden from users) |
| IsActive | bool | Whether the challenge is visible |

### Submission

| Field | Type | Description |
|---|---|---|
| Id | int | Primary key |
| UserId | int | Reference to User |
| ChallengeId | int | Reference to Challenge |
| SubmittedFlag | string | The flag the user submitted |
| IsCorrect | bool | Whether the submission was correct |
| Timestamp | datetime | Time of submission (used for tiebreaking) |

The core relationship: one **User** can have many **Submissions**, and one **Challenge** can have many **Submissions** (1 — *(N)* — 1).

---

## Use Case Diagram

> The diagram below illustrates the three actor types and their allowed interactions with the platform.

<!-- Replace with your use case diagram image -->
![Use Case Diagram](https://example.com/assets/use-case-diagram.png)

| Actor | Capabilities |
|---|---|
| Guest | View the landing page, public scoreboard; register or log in |
| User | Browse and filter challenges; submit flags with instant verification; view own profile and statistics |
| Admin | Create, edit, and delete challenges; manage users (ban, change roles); view activity logs (who submitted what flag, when, and from where) |

---

## UML Diagrams

<!-- Replace with your UML / class diagrams -->
![UML Diagram](https://example.com/assets/uml-diagram.png)

---

## Platform Screenshots

<!-- Replace each URL below with the actual screenshot hosted on example.com -->

| Page | Preview |
|---|---|
| Landing Page | ![Landing](https://example.com/assets/screen-landing.png) |
| Login / Register | ![Login](https://example.com/assets/screen-login.png) |
| Dashboard | ![Dashboard](https://example.com/assets/screen-dashboard.png) |
| Challenges List | ![Challenges](https://example.com/assets/screen-challenges.png) |
| Challenge Detail | ![Detail](https://example.com/assets/screen-challenge-detail.png) |
| Scoreboard | ![Scoreboard](https://example.com/assets/screen-scoreboard.png) |
| User Profile | ![Profile](https://example.com/assets/screen-profile.png) |
| Admin Panel | ![Admin](https://example.com/assets/screen-admin.png) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- .NET 10 SDK
- PostgreSQL instance

### Frontend

```bash
git clone https://github.com/IvanGazul/DotFlag.git
cd DotFlag/frontend
npm install
npm run dev
```

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