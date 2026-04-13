from sqlalchemy import Column, Boolean, ForeignKey, DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.core.database import Base


class AttendanceRecordDB(Base):
    __tablename__ = "AttendanceRecord"

    AttendanceRecordID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    studentUserID = Column(UUID(as_uuid=True), ForeignKey("StudentProfile.userID", ondelete="CASCADE"), nullable=False)
    SessionID = Column(UUID(as_uuid=True), ForeignKey("Session.SessionID", ondelete="CASCADE"), nullable=False)
    CreateAt = Column(DateTime, server_default=func.now(), nullable=False)
    status = Column(String, nullable=False, default="Present")
    isDeleted = Column(Boolean, default=False)

    student = relationship("StudentProfileDB", back_populates="attendance_records")
    session = relationship("SessionDB", back_populates="attendance_records")
    