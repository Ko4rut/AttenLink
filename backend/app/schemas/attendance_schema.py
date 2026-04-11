from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


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


class StudentInfo(BaseModel):
    userID: UUID
    username: str
    fullName: str
    email: str

    class Config:
        from_attributes = True


class AttendanceRecordDetailResponse(BaseModel):
    AttendanceRecordID: UUID
    studentUserID: UUID
    SessionID: UUID
    CreateAt: datetime
    isDeleted: bool
    student: Optional[StudentInfo] = None

    class Config:
        from_attributes = True


class AttendanceRecordUpdateRequest(BaseModel):
    isDeleted: bool