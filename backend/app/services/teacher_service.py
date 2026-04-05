from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.teacher_profile_model import TeacherProfileDB
from app.schemas.user_schema import TeacherCreate
from app.services.user_service import create_user_service
from app.services.auditlog_service import create_audit_log_service

from app.models.user_model import UserDB
from app.core.security import verify_password, create_access_token

def create_teacher_service(teacher: TeacherCreate, db: Session):
    try:
        with db.begin():
            new_user = create_user_service(teacher, db)

            new_teacher = TeacherProfileDB(
                userID=new_user.userID
            )
            db.add(new_teacher)
            db.flush()

            create_audit_log_service(
                userID=new_user.userID,
                action="CREATE_TEACHER",
                db=db
            )

        db.refresh(new_teacher)
        return new_teacher

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Create teacher failed: {str(e)}"
        )
    


def login_teacher_service(username: str, password: str, db: Session):
    user = db.query(UserDB).filter(UserDB.username == username).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    if user.role != "teacher":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is not a teacher account"
        )

    if not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    access_token = create_access_token(
        data={
            "sub": user.username,
            "userID": str(user.userID),
            "role": user.role
        }
    )
    
    create_audit_log_service(
        userID=username,
        action="login",
        db=db
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "userID": str(user.userID),
        "username": user.username,
        "role": user.role
    }