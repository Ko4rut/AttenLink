from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_student, get_current_teacher
from app.schemas.attendance_schema import (
    AttendanceRecordCheckInRequest,
    SessionAttendanceResponse,
    AttendanceRecordResponse,
    AttendanceManualUpdateRequest
)
from app.services.attendance_service import (
    check_in,
    list_session_attendance,
    update_attendance_manual
)
from app.services.attendance_export_service import export_attendance_service

router = APIRouter(tags=["Attendance"])


@router.post(
    "/attendance/check-in",
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


@router.get(
    "/sessions/{session_id}/attendance",
    response_model=SessionAttendanceResponse,
)
def list_session_attendance_route(session_id: UUID, db: Session = Depends(get_db)):
    return list_session_attendance(session_id=session_id, db=db)


@router.patch("/attendance/manual")
def update_attendance_manual_route(
    payload: AttendanceManualUpdateRequest,
    db: Session = Depends(get_db),
    _=Depends(get_current_teacher),
):
    return update_attendance_manual(payload=payload, db=db)

@router.get("/sessions/{session_id}/attendance/export")
def export_attendance(
    session_id: UUID,
    db: Session = Depends(get_db),
):
    excel_file, filename = export_attendance_service(
        session_id=session_id,
        db=db,
    )

    return StreamingResponse(
        excel_file,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        },
    )