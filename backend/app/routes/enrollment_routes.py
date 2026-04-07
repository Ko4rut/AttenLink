from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_student  # trả về StudentProfileDB
from app.schemas.enrollment_schema import EnrollmentJoinRequest, EnrollmentResponse
from app.services.enrollment_service import join_section

router = APIRouter(prefix="/enrollments", tags=["Enrollments"])


@router.post(
    "/join",
    response_model=EnrollmentResponse,
    status_code=201,
    summary="Join a section by code",
)
def join_section_route(
    payload: EnrollmentJoinRequest,
    db: Session = Depends(get_db),
    current_student=Depends(get_current_student),
):
    """
    Student dùng `code` của section để tham gia.

    - **code**: mã section do giáo viên cung cấp
    """
    return join_section(payload, student_id=current_student.userID, db=db)