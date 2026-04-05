from sqlalchemy.orm import Session
from app.models.section import SectionDB
from app.schemas.section import SectionCreate

class SectionService:
    @staticmethod
    def create_section(db: Session, section_data: SectionCreate):
        # Khởi tạo object model từ schema
        new_section = SectionDB(
            teacherUserID=section_data.teacherUserID,
            code=section_data.code,
            name=section_data.name,
            description=section_data.description
        )
        
        db.add(new_section)
        db.commit()
        db.refresh(new_section)
        return new_section