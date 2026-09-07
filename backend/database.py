from pymongo import ASCENDING, MongoClient

from config import DATABASE_NAME, MONGO_URI

if not MONGO_URI:
    raise RuntimeError("MONGO_URI is not set. Add it to backend/.env before starting the app.")

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client[DATABASE_NAME]

try:
    db.command("ping")
except Exception as error:
    raise RuntimeError(f"MongoDB connection failed: {error}") from error

users_collection = db["users"]
projects_collection = db["projects"]
scans_collection = db["scans"]

users_collection.create_index([("email", ASCENDING)], unique=True)
projects_collection.create_index([("user_id", ASCENDING)])
scans_collection.create_index([("user_id", ASCENDING)])
scans_collection.create_index([("project_id", ASCENDING)])
scans_collection.create_index([("created_at", ASCENDING)])
