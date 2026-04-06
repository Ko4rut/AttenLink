from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.models.user_model import UserDB
from app.schemas.user_schema import UserCreate
from app.core.security import hash_password


def create_user_service(user: UserCreate,role: str, db: Session):
    try:
        new_user = UserDB(
            username=user.username,
            password=hash_password(user.password),
            email=user.email,
            role=role,
            fullName=user.fullName,
        )

        db.add(new_user)
        db.flush()
        db.refresh(new_user)
        return new_user

    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists"
        )