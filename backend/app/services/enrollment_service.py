from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.enrollment_model import EnrollmentDB
from app.models.section_model import SectionDB
from app.schemas.enrollment_schema import EnrollmentJoinRequest


def join_section(
    payload: EnrollmentJoinRequest,
    student_id: UUID,
    db: Session,
) -> EnrollmentDB:
    # 1. Tìm section theo code (chưa bị xoá)
    section = (
        db.query(SectionDB)
        .filter(SectionDB.code == payload.code, SectionDB.isDeleted == False)
        .first()
    )
    if not section:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Section not found or invalid code.",
        )

    # 2. Kiểm tra đã enroll chưa (unique constraint: SectionID + StudentID)
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
            detail="You have already joined this section.",
        )

    # 3. Tạo enrollment mới
    enrollment = EnrollmentDB(
        StudentID=student_id,
        SectionID=section.SectionID,
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)

    return enrollment