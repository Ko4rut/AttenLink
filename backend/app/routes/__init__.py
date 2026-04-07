from fastapi import APIRouter

from app.routes.teacher_routes import router as teacher_router
from app.routes.student_routes import router as student_router
from app.routes.section_routes import router as section_router
from app.routes.enrollment_routes import router as enrollment_routes

api_router = APIRouter()

api_router.include_router(teacher_router)
api_router.include_router(student_router)   
api_router.include_router(section_router)
api_router.include_router(enrollment_routes)