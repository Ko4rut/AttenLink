from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_student
from app.schemas.attendance_schema import AttendanceRecordCheckInRequest, AttendanceRecordResponse
from app.services.attendance_service import check_in

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post(
    "/check-in",
    response_model=AttendanceRecordResponse,
    status_code=201,
    summary="Check in by scanning QR code",
)
def check_in_route(
    payload: AttendanceRecordCheckInRequest,
    db: Session = Depends(get_db),
    current_student=Depends(get_current_student),
):
    """
    Student điểm danh bằng cách quét mã QR của session.

    - **token**: chuỗi token lấy từ QR code
    """
    return check_in(payload, student_id=current_student.userID, db=db)