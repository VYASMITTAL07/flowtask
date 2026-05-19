# FlowTask — Team Task Manager

> A full-stack project management app with role-based access, real-time task tracking, and drag-and-drop task board.

**Live App** → [flowtask-jade.vercel.app](https://flowtask-jade.vercel.app)  
**Backend API** → [flowtask-production.up.railway.app](https://flowtask-production.up.railway.app)  

---

## What I Built

FlowTask is a full-stack web application that lets teams create projects, assign tasks to members, and track work from creation to completion. I built it to practice full-stack development — connecting a real Node.js + Express backend to a MongoDB database, with JWT authentication and role-based access control.

The frontend is a single-page app written in plain HTML, CSS, and JavaScript — no React, no framework — which helped me understand how SPAs actually work under the hood.

---

## Features

- **JWT Authentication** — Signup and login with tokens stored client-side. Passwords hashed with bcrypt before hitting the database.
- **Role-based access (Admin / Member)** — Admins can create projects, invite members, and delete any task. Members can only work within projects they're assigned to.
- **Projects** — Create projects, track progress automatically based on task completion percentage.
- **Tasks** — Full CRUD with priority levels (high/medium/low), due dates, assignee, and status.
- **Drag-and-drop Task Board** — Move tasks across columns: To Do → In Progress → Review → Done. Status updates hit the real API on drop.
- **Dashboard** — Live stats (total, done, in-progress, overdue), weekly activity chart, recent task feed.
- **Team view** — See all workspace members, their roles, and how many tasks they've completed.
- **Overdue detection** — Tasks past their due date are automatically flagged in red.
- **Global search** — Filter tasks by title in real time.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Deployment | Vercel (frontend), Railway (backend + MongoDB) |

---

## Project Structure

```
flowtask/
├── server.js              # Express entry point
├── package.json
├── .env.example
├── models/
│   ├── User.js            # User schema — name, email, hashed password, role
│   ├── Project.js         # Project schema — owner, members[], status
│   └── Task.js            # Task schema — title, priority, status, assignee, dueDate
├── routes/
│   ├── auth.js            # POST /signup  POST /login  GET /me
│   ├── tasks.js           # GET POST PATCH DELETE /tasks
│   ├── projects.js        # GET POST PATCH DELETE /projects + member add
│   └── users.js           # GET PATCH DELETE /users
├── middleware/
│   └── auth.js            # JWT protect middleware + adminOnly guard
└── frontend/
    └── index.html         # Full SPA — auth, dashboard, tasks, board, team
```

---

## REST API

```
POST   /api/auth/signup          Register new user
POST   /api/auth/login           Login → returns JWT
GET    /api/auth/me              Get logged-in user (protected)

GET    /api/tasks                All tasks for user's projects (filterable)
POST   /api/tasks                Create task
PATCH  /api/tasks/:id            Update status, priority, assignee
DELETE /api/tasks/:id            Delete (creator or admin only)

GET    /api/projects             All projects user belongs to
POST   /api/projects             Create project
PATCH  /api/projects/:id         Update project details
POST   /api/projects/:id/members Add team member to project
DELETE /api/projects/:id         Delete project + all its tasks

GET    /api/users                All workspace users
PATCH  /api/users/:id            Update own profile
DELETE /api/users/:id            Admin only
```

---

## Database Schemas

**User**
```json
{
  "name": "string",
  "email": "string (unique, lowercase)",
  "password": "string (bcrypt hashed, hidden from responses)",
  "role": "admin | member",
  "phone": "string",
  "bio": "string"
}
```

**Project**
```json
{
  "name": "string",
  "description": "string",
  "owner": "ObjectId → User",
  "members": ["ObjectId → User"],
  "color": "1-5",
  "status": "active | archived"
}
```

**Task**
```json
{
  "title": "string",
  "description": "string",
  "status": "todo | in-progress | review | done",
  "priority": "low | medium | high",
  "dueDate": "Date",
  "project": "ObjectId → Project",
  "assignee": "ObjectId → User",
  "createdBy": "ObjectId → User",
  "tags": ["string"]
}
```

---

## Local Setup

### Requirements
- Node.js v18+
- MongoDB (local or Atlas)

### Steps

```bash
# Clone
git clone https://github.com/VYASMITTAL07/flowtask.git
cd flowtask

# Install
npm install

# Environment
cp .env.example .env
# Fill in: MONGO_URI, JWT_SECRET, PORT, CLIENT_URL

# Run
npm run dev
```

Open `frontend/index.html` in browser or serve it with `npx serve frontend`

---

## Deployment

**Backend → Railway**
1. Connect GitHub repo to Railway
2. Add MongoDB plugin → copy the connection string
3. Set env vars: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`
4. Deploy — Railway auto-detects Node.js

**Frontend → Vercel**
1. Connect GitHub repo to Vercel
2. Set root directory to `frontend`
3. Deploy — no build step needed for plain HTML

---

## Challenges I Faced

- **CORS between Vercel and Railway** — had to configure the Express CORS middleware to accept the Vercel domain specifically
- **JWT expiry handling** — added token check on every API call, redirects to login if expired
- **Mongoose population** — tasks reference both User and Project; getting the right fields populated without over-fetching took some iteration
- **Drag and drop without a library** — built it with native HTML5 drag events, updating task status via PATCH on drop

---

## Developer

**Vyas Mittal**  
Email: vyasmittal1206@gmail.com  
Phone: +91 9027222011  
GitHub: [VYASMITTAL07](https://github.com/VYASMITTAL07)
