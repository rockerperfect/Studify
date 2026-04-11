"""
Timetable generation endpoint.
"""

import logging
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from database import get_db
from models.db_models import Subject, UploadedFile, FileAnalysis
from models.schemas import TimetableRequest
from services.scheduler import generate_timetable
from services.mongo_service import save_study_plan, get_study_plans_by_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/timetable", tags=["timetable"])


@router.post("/generate")
async def create_timetable(request: TimetableRequest, db: Session = Depends(get_db)):
    """
    Generate a study timetable based on uploaded materials.
    Looks up total study time per subject from file analyses.
    """
    try:
        subjects_data = []

        for subject_id in request.subject_ids:
            subject = db.query(Subject).filter(Subject.id == subject_id).first()
            if not subject:
                raise HTTPException(status_code=404, detail=f"Subject '{subject_id}' not found")

            # Sum up study time from all analyzed files for this subject
            total_study_minutes = 0.0
            analyses = (
                db.query(FileAnalysis)
                .join(UploadedFile)
                .filter(UploadedFile.subject_id == subject_id)
                .all()
            )
            for a in analyses:
                total_study_minutes += float(a.estimated_study_time or 0)

            # Default to 60 minutes if no files analyzed yet
            if total_study_minutes == 0:
                total_study_minutes = 60.0

            subjects_data.append({
                "id": str(subject.id),
                "name": str(subject.name),
                "color": str(subject.color),
                "total_study_minutes": float(total_study_minutes),
            })

        # Generate the timetable (returns a plain Python dict)
        result = generate_timetable(
            subjects=subjects_data,
            hours_per_day=float(request.hours_per_day),
            preferred_blocks=list(request.preferred_blocks),
            exam_date=request.exam_date,
            days_count=int(request.days_count),
            learner_speed=request.learner_speed,
            will_take_notes=bool(request.will_take_notes),
        )

        # Ensure all values are JSON-serializable native Python types
        result["total_hours"] = float(result.get("total_hours", 0))
        result["days"] = int(result.get("days", 0))
        result["subjects_covered"] = int(result.get("subjects_covered", 0))
        result["mongo_id"] = None

        # Coerce all session fields to native Python types
        clean_sessions = []
        for s in result.get("sessions", []):
            clean_sessions.append({
                "id": str(s.get("id", "")),
                "subject": str(s.get("subject", "")),
                "subject_color": str(s.get("subject_color", "#8B5CF6")),
                "title": str(s.get("title", "")),
                "duration": int(s.get("duration", 0)),
                "start_time": str(s.get("start_time", "09:00")),
                "day": str(s.get("day", "")),
                "date": str(s.get("date", "")),
                "session_type": str(s.get("session_type", "Review")),
            })
        result["sessions"] = clean_sessions

        # Save to MongoDB if user_id is provided
        if request.user_id:
            try:
                mongo_id = await save_study_plan(request.user_id, result)
                if mongo_id:
                    result["mongo_id"] = str(mongo_id)
            except Exception as mongo_err:
                logger.warning(f"Failed to save timetable to MongoDB (non-fatal): {mongo_err}")

        return JSONResponse(content=jsonable_encoder(result))

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Timetable generation failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Timetable generation failed: {str(e)}")


@router.get("/user/{user_id}")
async def get_saved_plans(user_id: str):
    """
    Fetch all previously saved study plans for a specific user from MongoDB.
    """
    try:
        plans = await get_study_plans_by_user(user_id)
        return {"plans": jsonable_encoder(plans)}
    except Exception as e:
        logger.error(f"Failed to fetch study plans: {e}")
        return {"plans": []}
