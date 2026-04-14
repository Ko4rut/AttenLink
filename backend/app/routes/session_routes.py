from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from uuid import UUID
from app.dependencies.auth import get_current_student 
from app.core.database import get_db
from app.schemas.session_schema import (GenerateQRCodeResponse, SessionCreate, SessionUpdate, SessionResponse
                                        ,SessionBySectionResponse, QRCodeResponse,    SectionDeleteResponse,
                                        QRCodeRevokeResponse, StudentSectionDetailApiResponse)
from app.services.session_service import (
    create_session_service,
    get_sessions_by_section_service,
    get_session_by_id_service,
    update_session_service,
    generate_qr_token_service,
    get_current_qrcode_service,
    revoke_qrcode_service,
    delete_section_service,
    get_session_by_section_4Student_service,
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

@router.get("/sections/{section_id}/sessions", response_model=SessionBySectionResponse)
def get_sessions_by_section(section_id: UUID, db: Session = Depends(get_db)):
    sessions = get_sessions_by_section_service(section_id, db)
    return {
        "message": "Get sessions successfully",
        "data": sessions
    }


@router.get("/{session_id}", response_model=SessionResponse)
def get_session_detail(session_id: UUID, db: Session = Depends(get_db)):
    return get_session_by_id_service(session_id=session_id, db=db)


@router.post("/{session_id}/qrcode", response_model=QRCodeResponse)
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

# ==================== GET CURRENT QR CODE ====================
@router.get("/{session_id}/qrcode/current", response_model=QRCodeResponse)
def get_current_qrcode(
    session_id: UUID,
    db: Session = Depends(get_db)
):
    return get_current_qrcode_service(session_id=session_id, db=db)


# ==================== REVOKE QR CODE ====================
@router.patch("/qrcode/{qr_token_id}/revoke", response_model=QRCodeRevokeResponse)
def revoke_qrcode(
    qr_token_id: UUID,
    teacher_user_id: UUID,
    db: Session = Depends(get_db)
):
    result = revoke_qrcode_service(
        qr_token_id=qr_token_id,
        teacher_user_id=teacher_user_id,
        db=db
    )
    return QRCodeRevokeResponse(
        QRTokenID=result.QRTokenID,
        isActive=result.isActive,
        message="QR Code revoked successfully"
    )

# ==================== SOFT DELETE SECTION ====================
@router.patch("/sections/{section_id}/delete", response_model=SectionDeleteResponse)
def delete_section(
    section_id: UUID,
    teacher_user_id: UUID,
    db: Session = Depends(get_db)
):
    section = delete_section_service(
        section_id=section_id,
        teacher_user_id=teacher_user_id,
        db=db
    )
    return SectionDeleteResponse(
        SectionID=section.SectionID,
        isDeleted=section.isDeleted,
        message="Section deleted successfully"
    )

@router.get(
    "/sections/{section_code}",
    response_model=StudentSectionDetailApiResponse,
    summary="Get session info for student interface"
)
def get_section_detail_for_student(
    section_code: str,
    current_student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    data = get_session_by_section_4Student_service(
        section_code=section_code,
        student_id=current_student.userID,
        db=db
    )

    return {
        "message": "Get section detail successfully",
        "data": data
    }