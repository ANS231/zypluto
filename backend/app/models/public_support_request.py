#user\backend\app\models\public_support_request.py

from sqlalchemy import Column, Integer, String, Text, DateTime, Enum
from datetime import datetime
from app.core.database import Base

support_status_enum = Enum("open", "closed", "pending", name="support_status_enum")

class PublicSupportRequest(Base):
    __tablename__ = "public_support_requests"
    __table_args__ = {"schema": "app_admin"}

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(255))
    email = Column(String(255))
    subject = Column(String(255))
    message = Column(Text)
    
    status = Column(support_status_enum, default="open")

    created_at = Column(DateTime, default=datetime.utcnow)