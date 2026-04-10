# app/models/qrcode_model.py
from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from sqlalchemy.sql import func

from app.core.database import Base


class QRCodeDB(Base):
    __tablename__ = "QRCode"

    QRTokenID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    SessionID = Column(UUID(as_uuid=True), ForeignKey("Session.SessionID"), nullable=False)
    
    token = Column(String, unique=True, nullable=False, index=True)
    expireAt = Column(DateTime, nullable=False)
    isActive = Column(Boolean, default=True, nullable=False)
    createAt = Column(DateTime(timezone=False), server_default=func.now())
    # Relationship
    session = relationship("SessionDB", back_populates="qrcodes")