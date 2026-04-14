from math import ceil
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from uuid import UUID

from app.models.section_model import SectionDB
from app.schemas.section_schema import SectionCreate, SectionUpdate
from app.services.auditlog_service import create_audit_log_service
from app.models.enrollment_model import EnrollmentDB
from app.models.session_model import SessionDB
from app.schemas.section_schema import StudentSectionItem

def create_section_service(section: SectionCreate, teacher_user_id: UUID, db: Session):
    try:
        with db.begin():
            existing_section = db.query(SectionDB).filter(
                SectionDB.code == section.code
            ).first()
            if existing_section:
                raise HTTPException(
                    status_code=409,
                    detail="Section code already exists"
                )
            new_section = SectionDB(
                teacherUserID=teacher_user_id,
                code=section.code,
                name=section.name,
                description=section.description
            )
            
            db.add(new_section)
            db.flush()

            create_audit_log_service(
                userID=teacher_user_id,
                action="CREATE_SECTION",
                db=db
            )

        db.refresh(new_section)
        return new_section

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Create section failed: {str(e)}"
        )


def get_all_sections_service(db: Session):
    try:
        return db.query(SectionDB).filter(SectionDB.isDeleted == False).all()

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Get sections failed: {str(e)}"
        )


def get_section_by_id_service(section_id: UUID, db: Session):
    section = db.query(SectionDB).filter(
        SectionDB.SectionID == section_id,
        SectionDB.isDeleted == False
    ).first()

    if not section:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Section not found"
        )

    return section


def get_sections_by_teacher_id(
    teacher_user_id: UUID,
    page: int,
    limit: int,
    db: Session
):
    base_query = db.query(SectionDB).filter(
        SectionDB.teacherUserID == teacher_user_id,
        SectionDB.isDeleted == False
    )

    total = base_query.count()

    if total == 0:
        return {
            "items": [],
            "page": page,
            "limit": limit,
            "total": 0,
            "totalPages": 0
        }

    offset = (page - 1) * limit

    sections = (
        base_query
        .order_by(SectionDB.name.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    items = []

    for section in sections:
        enrolled_count = db.query(func.count(EnrollmentDB.EnrollmentID)).filter(
            EnrollmentDB.SectionID == section.SectionID,
            EnrollmentDB.isDeleted == False
        ).scalar()

        total_sessions = db.query(func.count(SessionDB.SessionID)).filter(
            SessionDB.SectionID == section.SectionID,
            SessionDB.isDeleted == False
        ).scalar()

        items.append({
            "SectionID": section.SectionID,
            "code": section.code,
            "name": section.name,
            "enrolled": enrolled_count or 0,
            "description": section.description,
            "totalSessions": total_sessions or 0
        })

    total_pages = ceil(total / limit)

    return {
        "items": items,
        "page": page,
        "limit": limit,
        "total": total,
        "totalPages": total_pages
    }

def update_section_service(section_id: UUID, section_update: SectionUpdate, teacher_user_id: UUID, db: Session):
    try:
        with db.begin():
            section = db.query(SectionDB).filter(
                SectionDB.SectionID == section_id,
                SectionDB.isDeleted == False
            ).first()

            if not section:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Section not found"
                )

            if section_update.name is not None:
                section.name = section_update.name
            if section_update.description is not None:
                section.description = section_update.description

            db.flush()

            create_audit_log_service(
                userID=teacher_user_id,
                action="UPDATE_SECTION",
                db=db
            )

        db.refresh(section)
        return section

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Update section failed: {str(e)}"
        )


def delete_section_service(section_id: UUID, teacher_user_id: UUID, db: Session):
    try:
        with db.begin():
            section = db.query(SectionDB).filter(
                SectionDB.SectionID == section_id,
                SectionDB.isDeleted == False
            ).first()

            if not section:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Section not found"
                )

            section.isDeleted = True
            db.flush()

            create_audit_log_service(
                userID=teacher_user_id,
                action="DELETE_SECTION",
                db=db
            )

        db.refresh(section)
        return section

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Delete section failed: {str(e)}"
        )
    
def soft_delete_section_service(
    section_id: UUID, 
    teacher_user_id: UUID, 
    db: Session
):
    try:
        with db.begin():
            section = db.query(SectionDB).filter(
                SectionDB.SectionID == section_id,
                SectionDB.isDeleted == False
            ).first()

            if not section:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Section not found or already deleted"
                )

            # Kiểm tra quyền (chỉ teacher sở hữu mới được xóa)
            if section.teacherUserID != teacher_user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You don't have permission to delete this section"
                )

            section.isDeleted = True
            db.flush()

            # Ghi audit log
            create_audit_log_service(
                userID=teacher_user_id,
                action="SOFT_DELETE_SECTION",
                db=db
            )

        db.refresh(section)
        return section

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Soft delete section failed: {str(e)}"
        )    
    

def get_sections_by_student_id_service(
    student_user_id: UUID,
    db: Session
) -> list[StudentSectionItem]:
    try:
        results = (
            db.query(
                SectionDB.SectionID.label("SectionID"),
                SectionDB.code.label("code"),
                SectionDB.name.label("name"),
                func.count(SessionDB.SessionID).label("sessionsCount")
            )
            .join(
                EnrollmentDB,
                EnrollmentDB.SectionID == SectionDB.SectionID
            )
            .outerjoin(
                SessionDB,
                (SessionDB.SectionID == SectionDB.SectionID) &
                (SessionDB.isDeleted == False)
            )
            .filter(
                EnrollmentDB.StudentID == student_user_id,
                EnrollmentDB.isDeleted == False,
                SectionDB.isDeleted == False
            )
            .group_by(
                SectionDB.SectionID,
                SectionDB.code,
                SectionDB.name
            )
            .all()
        )

        return [
            StudentSectionItem(
                SectionID=row.SectionID,
                code=row.code,
                name=row.name,
                sessionsCount=row.sessionsCount
            )
            for row in results
        ]

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Get sections by student failed: {str(e)}"
        )