from pydantic import BaseModel
from uuid import UUID


class SectionBase(BaseModel):
    code: str
    name: str
    description: str | None = None


class SectionCreate(SectionBase):
    pass


class SectionUpdate(BaseModel):
    name: str | None = None
    Discription: str | None = None


class SectionResponse(SectionBase):
    SectionID: UUID
    teacherUserID: UUID
    isDeleted: bool
    
    class Config:
        from_attributes = True