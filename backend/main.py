from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import close_db, connect_db
from app.routes.auth import router as auth_router
from app.routes.projects import router as projects_router
from app.routes.tasks import router as tasks_router
from app.routes.users import router as users_router


@asynccontextmanager
async def lifespan(_: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(title="Team Task Manager API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(tasks_router)
app.include_router(users_router)


@app.get("/")
async def root():
    return {"message": "Team Task Manager API running"}
