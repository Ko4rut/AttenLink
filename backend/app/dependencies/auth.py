from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_token
from app.models.user_model import UserDB

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = decode_token(token)
        user_id = payload.get("userID")

        if user_id is None:
            raise HTTPException(401, "Invalid token")

        user = db.query(UserDB).filter(UserDB.userID == user_id).first()

        if not user:
            raise HTTPException(401, "User not found")

        return user

    except Exception:
        raise HTTPException(401, "Invalid token")