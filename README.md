# Team Task Manager

A full-stack team task management web app with JWT authentication, role-based access, project collaboration, and task tracking dashboards.

## Tech Stack

- Frontend: Next.js 14 (App Router), Tailwind CSS
- Backend: FastAPI (Python)
- Database: MongoDB with Motor (async)
- Auth: JWT (`python-jose`) + password hashing (`passlib`)
- Deployment: Railway

## Project Structure

- `frontend` - Next.js application
- `backend` - FastAPI application

## Local Setup

### 1) Backend setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

Backend runs on `http://localhost:8000`.

### 2) Frontend setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Environment Variables

### Backend (`backend/.env`)

- `MONGODB_URL` - Mongo connection string (example: `mongodb://localhost:27017`)
- `DATABASE_NAME` - Mongo database name (example: `taskmanager`)
- `JWT_SECRET` - Secret key used to sign JWT access tokens
- `JWT_EXPIRE_MINUTES` - Token expiration in minutes (example: `1440`)

### Frontend (`frontend/.env.local`)

- `NEXT_PUBLIC_API_URL` - Backend base URL (example: `http://localhost:8000`)

## Railway Deployment Notes

- Backend uses `backend/Procfile` and `backend/railway.toml`.
- Frontend uses `next.config.js` with `output: "standalone"` and `frontend/railway.toml`.
- Create two Railway services from the same repo:
  - Service 1 root directory: `backend`
  - Service 2 root directory: `frontend`

## Live URL

- Frontend: `https://your-frontend-url.railway.app`
- Backend: `https://your-backend-url.railway.app`
