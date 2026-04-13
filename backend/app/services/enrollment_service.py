from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.enrollment_model import EnrollmentDB
from app.models.section_model import SectionDB
from app.schemas.enrollment_schema import EnrollmentJoinRequest
from app.services.auditlog_service import create_audit_log_service

def join_section(
    payload: EnrollmentJoinRequest,
    student_id: UUID,
    db: Session,
) -> EnrollmentDB:
    try:
        section = (
            db.query(SectionDB)
            .filter(
                SectionDB.code == payload.code,
                SectionDB.isDeleted == False
            )
            .first()
        )
        if not section:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Section not found or invalid code."
            )

        existing = (
            db.query(EnrollmentDB)
            .filter(
                EnrollmentDB.SectionID == section.SectionID,
                EnrollmentDB.StudentID == student_id,
                EnrollmentDB.isDeleted == False,
            )
            .first()
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="You have already joined this section."
            )

        enrollment = EnrollmentDB(
            StudentID=student_id,
            SectionID=section.SectionID,
        )
        db.add(enrollment)
        db.flush()

        create_audit_log_service(
            userID=student_id,
            action="JOIN_SECTION",
            db=db
        )

        db.commit()
        db.refresh(enrollment)

        return enrollment

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Join section failed: {str(e)}"
        )   