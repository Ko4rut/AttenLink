from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.attendance_model import AttendanceRecordDB
from app.models.enrollment_model import EnrollmentDB
from app.models.qrcode_model import QRCodeDB
from app.models.session_model import SessionDB
from app.schemas.attendance_schema import AttendanceRecordCheckInRequest


def check_in(
    payload: AttendanceRecordCheckInRequest,
    student_id: UUID,
    db: Session,
) -> AttendanceRecordDB:
    # 1. Tìm QR token hợp lệ (còn active, chưa hết hạn)
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    qr = (
        db.query(QRCodeDB)
        .filter(
            QRCodeDB.token == payload.token,
            QRCodeDB.isActive == True,
            QRCodeDB.expireAt > now,
        )
        .first()
    )
    if not qr:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired QR code.",
        )

    # 2. Kiểm tra session tồn tại và chưa bị xoá
    session = (
        db.query(SessionDB)
        .filter(SessionDB.SessionID == qr.SessionID, SessionDB.isDeleted == False)
        .first()
    )
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found.",
        )

    # 3. Kiểm tra student đã enrolled vào section của session này chưa
    enrolled = (
        db.query(EnrollmentDB)
        .filter(
            EnrollmentDB.SectionID == session.SectionID,
            EnrollmentDB.StudentID == student_id,
            EnrollmentDB.isDeleted == False,
        )
        .first()
    )
    if not enrolled:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not enrolled in this section.",
        )

    # 4. Kiểm tra đã điểm danh cho session này chưa
    existing = (
        db.query(AttendanceRecordDB)
        .filter(
            AttendanceRecordDB.SessionID == session.SessionID,
            AttendanceRecordDB.studentUserID == student_id,
            AttendanceRecordDB.isDeleted == False,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already checked in for this session.",
        )

    # 5. Tạo attendance record
    record = AttendanceRecordDB(
        studentUserID=student_id,
        SessionID=session.SessionID,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return record