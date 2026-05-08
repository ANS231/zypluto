#user\backend\app\models\support_ticket.py

from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.core.database import Base


class SupportTicket(Base):
    __tablename__ = "support_tickets"
    __table_args__ = {"schema": "app_admin"}

    id = Column(Integer, primary_key=True, index=True)

    ticket_id = Column(String(50), unique=True, index=True)

    username = Column(String(100), nullable=True)
    user_type = Column(String(20), nullable=True)

    name = Column(String(100), nullable=True)
    email = Column(String(150), nullable=True)

    subject = Column(Text)

    category = Column(String(100))
    priority = Column(String(20))

    status = Column(String(20), default="open")

    assigned_admin = Column(String(100), nullable=True)

    sla_deadline = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)