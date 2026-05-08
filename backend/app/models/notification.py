#user\backend\app\models\notification.py

from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP
from sqlalchemy.sql import func

from app.core.database import Base


class Notification(Base):

    __tablename__ = "notifications"
    __table_args__ = {"schema": "app_admin"}

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(100))

    # ✅ ADD THIS
    title = Column(String(255))

    message = Column(String)

    ticket_id = Column(String(100))

    type = Column(String(50))

    read = Column(Boolean, default=False)

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp()
    )