from fastapi import HTTPException,Depends
from app.dependencies.auth import get_current_user

def require_teacher(user = Depends(get_current_user)):
    if not user.isTeacher:
        raise HTTPException(403, "Teacher only")
    return user