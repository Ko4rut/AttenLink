from sqlalchemy import Column, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base

class TeacherProfileDB(Base):
    __tablename__ = "TeacherProfile"

    userID = Column(UUID(as_uuid=True),  ForeignKey("User.userID"), primary_key=True)
    isDeleted = Column(Boolean, default=False)

    sections = relationship("SectionDB", back_populates="teacher_profile")
    user = relationship("UserDB", back_populates="teacher_profile")