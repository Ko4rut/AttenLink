import io
from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session, joinedload

from app.models.section_model import SectionDB
from app.models.attendance_model import AttendanceRecordDB
from app.models.enrollment_model import EnrollmentDB
from app.models.qrcode_model import QRCodeDB
from app.models.session_model import SessionDB
from app.models.student_profile_model import StudentProfileDB
from app.schemas.attendance_schema import (
    AttendanceRecordCheckInRequest,
    AttendanceRecordUpdateRequest,
    AttendanceManualUpdateRequest
)


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



from app.schemas.attendance_schema import (
    SessionAttendanceResponse,
    AttendanceSessionInfo,
    AttendanceSummary,
    AttendanceListItem,
    AttendanceStudentInfo,
)

def list_session_attendance(
    session_id: UUID,
    db: Session,
) -> SessionAttendanceResponse:
    session_obj = (
        db.query(SessionDB)
        .filter(
            SessionDB.SessionID == session_id,
            SessionDB.isDeleted == False,
        )
        .first()
    )

    if not session_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found.",
        )

    section_obj = (
        db.query(SectionDB)
        .filter(
            SectionDB.SectionID == session_obj.SectionID,
            SectionDB.isDeleted == False,
        )
        .first()
    )

    if not section_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Section not found.",
        )

    enrollments = (
        db.query(EnrollmentDB)
        .filter(
            EnrollmentDB.SectionID == section_obj.SectionID,
            EnrollmentDB.isDeleted == False,
        )
        .all()
    )

    student_user_ids = [enrollment.StudentID for enrollment in enrollments]

    if not student_user_ids:
        student_profiles = []
    else:
        student_profiles = (
            db.query(StudentProfileDB)
            .options(joinedload(StudentProfileDB.user))
            .filter(
                StudentProfileDB.userID.in_(student_user_ids),
                StudentProfileDB.isDeleted == False,
            )
            .all()
        )

    student_map: dict[UUID, StudentProfileDB] = {
        student.userID: student for student in student_profiles if student.user
    }

    attendance_records = (
        db.query(AttendanceRecordDB)
        .options(
            joinedload(AttendanceRecordDB.student).joinedload(StudentProfileDB.user)
        )
        .filter(
            AttendanceRecordDB.SessionID == session_id,
            AttendanceRecordDB.isDeleted == False,
        )
        .order_by(AttendanceRecordDB.CreateAt.asc())
        .all()
    )

    record_map: dict[UUID, AttendanceRecordDB] = {
        record.studentUserID: record for record in attendance_records
    }

    response_records: list[AttendanceListItem] = []

    for enrollment in enrollments:
        student_user_id = enrollment.StudentID
        student_profile = student_map.get(student_user_id)

        if not student_profile or not student_profile.user:
            continue

        user = student_profile.user
        attendance_record = record_map.get(student_user_id)

        if attendance_record:
            item_status = attendance_record.status

            response_records.append(
                AttendanceListItem(
                    AttendanceRecordID=attendance_record.AttendanceRecordID,
                    studentUserID=student_user_id,
                    SessionID=session_id,
                    status=item_status,
                    checkInTime=attendance_record.CreateAt,
                    createdAt=attendance_record.CreateAt,
                    isDeleted=attendance_record.isDeleted,
                    student=AttendanceStudentInfo(
                        userID=user.userID,
                        studentCode=user.username,
                        fullName=user.fullName,
                        email=user.email,
                        username=user.username,
                    ),
                )
            )
        else:
            response_records.append(
                AttendanceListItem(
                    AttendanceRecordID=None,
                    studentUserID=student_user_id,
                    SessionID=session_id,
                    status="Absent",
                    checkInTime=None,
                    createdAt=None,
                    isDeleted=False,
                    student=AttendanceStudentInfo(
                        userID=user.userID,
                        studentCode=user.username,
                        fullName=user.fullName,
                        email=user.email,
                        username=user.username,
                    ),
                )
            )

    present_count = sum(1 for item in response_records if item.status == "Present")
    late_count = sum(1 for item in response_records if item.status == "Late")
    absent_count = sum(1 for item in response_records if item.status == "Absent")

    return SessionAttendanceResponse(
        session=AttendanceSessionInfo(
            SessionID=session_obj.SessionID,
            SectionID=session_obj.SectionID,
            Name=session_obj.Name,
            Time=session_obj.Time,
        ),
        summary=AttendanceSummary(
            present=present_count,
            absent=absent_count,
            late=late_count,
            total=len(response_records),
        ),
        records=response_records,
    )
def update_attendance_manual(
    payload: AttendanceManualUpdateRequest,
    db: Session,
):
    record = None

    if payload.AttendanceRecordID:
        record = (
            db.query(AttendanceRecordDB)
            .filter(
                AttendanceRecordDB.AttendanceRecordID == payload.AttendanceRecordID,
                AttendanceRecordDB.isDeleted == False,
            )
            .first()
        )

    if not record:
        record = (
            db.query(AttendanceRecordDB)
            .filter(
                AttendanceRecordDB.studentUserID == payload.studentUserID,
                AttendanceRecordDB.SessionID == payload.SessionID,
                AttendanceRecordDB.isDeleted == False,
            )
            .first()
        )

    if record:
        record.status = payload.status
        record.isDeleted = False
        db.commit()
        db.refresh(record)
        return {"message": "Attendance updated successfully", "data": record}

    new_record = AttendanceRecordDB(
        studentUserID=payload.studentUserID,
        SessionID=payload.SessionID,
        status=payload.status,
        isDeleted=False,
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    return {"message": "Attendance created successfully", "data": new_record}