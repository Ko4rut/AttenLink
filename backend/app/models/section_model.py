from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.core.database import Base


class SectionDB(Base):
    __tablename__ = "Section"

    SectionID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    teacherUserID = Column(UUID(as_uuid=True), ForeignKey("TeacherProfile.userID"), nullable=False)
    code = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    isDeleted = Column(Boolean, default=False)

    teacher = relationship(
        "TeacherProfileDB",
        back_populates="sections"
    )