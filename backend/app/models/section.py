from sqlalchemy import Column, String, Boolean, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base

class SectionDB(Base):
    __tablename__ = "Section"
    sectionID = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    teacherUserID = Column(
        UUID(as_uuid=True), 
        ForeignKey("TeacherProfile.userID"), 
        nullable=False
    )
    code = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True) # Sửa lỗi chính tả 'Discription' từ diagram
    isDeleted = Column(Boolean, default=False)

    # Relationships
    teacher = relationship("TeacherProfileDB", back_populates="sections")
    sessions = relationship("SessionDB", back_populates="section")
    enrollments = relationship("EnrollmentDB", back_populates="section")