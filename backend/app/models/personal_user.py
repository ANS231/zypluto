#user\backend\app\models\personal_user.py

from sqlalchemy import Column, String, Text, Enum, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base

status_enum = Enum("pending", "approved", "rejected", name="personal_status_enum")

class PersonalUser(Base):
    __tablename__ = "personal_user"
    __table_args__ = {"schema": "app_admin"}

    full_name = Column(String(255))
    address = Column(Text)
    username = Column(String(100), primary_key=True)
    password_hash = Column(String(255))
    status = Column(status_enum, default="pending")
    created_at = Column(TIMESTAMP, server_default=func.now())
    region = Column(String(10))