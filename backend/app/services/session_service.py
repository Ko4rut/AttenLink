from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timedelta
import uuid
from app.models.qrcode_model import QRCodeDB

from app.models.session_model import SessionDB
from app.models.section_model import SectionDB
from app.schemas.session_schema import SessionCreate, SessionUpdate, SessionResponse
from app.services.auditlog_service import create_audit_log_service


# ====================== CREATE SESSION ======================
def create_session_service(
    section_id: UUID,
    session: SessionCreate,
    teacher_user_id: UUID,
    db: Session
):
    try:
        # Kiểm tra Section tồn tại và teacher có quyền
        section = db.query(SectionDB).filter(
            SectionDB.SectionID == section_id,
            SectionDB.isDeleted == False
        ).first()

        if not section:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Section not found"
            )

        if section.teacherUserID != teacher_user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to create session for this section"
            )

        new_session = SessionDB(
            SectionID=section_id,
            Name=session.Name,
            Time=session.Time,
            isDeleted=False
        )

        db.add(new_session)
        db.flush()

        create_audit_log_service(
            userID=teacher_user_id,
            action="CREATE_SESSION",
            db=db
        )
        db.commit() 

        db.refresh(new_session)
        return new_session

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Create session failed: {str(e)}"
        )


# ====================== GET SESSIONS BY SECTION ======================
def get_sessions_by_section_service(section_id: UUID, db: Session):
    try:
        sessions = db.query(SessionDB).filter(
            SessionDB.SectionID == section_id,
            SessionDB.isDeleted == False
        ).order_by(SessionDB.Time.desc()).all()

        return sessions

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Get sessions failed: {str(e)}"
        )


# ====================== GET SESSION BY ID ======================
def get_session_by_id_service(session_id: UUID, db: Session):
    session = db.query(SessionDB).filter(
        SessionDB.SessionID == session_id,
        SessionDB.isDeleted == False
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )

    return session


# ====================== UPDATE SESSION ======================
def update_session_service(
    session_id: UUID,
    session_update: SessionUpdate,
    teacher_user_id: UUID,
    db: Session
):
    try:
        session = db.query(SessionDB).filter(
            SessionDB.SessionID == session_id,
            SessionDB.isDeleted == False
        ).first()

        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )

        # Check quyền teacher
        section = db.query(SectionDB).filter(SectionDB.SectionID == session.SectionID).first()
        if section and section.teacherUserID != teacher_user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to update this session"
            )

        if session_update.Name is not None:
            session.Name = session_update.Name

        if session_update.Time is not None:
            session.Time = session_update.Time

        db.flush()

        create_audit_log_service(
            userID=teacher_user_id,
            action="UPDATE_SESSION",
            db=db
        )
        db.commit() 
        db.refresh(session)
        return session

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Update session failed: {str(e)}"
        )


# ====================== GENERATE QR CODE TOKEN ======================


def generate_qr_token_service(
    session_id: UUID,
    teacher_user_id: UUID,
    db: Session
):
    try:
        session = db.query(SessionDB).filter(
            SessionDB.SessionID == session_id,
            SessionDB.isDeleted == False
        ).first()

        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        # Check quyền teacher
        section = db.query(SectionDB).filter(SectionDB.SectionID == session.SectionID).first()
        if section and section.teacherUserID != teacher_user_id:
            raise HTTPException(status_code=403, detail="No permission")

        # Tạo QR Code mới
        token = str(uuid.uuid4())
        expire_at = datetime.utcnow() + timedelta(minutes=15)  # ví dụ 15 phút

        new_qrcode = QRCodeDB(
            SessionID=session_id,
            token=token,
            expireAt=expire_at,
            isActive=True
        )

        db.add(new_qrcode)
        db.flush()

        create_audit_log_service(
            userID=teacher_user_id,
            action="GENERATE_QR_TOKEN",
            db=db
        )

        db.commit()
        db.refresh(new_qrcode)

        # Trả về cả session + qrcode info nếu cần
        return {
            "session": session,
            "qrcode": {
                "QRTokenID": new_qrcode.QRTokenID,
                "token": new_qrcode.token,
                "expireAt": new_qrcode.expireAt
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Generate QR failed: {str(e)}")
    
# ====================== GET CURRENT ACTIVE QR CODE ======================
def get_current_qrcode_service(session_id: UUID, db: Session):
    try:
        # Lấy QRCode active nhất, chưa expire
        qrcode = db.query(QRCodeDB).filter(
            QRCodeDB.SessionID == session_id,
            QRCodeDB.isActive == True,
            QRCodeDB.expireAt > datetime.utcnow()
        ).order_by(QRCodeDB.createAt.desc()).first()

        if not qrcode:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No active QR code found for this session"
            )

        return qrcode

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Get current QR code failed: {str(e)}"
        )


# ====================== REVOKE QR CODE ======================
def revoke_qrcode_service(qr_token_id: UUID, teacher_user_id: UUID, db: Session):
    try:
        qrcode = db.query(QRCodeDB).filter(
            QRCodeDB.QRTokenID == qr_token_id
        ).first()

        if not qrcode:
            raise HTTPException(status_code=404, detail="QR Code not found")

        # Check quyền teacher qua session
        session = db.query(SessionDB).filter(
            SessionDB.SessionID == qrcode.SessionID,
            SessionDB.isDeleted == False
        ).first()

        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        section = db.query(SectionDB).filter(
            SectionDB.SectionID == session.SectionID
        ).first()

        if section and section.teacherUserID != teacher_user_id:
            raise HTTPException(status_code=403, detail="No permission")

        qrcode.isActive = False
        db.commit()
        create_audit_log_service(
            userID=teacher_user_id,
            action="REVOKE_QR_CODE",
            db=db
        )

        db.commit()
        db.refresh(qrcode)

        return {
            "QRTokenID": qrcode.QRTokenID,
            "isActive": qrcode.isActive,
            "message": "QR Code has been revoked successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print("ERROR:", str(e))  # thêm dòng này
        raise HTTPException(status_code=400, detail=f"Revoke QR failed: {str(e)}")
