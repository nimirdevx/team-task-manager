from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, status

from app.db import get_database
from app.dependencies import require_admin
from app.schemas import UserRoleUpdateRequest
from app.utils import serialize_public_user

router = APIRouter(prefix="/users", tags=["users"])


def _created_sort_key(user: dict) -> str:
    """ISO strings from serialize_public_user sort chronologically."""
    s = user.get("created_at")
    if isinstance(s, str) and s:
        return s
    return "9999-12-31T23:59:59+00:00"


def _dedupe_users_by_email(users: list[dict]) -> list[dict]:
    """Keep one row per email (normalized); earliest created_at wins."""
    best: dict[str, dict] = {}
    for u in users:
        email = (u.get("email") or "").strip().lower()
        key = email or (u.get("id") or "")
        if not key:
            continue
        cur = best.get(key)
        if cur is None or _created_sort_key(u) < _created_sort_key(cur):
            best[key] = u
    out = list(best.values())
    out.sort(key=_created_sort_key)
    return out


@router.get("")
async def list_users(_: dict = Depends(require_admin)):
    database = get_database()
    raw = await database.users.find({}).sort("created_at", 1).to_list(length=500)
    serialized = [serialize_public_user(u) for u in raw]
    return _dedupe_users_by_email(serialized)


@router.patch("/{user_id}/role", response_model=dict)
async def update_user_role(
    user_id: str,
    payload: UserRoleUpdateRequest,
    _: dict = Depends(require_admin),
):
    database = get_database()
    try:
        oid = ObjectId(user_id)
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user id")

    target = await database.users.find_one({"_id": oid})
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if target.get("role") == payload.role:
        return serialize_public_user(target)

    if target.get("role") == "admin" and payload.role == "member":
        admin_count = await database.users.count_documents({"role": "admin"})
        if admin_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot remove the last organization admin",
            )

    await database.users.update_one({"_id": oid}, {"$set": {"role": payload.role}})
    updated = await database.users.find_one({"_id": oid})
    return serialize_public_user(updated)
