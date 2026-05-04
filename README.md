# Team Task Manager

Full-stack app: JWT auth, MongoDB, projects with members, tasks (assign, status, due dates), and a dashboard. **First signup is admin**; admins manage team roles and project membership.

## What it does

- Sign up / log in · JWT session
- **Admin:** create projects, add members by user ID, create tasks, open **Team & roles** to promote/demote (last admin protected)
- **Member:** view projects they belong to, see and update assigned tasks
- Dashboard: counts for your tasks (including overdue)

## Stack

Next.js 14 (App Router, Tailwind) · FastAPI · MongoDB (Motor) · Deploy on **Railway** (see below)

## Run locally

**Backend** (`cd backend`): `python3 -m venv .venv` → activate → `pip install -r requirements.txt` → `cp .env.example .env` → fill Mongo + JWT → `python3 -m uvicorn main:app --reload` → [http://localhost:8000](http://localhost:8000)

**Frontend** (`cd frontend`): `npm install` → `cp .env.local.example .env.local` → set `NEXT_PUBLIC_API_URL` → `npm run dev` → [http://localhost:3000](http://localhost:3000)

## Env

| Location | Variables |
|----------|-----------|
| `backend/.env` | `MONGODB_URL`, `DATABASE_NAME`, `JWT_SECRET`, `JWT_EXPIRE_MINUTES` |
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` (backend origin, no trailing slash) |


<!-- ## Live URLs -->
<!-- 
- Frontend: `team-task-manager-gamma-silk.vercel.app` 
- API:'https://team-task-manager-production-928c.up.railway.app'-->

