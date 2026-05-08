#user\backend\app\models\support_priority.py

from sqlalchemy import Column, Integer, String
from app.core.database import Base


class SupportPriority(Base):
    __tablename__ = "support_priorities"
    __table_args__ = {"schema": "app_admin"}

    id = Column(Integer, primary_key=True, index=True)

    priority_name = Column(String(20), unique=True)

    sla_hours = Column(Integer)