from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class AuditLogDB(Base):
    __tablename__ = "AuditLog"

    AuditLogID = Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()")
    )
    userID = Column(
        UUID(as_uuid=True),
        ForeignKey("User.userID"),
        nullable=False
    )
    action = Column(String, nullable=False)
    createdAt = Column(DateTime(timezone=False), server_default=func.now())
    isDeleted = Column(Boolean, default=False)

    user = relationship("UserDB", back_populates="audit_logs")