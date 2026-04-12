from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


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