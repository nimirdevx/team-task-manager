from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.db import get_database
from app.dependencies import get_current_user, require_admin
from app.schemas import AddMemberRequest, ProjectCreateRequest
from app.utils import serialize_document

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("")
async def get_projects(current_user: dict = Depends(get_current_user)):
    database = get_database()
    query = {"members": ObjectId(current_user["id"])}
    projects = await database.projects.find(query).sort("created_at", -1).to_list(length=500)
    return [serialize_document(project) for project in projects]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_project(payload: ProjectCreateRequest, _: dict = Depends(require_admin), current_user: dict = Depends(get_current_user)):
    database = get_database()
    project_doc = {
        "name": payload.name.strip(),
        "description": payload.description.strip(),
        "created_by": ObjectId(current_user["id"]),
        "members": [ObjectId(current_user["id"])],
        "created_at": datetime.now(timezone.utc),
    }
    result = await database.projects.insert_one(project_doc)
    created = await database.projects.find_one({"_id": result.inserted_id})
    return serialize_document(created)


@router.get("/{project_id}")
async def get_project_detail(project_id: str, current_user: dict = Depends(get_current_user)):
    database = get_database()
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    project = await database.projects.find_one({"_id": ObjectId(project_id)})
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    if ObjectId(current_user["id"]) not in project["members"] and current_user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a project member")

    tasks = await database.tasks.find({"project_id": ObjectId(project_id)}).sort("created_at", -1).to_list(length=1000)
    members = await database.users.find({"_id": {"$in": project["members"]}}).to_list(length=200)

    return {
        "project": serialize_document(project),
        "tasks": [serialize_document(task) for task in tasks],
        "members": [serialize_document(member) for member in members],
    }


@router.post("/{project_id}/members")
async def add_project_member(
    project_id: str,
    payload: AddMemberRequest,
    _: dict = Depends(require_admin),
):
    database = get_database()
    if not ObjectId.is_valid(project_id) or not ObjectId.is_valid(payload.user_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project or user not found")

    project = await database.projects.find_one({"_id": ObjectId(project_id)})
    user = await database.users.find_one({"_id": ObjectId(payload.user_id)})
    if not project or not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project or user not found")

    await database.projects.update_one(
        {"_id": ObjectId(project_id)},
        {"$addToSet": {"members": ObjectId(payload.user_id)}},
    )
    updated = await database.projects.find_one({"_id": ObjectId(project_id)})
    return serialize_document(updated)
