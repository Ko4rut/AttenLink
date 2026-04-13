from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional
from typing import List, Optional, Literal

class SessionBase(BaseModel):
    Name: str
    Time: datetime


class SessionCreate(SessionBase):
    pass


class SessionUpdate(BaseModel):
    Name: str
    Time: datetime
    isDeleted: bool


class SessionResponse(SessionBase):
    SessionID: UUID
    SectionID: UUID
    isDeleted: bool

    class Config:
        from_attributes = True

class QRCodeInfoResponse(BaseModel):
    QRTokenID: UUID
    token: str
    expireAt: datetime

    class Config:
        from_attributes = True


class SessionBriefResponse(BaseModel):
    SessionID: UUID
    SectionID: UUID
    Name: str
    Time: datetime
    isDeleted: bool

    class Config:
        from_attributes = True


class GenerateQRCodeResponse(BaseModel):
    session: SessionBriefResponse
    qrcode: QRCodeInfoResponse


class SessionBySectionItem(BaseModel):
    SessionID: UUID
    SectionID: UUID
    Name: str
    Time: datetime
    isDeleted: bool
    attendanceCount: int = 0
    totalStudents: int = 0
    status: str = "Closed"

    class Config:
        from_attributes = True


class SessionBySectionResponse(BaseModel):
    message: str
    data: list[SessionBySectionItem]


class QRCodeResponse(BaseModel):
    QRTokenID: UUID
    token: str
    expireAt: datetime
    isActive: bool
    createAt: datetime

    class Config:
        from_attributes = True


class QRCodeRevokeResponse(BaseModel):
    QRTokenID: UUID
    isActive: bool
    message: str

class SectionDeleteResponse(BaseModel):
    SectionID: UUID
    isDeleted: bool
    message: str

class StudentSessionItem(BaseModel):
    SessionID: UUID
    name: str
    time: datetime
    attendanceRecordID: Optional[UUID] = None
    checkInTime: Optional[datetime] = None
    status: Literal["Attended", "Absent"]


class StudentSectionDetailResponse(BaseModel):
    SectionID: UUID
    code: str
    name: str
    description: Optional[str] = None
    attendedCount: int
    totalSessions: int
    sessions: List[StudentSessionItem]


class StudentSectionDetailApiResponse(BaseModel):
    message: str
    data: StudentSectionDetailResponse