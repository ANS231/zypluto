#user\backend\app\models\support_message.py

from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.core.database import Base


class SupportMessage(Base):

    __tablename__ = "support_messages"
    __table_args__ = {"schema": "app_admin"}

    id = Column(Integer, primary_key=True, index=True)

    ticket_id = Column(String(50), index=True)

    # user / admin
    sender_type = Column(String(20), index=True)

    # message text
    message = Column(Text, nullable=True)

    # file attachment
    attachment_path = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)