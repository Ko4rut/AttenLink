
from fastapi import HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.dependencies.auth import get_current_user
from app.models.student_profile_model import StudentProfileDB
from app.core.database import get_db

def require_teacher(user = Depends(get_current_user)):
    if not user.isTeacher:
        raise HTTPException(403, "Teacher only")
    return user

# ──────────────────────────────────────────────
# Student guard
# ──────────────────────────────────────────────
def get_current_student(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> StudentProfileDB:
    if current_user.isTeacher:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to students only.",
        )
    student = (
        db.query(StudentProfileDB)
        .filter(
            StudentProfileDB.userID == current_user.userID,
            StudentProfileDB.isDeleted == False,
        )
        .first()
    )
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found.",
        )
    return student
