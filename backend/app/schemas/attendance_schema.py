from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional,  Literal, List


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


AttendanceStatus = Literal["Present", "Late", "Absent"]


class AttendanceCheckInRequest(BaseModel):
    token: str


class AttendanceStudentInfo(BaseModel):
    userID: UUID
    studentCode: str
    fullName: str
    email: str
    username: str

    class Config:
        from_attributes = True


class AttendanceSessionInfo(BaseModel):
    SessionID: UUID
    SectionID: UUID
    Name: str
    Time: datetime

    class Config:
        from_attributes = True


class AttendanceSummary(BaseModel):
    present: int = 0
    absent: int = 0
    late: int = 0
    total: int = 0


class AttendanceListItem(BaseModel):
    AttendanceRecordID: UUID | None = None
    studentUserID: UUID
    SessionID: UUID
    status: AttendanceStatus
    checkInTime: datetime | None = None
    createdAt: datetime | None = None
    isDeleted: bool = False
    student: AttendanceStudentInfo

    class Config:
        from_attributes = True


class SessionAttendanceResponse(BaseModel):
    session: AttendanceSessionInfo
    summary: AttendanceSummary
    records: list[AttendanceListItem]

    class Config:
        from_attributes = True


class AttendanceUpdateRequest(BaseModel):
    status: AttendanceStatus

class AttendanceManualUpdateRequest(BaseModel):
    AttendanceRecordID: Optional[UUID] = None
    studentUserID: UUID
    SessionID: UUID
    status: AttendanceStatus

class AttendanceExportRow(BaseModel):
    student_user_id: UUID
    student_code: Optional[str] = None
    student_name: str
    student_email: Optional[str] = None
    check_in_time: Optional[datetime] = None
    status: str


class AttendanceExportData(BaseModel):
    section_code: str
    section_name: str
    session_name: str
    session_time: Optional[datetime] = None
    total_students: int
    attendance_count: int
    rows: List[AttendanceExportRow]