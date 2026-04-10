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