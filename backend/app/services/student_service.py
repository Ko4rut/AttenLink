from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.student_profile_model import StudentProfileDB
from app.schemas.user_schema import StudentCreate
from app.services.user_service import create_user_service
from app.services.auditlog_service import create_audit_log_service


def create_student_service(student: StudentCreate, db: Session):
    try:
        with db.begin():
            new_user = create_user_service(student, db)

            new_student = StudentProfileDB(
                userID=new_user.userID
            )
            db.add(new_student)
            db.flush()

            create_audit_log_service(
                userID=new_user.userID,
                action="CREATE_STUDENT",
                db=db
            )

        db.refresh(new_student)
        return new_student

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Create student failed: {str(e)}"
        )