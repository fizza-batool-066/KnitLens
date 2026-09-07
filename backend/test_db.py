from database import db

try:
    db.command("ping")
    print("✅ MongoDB Connected Successfully")
except Exception as e:
    print("❌ Connection Failed")
    print(e)