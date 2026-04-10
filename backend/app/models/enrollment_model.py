from sqlalchemy import Column, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.core.database import Base


class EnrollmentDB(Base):
    __tablename__ = "Enrollment"

    EnrollmentID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    StudentID = Column(UUID(as_uuid=True), ForeignKey("StudentProfile.userID", ondelete="CASCADE"), nullable=False)
    SectionID = Column(UUID(as_uuid=True), ForeignKey("Section.SectionID", ondelete="CASCADE"), nullable=False)
    isDeleted = Column(Boolean, default=False)

    student = relationship("StudentProfileDB", back_populates="enrollments")
    section = relationship("SectionDB", back_populates="enrollments")
    