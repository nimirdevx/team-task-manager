from datetime import datetime, timezone

from bson import ObjectId
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.auth import decode_access_token
from app.db import get_database
from app.utils import serialize_document

security = HTTPBearer(auto_error=True)


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    database = get_database()

    payload = decode_access_token(credentials.credentials)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = await database.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return serialize_document(user)


def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user


def is_overdue(task: dict) -> bool:
    due = task.get("due_date")
    if not due:
        return False
    if isinstance(due, str):
        due = datetime.fromisoformat(due)
    if due.tzinfo is None:
        due = due.replace(tzinfo=timezone.utc)
    return task.get("status") != "done" and due < datetime.now(timezone.utc)
