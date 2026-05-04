from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.db import get_database
from app.dependencies import get_current_user, is_overdue, require_admin
from app.schemas import TaskCreateRequest, TaskStatusUpdateRequest
from app.utils import serialize_document

router = APIRouter(tags=["tasks"])


@router.get("/tasks")
async def get_assigned_tasks(current_user: dict = Depends(get_current_user)):
    database = get_database()
    tasks = await database.tasks.find({"assigned_to": ObjectId(current_user["id"])}).sort("created_at", -1).to_list(length=1000)
    serialized = [serialize_document(task) for task in tasks]
    for task in serialized:
        task["is_overdue"] = is_overdue(task)
    return serialized


@router.post("/tasks", status_code=status.HTTP_201_CREATED)
async def create_task(payload: TaskCreateRequest, _: dict = Depends(require_admin)):
    database = get_database()
    if not ObjectId.is_valid(payload.project_id) or not ObjectId.is_valid(payload.assigned_to):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project or assignee not found")

    project = await database.projects.find_one({"_id": ObjectId(payload.project_id)})
    assignee = await database.users.find_one({"_id": ObjectId(payload.assigned_to)})
    if not project or not assignee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project or assignee not found")

    if ObjectId(payload.assigned_to) not in project["members"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Assignee must be a project member")

    task_doc = {
        "title": payload.title.strip(),
        "description": payload.description.strip(),
        "project_id": ObjectId(payload.project_id),
        "assigned_to": ObjectId(payload.assigned_to),
        "status": payload.status,
        "due_date": payload.due_date,
        "created_at": datetime.now(timezone.utc),
    }
    result = await database.tasks.insert_one(task_doc)
    created = await database.tasks.find_one({"_id": result.inserted_id})
    task = serialize_document(created)
    task["is_overdue"] = is_overdue(task)
    return task


@router.patch("/tasks/{task_id}/status")
async def update_task_status(task_id: str, payload: TaskStatusUpdateRequest, current_user: dict = Depends(get_current_user)):
    database = get_database()
    if not ObjectId.is_valid(task_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    task = await database.tasks.find_one({"_id": ObjectId(task_id)})
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    can_edit = current_user["role"] == "admin" or str(task["assigned_to"]) == current_user["id"]
    if not can_edit:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot update this task")

    await database.tasks.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"status": payload.status}},
    )
    updated = await database.tasks.find_one({"_id": ObjectId(task_id)})
    serialized = serialize_document(updated)
    serialized["is_overdue"] = is_overdue(serialized)
    return serialized


@router.get("/dashboard")
async def get_dashboard(current_user: dict = Depends(get_current_user)):
    database = get_database()
    query = {"assigned_to": ObjectId(current_user["id"])}
    tasks = await database.tasks.find(query).sort("created_at", -1).to_list(length=1000)
    serialized = [serialize_document(task) for task in tasks]
    for task in serialized:
        task["is_overdue"] = is_overdue(task)

    return {
        "total_tasks": len(serialized),
        "completed": len([task for task in serialized if task["status"] == "done"]),
        "in_progress": len([task for task in serialized if task["status"] == "in-progress"]),
        "overdue": len([task for task in serialized if task["is_overdue"]]),
        "recent_tasks": serialized[:5],
    }
