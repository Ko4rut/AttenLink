from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class AttendanceRecordCheckInRequest(BaseModel):
    token: str  # QR token do student quét


class AttendanceRecordResponse(BaseModel):
    AttendanceRecordID: UUID
    studentUserID: UUID
    SessionID: UUID
    CreateAt: datetime
    isDeleted: bool

    class Config:
        from_attributes = True