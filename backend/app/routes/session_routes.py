from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.schemas.session_schema import SessionCreate, SessionUpdate, SessionResponse
from app.services.session_service import (
    create_session_service,
    get_sessions_by_section_service,
    get_session_by_id_service,
    update_session_service,
    generate_qr_token_service,
)

router = APIRouter(prefix="/sessions", tags=["Sessions"])


@router.post("/sections/{section_id}/sessions", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
def create_session(
    section_id: UUID,
    session: SessionCreate,
    teacher_user_id: UUID,           # Để check quyền
    db: Session = Depends(get_db)
):
    return create_session_service(
        section_id=section_id,
        session=session,
        teacher_user_id=teacher_user_id,
        db=db
    )


@router.get("/sections/{section_id}/sessions", response_model=list[SessionResponse])
def get_sessions_by_section(
    section_id: UUID,
    db: Session = Depends(get_db)
):
    return get_sessions_by_section_service(section_id=section_id, db=db)


@router.get("/{session_id}", response_model=SessionResponse)
def get_session_detail(session_id: UUID, db: Session = Depends(get_db)):
    return get_session_by_id_service(session_id=session_id, db=db)


@router.post("/{session_id}/qrcode", response_model=SessionResponse)
def generate_qr_code(
    session_id: UUID,
    teacher_user_id: UUID,
    db: Session = Depends(get_db)
):
    return generate_qr_token_service(
        session_id=session_id,
        teacher_user_id=teacher_user_id,
        db=db
    )


@router.put("/{session_id}", response_model=SessionResponse)
def update_session(
    session_id: UUID,
    session_update: SessionUpdate,
    teacher_user_id: UUID,
    db: Session = Depends(get_db)
):
    return update_session_service(
        session_id=session_id,
        session_update=session_update,
        teacher_user_id=teacher_user_id,
        db=db
    )