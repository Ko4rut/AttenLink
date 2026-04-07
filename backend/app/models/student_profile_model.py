from sqlalchemy import Column, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class StudentProfileDB(Base):
    __tablename__ = "StudentProfile"

    userID = Column(UUID(as_uuid=True), ForeignKey("User.userID"), primary_key=True)
    isDeleted = Column(Boolean, default=False)

    user = relationship(
        "UserDB",
        back_populates="student_profile"
    )

    enrollments = relationship(
        "EnrollmentDB",
        back_populates="student"
    )