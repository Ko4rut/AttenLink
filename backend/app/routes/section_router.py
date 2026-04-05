from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.section import SectionCreate, SectionResponse
from app.services.section_service import SectionService

router = APIRouter(prefix="/sections", tags=["Sections"])

@router.post("/", response_model=SectionResponse, status_code=status.HTTP_201_CREATED)
def create_section(section_in: SectionCreate, db: Session = Depends(get_db)):
    # Gọi service để xử lý logic
    try:
        return SectionService.create_section(db, section_in)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Could not create section: {str(e)}")