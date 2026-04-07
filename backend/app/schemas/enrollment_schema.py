from pydantic import BaseModel
from uuid import UUID


class EnrollmentJoinRequest(BaseModel):
    code: str


class EnrollmentResponse(BaseModel):
    EnrollmentID: UUID
    StudentID: UUID
    SectionID: UUID
    isDeleted: bool

    class Config:
        from_attributes = True