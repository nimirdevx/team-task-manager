from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, status

from app.auth import create_access_token, hash_password, verify_password
from app.db import get_database
from app.schemas import LoginRequest, SignupRequest, TokenResponse
from app.utils import serialize_document

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(payload: SignupRequest):
    database = get_database()
    existing = await database.users.find_one({"email": payload.email.lower()})
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user_count = await database.users.count_documents({})
    role = "admin" if user_count == 0 else "member"

    user_doc = {
        "name": payload.name.strip(),
        "email": payload.email.lower(),
        "hashed_password": hash_password(payload.password),
        "role": role,
        "created_at": datetime.now(timezone.utc),
    }
    result = await database.users.insert_one(user_doc)
    created_user = await database.users.find_one({"_id": result.inserted_id})
    user = serialize_document(created_user)
    token = create_access_token({"sub": user["id"], "role": user["role"]})
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest):
    database = get_database()
    user = await database.users.find_one({"email": payload.email.lower()})
    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    serialized = serialize_document(user)
    token = create_access_token({"sub": serialized["id"], "role": serialized["role"]})
    return {"access_token": token, "token_type": "bearer", "user": serialized}
