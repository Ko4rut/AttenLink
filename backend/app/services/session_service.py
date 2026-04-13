from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from uuid import UUID
from datetime import datetime, timedelta, timezone
import uuid
from app.models.qrcode_model import QRCodeDB

from app.models.session_model import SessionDB
from app.models.section_model import SectionDB
from app.schemas.session_schema import SessionCreate, SessionUpdate, SessionResponse, SessionBySectionItem
from app.services.auditlog_service import create_audit_log_service
from app.models.attendance_model import AttendanceRecordDB
from app.models.enrollment_model import EnrollmentDB


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
        sessions = (
            db.query(SessionDB)
            .filter(
                SessionDB.SectionID == section_id,
                SessionDB.isDeleted == False
            )
            .order_by(SessionDB.Time.desc())
            .all()
        )

        total_students = (
            db.query(func.count(EnrollmentDB.EnrollmentID))
            .filter(
                EnrollmentDB.SectionID == section_id,
                EnrollmentDB.isDeleted == False
            )
            .scalar()
        ) or 0

        result = []

        for session in sessions:
            attendance_count = (
                db.query(func.count(AttendanceRecordDB.AttendanceRecordID))
                .filter(
                    AttendanceRecordDB.SessionID == session.SessionID,
                    AttendanceRecordDB.isDeleted == False
                )
                .scalar()
            ) or 0

            active_qr = (
                db.query(QRCodeDB)
                .filter(
                    QRCodeDB.SessionID == session.SessionID,
                    QRCodeDB.isActive == True
                )
                .first()
            )

            session_status = "Active" if active_qr else "Closed"

            result.append({
                "SessionID": session.SessionID,
                "SectionID": session.SectionID,
                "Name": session.Name,
                "Time": session.Time,
                "isDeleted": session.isDeleted,
                "attendanceCount": attendance_count,
                "totalStudents": total_students,
                "status": session_status
            })

        return result

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

        section = db.query(SectionDB).filter(
            SectionDB.SectionID == session.SectionID,
            SectionDB.isDeleted == False
        ).first()

        if not section:
            raise HTTPException(status_code=404, detail="Section not found")

        if section.teacherUserID != teacher_user_id:
            raise HTTPException(status_code=403, detail="No permission")

        # Revoke tất cả QR cũ đang active của session này
        db.query(QRCodeDB).filter(
            QRCodeDB.SessionID == session_id,
            QRCodeDB.isActive == True
        ).update(
            {"isActive": False},
            synchronize_session=False
        )

        token = str(uuid.uuid4())
        expire_at = datetime.now(timezone.utc) + timedelta(minutes=15)

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

        return {
            "QRTokenID": new_qrcode.QRTokenID,
            "token": new_qrcode.token,
            "createAt": new_qrcode.createAt,
            "expireAt": new_qrcode.expireAt,
            "isActive": new_qrcode.isActive
        }

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Generate QR failed: {str(e)}"
        )
    
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

        if section.teacherUserID != teacher_user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to delete this section"
            )

        qrcode.isActive = False
        db.flush()
        
        create_audit_log_service(
            userID=teacher_user_id,
            action="REVOKE_QR_CODE",
            db=db
        )
        db.commit() 
        db.refresh(qrcode)

        return qrcode

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Revoke QR failed: {str(e)}")

# ====================== SOFT DELETE SECTION ======================
def delete_section_service(
    section_id: UUID,
    teacher_user_id: UUID,
    db: Session
):
    try:
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
                detail="You do not have permission to delete this section"
            )

        section.isDeleted = True
        db.flush()

        create_audit_log_service(
            userID=teacher_user_id,
            action="DELETE_SECTION",
            db=db
        )
        db.commit()
        db.refresh(section)

        return section

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Delete section failed: {str(e)}"
        )

def get_session_by_section_4Student_service(
    section_code: str,
    student_id: UUID,
    db: Session
):
    try:
        # 1. Tìm section theo code
        section = (
            db.query(SectionDB)
            .filter(
                SectionDB.code == section_code,
                SectionDB.isDeleted == False
            )
            .first()
        )

        if not section:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Section not found"
            )

        # 2. Check student đã join section chưa
        enrollment = (
            db.query(EnrollmentDB)
            .filter(
                EnrollmentDB.SectionID == section.SectionID,
                EnrollmentDB.StudentID == student_id,
                EnrollmentDB.isDeleted == False
            )
            .first()
        )

        if not enrollment:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You have not joined this section"
            )

        # 3. Lấy tất cả session của section
        sessions = (
            db.query(SessionDB)
            .filter(
                SessionDB.SectionID == section.SectionID,
                SessionDB.isDeleted == False
            )
            .order_by(SessionDB.Time.asc())
            .all()
        )

        session_ids = [session.SessionID for session in sessions]

        # 4. Lấy attendance record của student trong các session đó
        attendance_records = []
        if session_ids:
            attendance_records = (
                db.query(AttendanceRecordDB)
                .filter(
                    AttendanceRecordDB.SessionID.in_(session_ids),
                    AttendanceRecordDB.studentUserID == student_id,
                    AttendanceRecordDB.isDeleted == False
                )
                .all()
            )

        attendance_map = {
            record.SessionID: record
            for record in attendance_records
        }

        # 5. Map dữ liệu trả về
        attended_count = 0
        session_items = []

        for session in sessions:
            attendance = attendance_map.get(session.SessionID)

            if attendance:
                attended_count += 1
                session_items.append({
                    "SessionID": session.SessionID,
                    "name": session.Name,
                    "time": session.Time,
                    "attendanceRecordID": attendance.AttendanceRecordID,
                    "checkInTime": attendance.CreateAt,
                    "status": "Attended"
                })
            else:
                session_items.append({
                    "SessionID": session.SessionID,
                    "name": session.Name,
                    "time": session.Time,
                    "attendanceRecordID": None,
                    "checkInTime": None,
                    "status": "Absent"
                })

        return {
            "SectionID": section.SectionID,
            "code": section.code,
            "name": section.name,
            "description": section.description,
            "attendedCount": attended_count,
            "totalSessions": len(sessions),
            "sessions": session_items
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Get sessions by section for student failed: {str(e)}"
        )