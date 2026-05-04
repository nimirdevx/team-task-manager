from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, status

from app.db import get_database
from app.dependencies import require_admin
from app.schemas import UserRoleUpdateRequest
from app.utils import serialize_public_user

router = APIRouter(prefix="/users", tags=["users"])


@router.get("")
async def list_users(_: dict = Depends(require_admin)):
    database = get_database()
    users = await database.users.find({}).sort("created_at", 1).to_list(length=500)
    return [serialize_public_user(u) for u in users]


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
