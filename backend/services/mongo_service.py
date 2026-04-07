import os
import logging
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

# Note: We won't connect immediately at module load if the URI is missing,
# to avoid crashing the app when MongoDB isn't configured yet.
client: Optional[AsyncIOMotorClient] = None
db = None
quizzes_collection = None
plans_collection = None
ai_logs_collection = None
quiz_results_collection = None

def get_mongo_db():
    global client, db, quizzes_collection, plans_collection, ai_logs_collection, quiz_results_collection
    
    if client is not None:
        return db
        
    mongodb_uri = os.getenv("MONGODB_URI")
    if not mongodb_uri:
        logger.warning("MONGODB_URI not set. MongoDB integrations will be disabled.")
        return None
        
    try:
        client = AsyncIOMotorClient(mongodb_uri, serverSelectionTimeoutMS=5000)
        db = client.studify_db
        quizzes_collection = db.quizzes
        plans_collection = db.study_plans
        ai_logs_collection = db.ai_analysis_logs
        quiz_results_collection = db.quiz_results
        logger.info("Connected to MongoDB successfully.")
        return db
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        client = None
        return None

async def save_quiz(subject_id: str, quiz_data: List[Dict[str, Any]]) -> Optional[str]:
    """Save a generated quiz to MongoDB."""
    database = get_mongo_db()
    if database is None:
        return None
        
    document = {
        "subject_id": subject_id,
        "questions": quiz_data,
        "created_at": datetime.now(timezone.utc)
    }
    
    try:
        result = await quizzes_collection.insert_one(document)
        return str(result.inserted_id)
    except Exception as e:
        logger.error(f"Error saving quiz to MongoDB: {e}")
        return None

async def save_quiz_result(user_id: str, subject_id: str, subject_name: str,
                           score: int, total_questions: int, time_seconds: int) -> Optional[str]:
    """Save a quiz attempt result to MongoDB."""
    database = get_mongo_db()
    if database is None:
        return None

    percentage = round((score / total_questions) * 100) if total_questions > 0 else 0
    document = {
        "user_id": user_id,
        "subject_id": subject_id,
        "subject_name": subject_name,
        "score": score,
        "total_questions": total_questions,
        "percentage": percentage,
        "time_seconds": time_seconds,
        "created_at": datetime.now(timezone.utc)
    }

    try:
        result = await quiz_results_collection.insert_one(document)
        return str(result.inserted_id)
    except Exception as e:
        logger.error(f"Error saving quiz result to MongoDB: {e}")
        return None

async def get_quiz_results_by_user(user_id: str) -> List[Dict[str, Any]]:
    """Fetch all quiz results for a user from MongoDB, newest first."""
    database = get_mongo_db()
    if database is None:
        return []

    try:
        cursor = quiz_results_collection.find({"user_id": user_id}).sort("created_at", -1)
        results = await cursor.to_list(length=100)
        for r in results:
            r["_id"] = str(r["_id"])
            r["created_at"] = r["created_at"].isoformat()
        return results
    except Exception as e:
        logger.error(f"Error fetching quiz results from MongoDB: {e}")
        return []

async def get_quizzes_by_subject(subject_id: str) -> List[Dict[str, Any]]:
    """Fetch all quizzes for a specific subject from MongoDB."""
    database = get_mongo_db()
    if database is None:
        return []
        
    try:
        cursor = quizzes_collection.find({"subject_id": subject_id}).sort("created_at", -1)
        quizzes = await cursor.to_list(length=100)
        
        # Convert ObjectId to string for JSON serialization
        for quiz in quizzes:
            quiz["_id"] = str(quiz["_id"])
            
        return quizzes
    except Exception as e:
        logger.error(f"Error fetching quizzes from MongoDB: {e}")
        return []

async def save_study_plan(user_id: str, plan_data: Dict[str, Any]) -> Optional[str]:
    """Save a generated study timetable to MongoDB."""
    database = get_mongo_db()
    if database is None:
        return None
        
    document = {
        "user_id": user_id,
        "plan": plan_data,
        "created_at": datetime.now(timezone.utc)
    }
    
    try:
        result = await plans_collection.insert_one(document)
        return str(result.inserted_id)
    except Exception as e:
        logger.error(f"Error saving study plan to MongoDB: {e}")
        return None

async def get_study_plans_by_user(user_id: str) -> List[Dict[str, Any]]:
    """Fetch all study plans for a specific user from MongoDB."""
    database = get_mongo_db()
    if database is None:
        return []
        
    try:
        cursor = plans_collection.find({"user_id": user_id}).sort("created_at", -1)
        plans = await cursor.to_list(length=50)
        
        for plan in plans:
            plan["_id"] = str(plan["_id"])
            
        return plans
    except Exception as e:
        logger.error(f"Error fetching study plans from MongoDB: {e}")
        return []

async def save_ai_log(file_id: str, prompt: str, raw_response: str) -> Optional[str]:
    """Save raw AI responses for debugging or fine-tuning."""
    database = get_mongo_db()
    if database is None:
        return None
        
    document = {
        "file_id": file_id,
        "prompt": prompt,
        "raw_response": raw_response,
        "created_at": datetime.now(timezone.utc)
    }
    
    try:
        result = await ai_logs_collection.insert_one(document)
        return str(result.inserted_id)
    except Exception as e:
        logger.error(f"Error saving AI log to MongoDB: {e}")
        return None
