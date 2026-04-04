from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user_schema import TeacherCreate
from app.services.teacher_service import create_teacher_service, login_teacher_service

router = APIRouter(prefix="/teachers", tags=["Teachers"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_teacher(teacher: TeacherCreate, db: Session = Depends(get_db)):
    new_teacher = create_teacher_service(teacher, db)
    return {
        "message": "Created teacher successfully",
        "userID": str(new_teacher.userID),
    }

@router.post("/login")
def login_teacher(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    return login_teacher_service(
        username=form_data.username,
        password=form_data.password,
        db=db
    )