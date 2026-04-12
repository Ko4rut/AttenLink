from fastapi import APIRouter

from app.routes.teacher_routes import router as teacher_router
from app.routes.student_routes import router as student_router
from app.routes.section_routes import router as section_router
from app.routes.enrollment_routes import router as enrollment_routes
from app.routes.session_routes import router as session_routes
from app.routes.attendance_routes import router as attendance_routes
from app.routes.enrollment_attendance_routes import (
    me_router,
    enrollment_router,
    attendance_router
) 


api_router = APIRouter()

api_router.include_router(teacher_router)
api_router.include_router(student_router)   
api_router.include_router(section_router)
api_router.include_router(enrollment_routes)
api_router.include_router(session_routes)
api_router.include_router(attendance_routes)
api_router.include_router(me_router)
api_router.include_router(enrollment_router)
api_router.include_router(attendance_router)