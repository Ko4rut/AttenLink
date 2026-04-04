from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user_schema import StudentCreate
from app.services.student_service import create_student_service

router = APIRouter(prefix="/students", tags=["Students"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    new_student = create_student_service(student, db)
    return {
        "message": "Created student successfully",
        "userID": str(new_student.userID),
    }