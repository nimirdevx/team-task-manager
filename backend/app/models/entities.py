from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class UserModel(BaseModel):
    id: str | None = None
    name: str
    email: EmailStr
    hashed_password: str
    role: Literal["admin", "member"] = "member"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ProjectModel(BaseModel):
    id: str | None = None
    name: str
    description: str = ""
    created_by: str
    members: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class TaskModel(BaseModel):
    id: str | None = None
    title: str
    description: str = ""
    project_id: str
    assigned_to: str
    status: Literal["todo", "in-progress", "done"] = "todo"
    due_date: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
