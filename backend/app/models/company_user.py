#user\backend\app\models\company_user.py

from sqlalchemy import Column, String, Text, Enum, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base

status_enum = Enum("pending", "approved", "rejected", name="company_status_enum")

class CompanyUser(Base):
    __tablename__ = "company_user"
    __table_args__ = {"schema": "app_admin"}

    company_name = Column(String(255))
    address = Column(Text)
    email = Column(String(255), unique=True)
    username = Column(String(100), primary_key=True)
    password_hash = Column(String(255))
    status = Column(status_enum, default="pending")
    created_at = Column(TIMESTAMP, server_default=func.now())
    region = Column(String(10))