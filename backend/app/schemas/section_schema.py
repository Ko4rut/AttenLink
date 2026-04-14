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
    description: str | None = None


class SectionResponse(SectionBase):
    SectionID: UUID
    teacherUserID: UUID
    isDeleted: bool
    
    class Config:
        from_attributes = True

class SectionListItem(BaseModel):
    SectionID: UUID
    code: str
    name: str
    enrolled: int
    description: str
    totalSessions: int

class SectionListResponse(BaseModel):
    items: list[SectionListItem]
    page: int
    limit: int
    total: int
    totalPages: int

class StudentSectionItem(BaseModel):
    SectionID: UUID
    code: str
    name: str
    sessionsCount: int


class StudentSectionListResponse(BaseModel):
    message: str
    data: list[StudentSectionItem]