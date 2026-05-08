#user\backend\app\models\capture_request.py

from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base


class CaptureRequest(Base):

    __tablename__ = "capture_request"
    __table_args__ = {"schema": "app_admin"}
    
    id = Column(Integer, primary_key=True, index=True)
    request_code = Column(String(50), unique=True, index=True)
    username = Column(String)
    name = Column(String)
    email_id = Column(String)
    contact_number = Column(String)
    address = Column(String)
    request_description = Column(String)

    status = Column(String, default="pending")
    price = Column(Integer, nullable=True)
    payment_status = Column(String, default="pending")

    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    