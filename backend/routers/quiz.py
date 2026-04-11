from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging
from pydantic import BaseModel

from database import get_db
from models.db_models import Subject, UploadedFile
from models.schemas import QuizRequest
from services.ppt_parser import parse_pptx
from services.quiz_generator import generate_quiz
from services.mongo_service import (
    save_quiz, get_quizzes_by_subject,
    save_quiz_result, get_quiz_results_by_user
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/quiz", tags=["quiz"])


class QuizResultCreate(BaseModel):
    user_id: str
    subject_id: str
    subject_name: str
    score: int
    total_questions: int
    time_seconds: int


@router.post("/generate")
async def create_quiz(request: QuizRequest, db: Session = Depends(get_db)):
    """Generate a quiz for a subject using its uploaded PPT content."""
    subject = db.query(Subject).filter(Subject.id == request.subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    files = (
        db.query(UploadedFile)
        .filter(UploadedFile.subject_id == request.subject_id)
        .all()
    )
    if not files:
        raise HTTPException(
            status_code=400,
            detail="No files uploaded for this subject. Upload study materials first.",
        )

    import os
    import requests
    from io import BytesIO
    from services.supabase_service import get_public_url

    all_text_parts: list[str] = []
    for f in files:
        if f.file_type == "ppt" and f.file_name:
            try:
                # Determine source: local disk or downloaded from cloud
                file_source = None
                
                # Try local disk first
                if f.storage_path and os.path.exists(f.storage_path):
                    file_source = f.storage_path
                else:
                    # Cloud fallback for ephemeral disk environments (Render)
                    cloud_url = get_public_url(f"materials/{f.file_name}")
                    if cloud_url:
                        logger.info(f"Downloading {f.file_name} from cloud for analysis...")
                        resp = requests.get(cloud_url)
                        if resp.status_code == 200:
                            file_source = BytesIO(resp.content)
                
                if file_source:
                    parse_result = parse_pptx(file_source)
                    if parse_result.full_text:
                        all_text_parts.append(f"--- {f.original_name} ---\n{parse_result.full_text}")
                else:
                    logger.warning(f"File {f.original_name} could not be located on disk or cloud")
            except Exception as e:
                logger.warning(f"Could not parse {f.original_name}: {e}")

    if not all_text_parts:
        raise HTTPException(
            status_code=400,
            detail="No text content could be extracted from the uploaded files.",
        )

    combined_text = "\n\n".join(all_text_parts)
    questions = generate_quiz(
        content_text=combined_text,
        subject_name=subject.name,
        num_questions=request.num_questions,
    )

    if questions is None:
        raise HTTPException(
            status_code=400,
            detail="Could not generate enough questions from the content.",
        )

    quiz_data_for_mongo = [q if isinstance(q, dict) else q.dict() for q in questions]
    mongo_id = await save_quiz(request.subject_id, quiz_data_for_mongo)

    if mongo_id:
        logger.info(f"Quiz saved to MongoDB: {mongo_id}")
    else:
        logger.warning("Quiz generated but NOT saved to MongoDB.")

    return {"mongo_id": mongo_id, "questions": questions}


@router.get("/subject/{subject_id}")
async def get_quizzes(subject_id: str, db: Session = Depends(get_db)):
    """Fetch all previously generated quizzes for a subject from MongoDB."""
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    quizzes = await get_quizzes_by_subject(subject_id)
    return {"quizzes": quizzes}


@router.post("/result")
async def save_result(payload: QuizResultCreate):
    """Save a completed quiz attempt (score + time) to MongoDB."""
    mongo_id = await save_quiz_result(
        user_id=payload.user_id,
        subject_id=payload.subject_id,
        subject_name=payload.subject_name,
        score=payload.score,
        total_questions=payload.total_questions,
        time_seconds=payload.time_seconds,
    )
    if not mongo_id:
        # Non-fatal: return success even if MongoDB is down
        logger.warning("Could not save quiz result to MongoDB.")
        return {"id": None, "message": "Result not saved (MongoDB unavailable)."}
    return {"id": mongo_id, "message": "Result saved."}


@router.get("/results/{user_id}")
async def get_results(user_id: str):
    """Fetch all quiz result history for a user from MongoDB."""
    results = await get_quiz_results_by_user(user_id)
    return {"results": results}
