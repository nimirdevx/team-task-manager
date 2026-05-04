from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator


class SignupRequest(BaseModel):
    name: str = Field(min_length=1)
    email: EmailStr
    password: str = Field(min_length=6)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class ProjectCreateRequest(BaseModel):
    name: str = Field(min_length=1)
    description: str = ""


class AddMemberRequest(BaseModel):
    user_id: str = Field(min_length=1)


class UserRoleUpdateRequest(BaseModel):
    role: Literal["admin", "member"]


class TaskCreateRequest(BaseModel):
    title: str = Field(min_length=1)
    description: str = ""
    project_id: str = Field(min_length=1)
    assigned_to: str = Field(min_length=1)
    status: Literal["todo", "in-progress", "done"] = "todo"
    due_date: datetime

    @field_validator("due_date")
    @classmethod
    def validate_due_date(cls, value: datetime) -> datetime:
        if not isinstance(value, datetime):
            raise ValueError("due_date must be a valid date")
        return value


class TaskStatusUpdateRequest(BaseModel):
    status: Literal["todo", "in-progress", "done"]


class DashboardResponse(BaseModel):
    total_tasks: int
    completed: int
    in_progress: int
    overdue: int
    recent_tasks: list[dict]
