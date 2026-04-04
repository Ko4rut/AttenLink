from sqlalchemy import Column, String, Boolean, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserDB(Base):
    __tablename__ = "User"
    userID = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    role = Column(String, nullable=False)
    fullName = Column(String, nullable=False)
    status = Column(String)
    isDeleted = Column(Boolean, default=False)

    teacher_profile = relationship(
        "TeacherProfileDB",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )
    
    student_profile = relationship(
    "StudentProfileDB",
    back_populates="user",
    uselist=False
    )

    audit_logs = relationship(
        "AuditLogDB",
        back_populates="user"
    )