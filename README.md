# FlowTask — Team Task Manager

A full-stack web app where teams can create projects, assign tasks, and track progress with role-based access control (Admin / Member).

---

## Live Demo

> Deployed on Railway — https://flowtask-production.up.railway.app
> 
> Live at Vercel - https://flowtask-jade.vercel.app

---

## Features

- **Auth** — Signup / Login with JWT. Passwords hashed with bcrypt.
- **Role-based access** — Admins can manage members, delete any task/project. Members have limited access.
- **Projects** — Create and manage multiple projects. Add team members to projects.
- **Tasks** — Create tasks with title, description, priority (low/medium/high), due date, status, and assignee.
- **Task Board** — Drag-and-drop tasks across status columns (To Do → In Progress → Review → Done).
- **Dashboard** — Stats overview, weekly chart, recent activity feed.
- **Team** — View all workspace members, their roles and task counts.
- **Search** — Global search across tasks.
- **Overdue detection** — Tasks past due date are flagged automatically.

---

## Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Env config | dotenv |

### Frontend
| Layer | Technology |
|-------|-----------|
| Structure | HTML5 |
| Styling | CSS3 (custom, no framework) |
| Logic | Vanilla JavaScript |
| Fonts | Syne + DM Sans (Google Fonts) |

---

## Project Structure

```
flowtask/
├── backend/
│   ├── server.js             # Express app entry
│   ├── .env.example          # Environment variables template
│   ├── package.json
│   ├── models/
│   │   ├── User.js           # User schema (name, email, password, role)
│   │   ├── Project.js        # Project schema (name, members, owner)
│   │   └── Task.js           # Task schema (title, status, priority, assignee)
│   ├── routes/
│   │   ├── auth.js           # POST /signup, POST /login, GET /me
│   │   ├── tasks.js          # Full CRUD for tasks
│   │   ├── projects.js       # Full CRUD for projects + member management
│   │   └── users.js          # User management
│   └── middleware/
│       └── auth.js           # JWT protect + adminOnly middleware
└── frontend/
    ├── index.html            # Main app (SPA)
    ├── package.json
    └── assets/
        └── js/
            └── api.js        # API service layer (fetch wrappers)
```

---

## REST API Endpoints

### Auth
```
POST   /api/auth/signup      Create account
POST   /api/auth/login       Login
GET    /api/auth/me          Get current user (protected)
```

### Tasks
```
GET    /api/tasks            Get all tasks (with filters)
GET    /api/tasks/:id        Get single task
POST   /api/tasks            Create task
PATCH  /api/tasks/:id        Update task
DELETE /api/tasks/:id        Delete task
```

### Projects
```
GET    /api/projects           Get all user's projects
GET    /api/projects/:id       Get single project
POST   /api/projects           Create project
PATCH  /api/projects/:id       Update project
POST   /api/projects/:id/members  Add member
DELETE /api/projects/:id       Delete project + tasks
```

### Users
```
GET    /api/users            Get all users
GET    /api/users/:id        Get user by ID
PATCH  /api/users/:id        Update profile
DELETE /api/users/:id        Delete user (admin only)
```

---

## Setup & Run Locally

### Prerequisites
- Node.js v18+
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/flowtask.git
cd flowtask
```

### 2. Setup backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — add your MONGO_URI and JWT_SECRET
npm run dev
```

### 3. Run frontend
```bash
cd ../frontend
npx serve . -p 3000
```

Open `http://localhost:3000`

---

## Deployment on Railway

1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add a MongoDB plugin from Railway dashboard
4. Set environment variables:
   - `MONGO_URI` → Railway provides this automatically when you add MongoDB
   - `JWT_SECRET` → any random string
   - `CLIENT_URL` → your frontend URL
5. Deploy backend from `/backend` folder
6. Deploy frontend as a static site from `/frontend` folder

---

## Database Schema

### User
```json
{
  "name": "string",
  "email": "string (unique)",
  "password": "string (hashed)",
  "role": "admin | member",
  "phone": "string",
  "bio": "string"
}
```

### Project
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

### Task
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

## Developer

**Vyas Mittal**  
Email: vyasmittal1206@gmail.com  
Phone: +91 9027222011
