from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user          # your existing JWT dependency
from app.schemas.enrollment_schema import EnrollmentJoin, AttendanceCheckIn, SectionOut
from app.services.enrollment_attendance_service import (
    get_my_sections_service,
    join_section_service,
    checkin_attendance_service,
)

# ── Routers ────────────────────────────────────────────────────────────────

me_router = APIRouter(prefix="/me", tags=["Me"])
enrollment_router = APIRouter(prefix="/enrollments", tags=["Enrollments"])
attendance_router = APIRouter(prefix="/attendance", tags=["Attendance"])


# ── GET /me/sections ────────────────────────────────────────────────────────

@me_router.get(
    "/sections",
    response_model=list[SectionOut],
    summary="List sections the authenticated student is enrolled in",
)
def get_my_sections(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns every active Section the authenticated student has joined.
    Requires a valid Bearer token with role **student**.
    """
    if current_user.role != "student":
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Only students can access this endpoint.")

    sections = get_my_sections_service(current_user.userID, db)
    return sections


# ── POST /enrollments/join ──────────────────────────────────────────────────

@enrollment_router.post(
    "/join",
    status_code=status.HTTP_201_CREATED,
    summary="Join a section using its invite code",
)
def join_section(
    body: EnrollmentJoin,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Enrolls the authenticated student into the Section identified by `code`.

    - **404** if the code doesn't match any active section.
    - **409** if the student is already enrolled.
    """
    if current_user.role != "student":
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Only students can join sections.")

    enrollment, section = join_section_service(current_user.userID, body.code, db)
    return {
        "message": "Successfully joined section.",
        "enrollmentID": str(enrollment.EnrollmentID),
        "section": {
            "SectionID": str(section.SectionID),
            "name": section.name,
            "code": section.code,
        },
    }


# ── POST /attendance/checkin ────────────────────────────────────────────────

@attendance_router.post(
    "/checkin",
    status_code=status.HTTP_201_CREATED,
    summary="Record attendance after a successful QR scan",
)
def attendance_checkin(
    body: AttendanceCheckIn,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Called by the client **after** the QR code has been verified on-device.
    Validates the token server-side, then writes an `AttendanceRecord`.

    Body:
    - **id**: `QRTokenID` (UUID) extracted from the scanned QR code.
    - **token**: The raw token string from the QR code.

    Possible error responses:
    - **404** – QR code not found or session not found.
    - **403** – Student not enrolled in this section.
    - **409** – Attendance already recorded for this session.
    - **410** – QR code has expired.
    """
    if current_user.role != "student":
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Only students can check in.")

    record, session = checkin_attendance_service(
        student_user_id=current_user.userID,
        qr_token_id=body.id,
        token=body.token,
        db=db,
    )
    return {
        "message": "Attendance recorded successfully.",
        "attendanceRecordID": str(record.AttendanceRecordID),
        "session": {
            "SessionID": str(session.SessionID),
            "name": session.Name,
            "time": session.Time.isoformat(),
        },
    }