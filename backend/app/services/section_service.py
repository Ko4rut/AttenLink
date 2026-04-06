from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.models.section_model import SectionDB
from app.schemas.section_schema import SectionCreate, SectionUpdate
from app.services.auditlog_service import create_audit_log_service


def create_section_service(section: SectionCreate, teacher_user_id: UUID, db: Session):
    try:
        with db.begin():
            new_section = SectionDB(
                teacherUserID=teacher_user_id,
                code=section.code,
                name=section.name,
                Discription=section.Discription,
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
            if section_update.Discription is not None:
                section.Discription = section_update.Discription

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