from fastapi import APIRouter

from app.routes.teacher_routes import router as teacher_router
from app.routes.student_routes import router as student_router

api_router = APIRouter()

api_router.include_router(teacher_router)
api_router.include_router(student_router)   