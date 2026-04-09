from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

from app.core.database import Base


class SessionDB(Base):
    __tablename__ = "Session"

    SessionID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    SectionID = Column(UUID(as_uuid=True), ForeignKey("Section.SectionID"), nullable=False)
    
    Name = Column(String, nullable=True)
    Time  = Column(DateTime, nullable=False)
    isDeleted = Column(Boolean, default=False)

    # Relationship
    section = relationship("SectionDB", back_populates="sessions")
    # attendances = relationship("AttendanceDB", back_populates="session")  # sau này 
