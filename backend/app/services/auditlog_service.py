from sqlalchemy.orm import Session

from app.models.auditlog_model import AuditLogDB


def create_audit_log_service(userID, action: str, db: Session):
    new_audit_log = AuditLogDB(
        userID=userID,
        action=action
    )

    db.add(new_audit_log)
    db.flush()
    return new_audit_log