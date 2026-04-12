from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.section_model import  SectionDB

from app.models.qrcode_model import QRCodeDB

from app.models.enrollment_model import EnrollmentDB

from app.models.session_model import  SessionDB
 
from app.models.attendance_model import  AttendanceRecordDB

from app.services.auditlog_service import create_audit_log_service


# ---------------------------------------------------------------------------
# GET /me/sections  –  list sections the authenticated student is enrolled in
# ---------------------------------------------------------------------------

def get_my_sections_service(student_user_id, db: Session):
    """Return all non-deleted sections where the student has an active enrollment."""
    enrollments = (
        db.query(EnrollmentDB)
        .filter(
            EnrollmentDB.StudentID == student_user_id,
            EnrollmentDB.isDeleted == False,
        )
        .all()
    )

    sections = []
    for enrollment in enrollments:
        section = (
            db.query(SectionDB)
            .filter(
                SectionDB.SectionID == enrollment.SectionID,
                SectionDB.isDeleted == False,
            )
            .first()
        )
        if section:
            sections.append(section)

    return sections


# ---------------------------------------------------------------------------
# POST /enrollments/join  –  student joins a section by code
# ---------------------------------------------------------------------------

def join_section_service(student_user_id, code: str, db: Session):
    """Enroll the authenticated student into the section identified by *code*."""

    # 1. Find the section
    section = (
        db.query(SectionDB)
        .filter(SectionDB.code == code, SectionDB.isDeleted == False)
        .first()
    )
    if not section:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Section not found. Please check the code and try again.",
        )

    # 2. Guard against duplicate enrollment
    existing = (
        db.query(EnrollmentDB)
        .filter(
            EnrollmentDB.StudentID == student_user_id,
            EnrollmentDB.SectionID == section.SectionID,
            EnrollmentDB.isDeleted == False,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You are already enrolled in this section.",
        )

    # 3. Create enrollment
    try:
        with db.begin():
            enrollment = EnrollmentDB(
                StudentID=student_user_id,
                SectionID=section.SectionID,
            )
            db.add(enrollment)
            db.flush()

            create_audit_log_service(
                userID=student_user_id,
                action="JOIN_SECTION",
                db=db,
            )

        db.refresh(enrollment)
        return enrollment, section

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not join section: {str(e)}",
        )


# ---------------------------------------------------------------------------
# POST /attendance/checkin  –  mark attendance after QR scan
# ---------------------------------------------------------------------------

def checkin_attendance_service(student_user_id, qr_token_id, token: str, db: Session):
    """Validate the QR token and record attendance for the authenticated student."""

    now = datetime.now(timezone.utc).replace(tzinfo=None)  # DB stores naive UTC

    # 1. Validate QR token
    qr = (
        db.query(QRCodeDB)
        .filter(
            QRCodeDB.QRTokenID == qr_token_id,
            QRCodeDB.token == token,
            QRCodeDB.isActive == True,
        )
        .first()
    )
    if not qr:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid QR code.",
        )

    if qr.expireAt < now:
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="QR code has expired.",
        )

    # 2. Confirm the student is enrolled in the section that owns this session
    session: SessionDB = (
        db.query(SessionDB)
        .filter(SessionDB.SessionID == qr.SessionID, SessionDB.isDeleted == False)
        .first()
    )
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found.",
        )

    enrolled = (
        db.query(EnrollmentDB)
        .filter(
            EnrollmentDB.StudentID == student_user_id,
            EnrollmentDB.SectionID == session.SectionID,
            EnrollmentDB.isDeleted == False,
        )
        .first()
    )
    if not enrolled:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not enrolled in this section.",
        )

    # 3. Prevent duplicate attendance for the same session
    already_attended = (
        db.query(AttendanceRecordDB)
        .filter(
            AttendanceRecordDB.studentUserID == student_user_id,
            AttendanceRecordDB.SessionID == qr.SessionID,
            AttendanceRecordDB.isDeleted == False,
        )
        .first()
    )
    if already_attended:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Attendance already recorded for this session.",
        )

    # 4. Record attendance
    try:
        with db.begin():
            record = AttendanceRecordDB(
                studentUserID=student_user_id,
                SessionID=qr.SessionID,
            )
            db.add(record)
            db.flush()

            create_audit_log_service(
                userID=student_user_id,
                action="ATTENDANCE_CHECKIN",
                db=db,
            )

        db.refresh(record)
        return record, session

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Check-in failed: {str(e)}",
        )