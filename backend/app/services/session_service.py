from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime

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
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )

        # Check quyền
        section = db.query(SectionDB).filter(SectionDB.SectionID == session.SectionID).first()
        if section and section.teacherUserID != teacher_user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to generate QR for this session"
            )

        # Tạo token QR (có thể dùng UUID hoặc JWT sau này)
        import uuid
        session.qrToken = str(uuid.uuid4())
        session.isActive = True

        db.flush()

        create_audit_log_service(
            userID=teacher_user_id,
            action="GENERATE_QR_TOKEN",
            db=db
        )

        db.refresh(session)
        return session

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Generate QR token failed: {str(e)}"
        )