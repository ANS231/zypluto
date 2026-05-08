#user\backend\app\models\user_audit_logs.py

from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base


class UserAuditLogs(Base):

    __tablename__ = "user_audit_logs"
    __table_args__ = {"schema": "app_admin"}

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(100), nullable=False)
    action = Column(String(255), nullable=False)

    target_resource = Column(String(255), nullable=True)
    resource_table = Column(String(100), nullable=True)

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp()
    )