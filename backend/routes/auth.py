from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from database import users_collection
from models.user import UserCreate, UserLogin, UserUpdate
from utils.auth import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from utils.serializers import serialize_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
def register(user: UserCreate):
    existing_user = users_collection.find_one({"email": user.email.lower()})
    if existing_user:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    document = {
        "name": user.name.strip(),
        "email": user.email.lower(),
        "password": hash_password(user.password),
        "craft_level": "Beginner Crafter",
        "created_at": datetime.now(timezone.utc),
    }
    result = users_collection.insert_one(document)
    user_id = str(result.inserted_id)
    saved = users_collection.find_one({"_id": result.inserted_id})

    return {
        "message": "Account created successfully",
        "token": create_access_token(user_id),
        "user": serialize_user(saved),
    }


@router.post("/login")
def login(user: UserLogin):
    database_user = users_collection.find_one({"email": user.email.lower()})
    if not database_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(user.password, database_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid password")

    user_id = str(database_user["_id"])
    return {
        "message": "Login successful",
        "token": create_access_token(user_id),
        "user": serialize_user(database_user),
    }


@router.get("/me")
def me(current_user: dict = Depends(get_current_user)):
    return current_user


@router.put("/me")
def update_me(payload: UserUpdate, current_user: dict = Depends(get_current_user)):
    updates = {key: value for key, value in payload.model_dump().items() if value is not None}
    if not updates:
        return current_user

    from bson import ObjectId

    users_collection.update_one({"_id": ObjectId(current_user["id"])}, {"$set": updates})
    saved = users_collection.find_one({"_id": ObjectId(current_user["id"])})
    return serialize_user(saved)
