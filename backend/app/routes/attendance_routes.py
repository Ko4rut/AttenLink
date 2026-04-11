from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_student, get_current_teacher
from app.schemas.attendance_schema import (
    AttendanceRecordCheckInRequest,
    AttendanceRecordDetailResponse,
    AttendanceRecordResponse,
    AttendanceRecordUpdateRequest,
)
from app.services.attendance_service import (
    check_in,
    export_session_attendance,
    list_session_attendance,
    update_attendance_record,
)

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
    response_model=list[AttendanceRecordDetailResponse],
    status_code=200,
    summary="List all check-ins for a session",
)
def list_session_attendance_route(
    session_id: UUID,
    db: Session = Depends(get_db),
    _=Depends(get_current_teacher),
):
    """
    Lấy danh sách toàn bộ bản ghi điểm danh của một session.

    - Chỉ teacher mới được phép truy cập.
    - Trả về thông tin student kèm theo từng bản ghi.
    """
    return list_session_attendance(session_id=session_id, db=db)


@router.get(
    "/sessions/{session_id}/attendance/export",
    response_class=StreamingResponse,
    status_code=200,
    summary="Export attendance list of a session as Excel",
)
def export_session_attendance_route(
    session_id: UUID,
    db: Session = Depends(get_db),
    _=Depends(get_current_teacher),
):
    """
    Xuất danh sách điểm danh của session ra file Excel (.xlsx).

    - Chỉ teacher mới được phép truy cập.
    - File trả về gồm các cột: STT, Student ID, Full Name, Username, Email, Check-in Time.
    """
    return export_session_attendance(session_id=session_id, db=db)


@router.patch(
    "/attendance/{attendance_record_id}",
    response_model=AttendanceRecordResponse,
    status_code=200,
    summary="Update (soft-delete or restore) an attendance record",
)
def update_attendance_record_route(
    attendance_record_id: UUID,
    payload: AttendanceRecordUpdateRequest,
    db: Session = Depends(get_db),
    _=Depends(get_current_teacher),
):
    """
    Cập nhật trạng thái `isDeleted` của một bản ghi điểm danh.

    - Chỉ teacher mới được phép truy cập.
    - Dùng để soft-delete (`isDeleted: true`) hoặc khôi phục (`isDeleted: false`) bản ghi.
    """
    return update_attendance_record(
        attendance_record_id=attendance_record_id,
        payload=payload,
        db=db,
    )