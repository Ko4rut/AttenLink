from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.schemas.section_schema import SectionCreate, SectionUpdate, SectionResponse
from app.services.section_service import (
    create_section_service,
    get_all_sections_service,
    get_section_by_id_service,
    update_section_service,
    delete_section_service,
    get_section_by_teacher_id,
    soft_delete_section_service,
)

router = APIRouter(prefix="/sections", tags=["Sections"])


@router.post("", response_model=SectionResponse, status_code=status.HTTP_201_CREATED)
def create_section(
    section: SectionCreate,
    teacher_user_id: UUID,
    db: Session = Depends(get_db)
):
    new_section = create_section_service(
        section=section,
        teacher_user_id=teacher_user_id,
        db=db
    )
    return new_section


@router.get("", response_model=list[SectionResponse], status_code=status.HTTP_200_OK)
def get_all_sections(db: Session = Depends(get_db)):
    sections = get_all_sections_service(db=db)
    return sections



@router.get("/{section_id}", response_model=SectionResponse, status_code=status.HTTP_200_OK)
def get_section_by_id(
    section_id: UUID,
    db: Session = Depends(get_db)
):
    return get_section_by_id_service(section_id=section_id, db=db)

@router.get("/teacher/{teacher_user_id}", response_model=SectionResponse)  # ← Thêm prefix /teacher/
def get_section_by_teacher(teacher_user_id: UUID, db: Session = Depends(get_db)):
    return get_section_by_teacher_id(teacher_user_id=teacher_user_id, db=db)

@router.put("/{section_id}", response_model=SectionResponse, status_code=status.HTTP_200_OK)
def update_section(
    section_id: UUID,
    section_update: SectionUpdate,
    teacher_user_id: UUID,
    db: Session = Depends(get_db)
):
    return update_section_service(
        section_id=section_id,
        section_update=section_update,
        teacher_user_id=teacher_user_id,
        db=db
    )


@router.delete("/{section_id}", response_model=SectionResponse, status_code=status.HTTP_200_OK)
def delete_section(
    section_id: UUID,
    teacher_user_id: UUID,
    db: Session = Depends(get_db)
):
    return delete_section_service(
        section_id=section_id,
        teacher_user_id=teacher_user_id,
        db=db
    )
@router.patch("/{section_id}/delete", response_model=SectionResponse, status_code=status.HTTP_200_OK)
def soft_delete_section(
    section_id: UUID,
    teacher_user_id: UUID,           # Để kiểm tra quyền
    db: Session = Depends(get_db)
):
    return soft_delete_section_service(
        section_id=section_id,
        teacher_user_id=teacher_user_id,
        db=db
    )