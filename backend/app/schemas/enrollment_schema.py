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

class EnrollmentJoin(BaseModel):
    code: str
 
 
class SectionOut(BaseModel):
    SectionID: UUID
    name: str
    description: str | None = None
    code: str
 
    class Config:
        from_attributes = True
 
 
class AttendanceCheckIn(BaseModel):
    id: UUID    # QRTokenID
    token: str