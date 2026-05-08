#user\backend\app\models\user_usage_tracking.py

from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base


class UserUsageTracking(Base):

    __tablename__ = "user_usage_tracking"
    __table_args__ = {"schema": "app_admin"}

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(100), index=True)
    month_year = Column(String(7), index=True)

    download_used_mb = Column(Integer, default=0)
    api_used_mb = Column(Integer, default=0)

    addon_mb = Column(Integer, default=0)
    plan_limit_mb = Column(Integer, default=0)

    total_limit_mb = Column(Integer, default=0)
    remaining_mb = Column(Integer, default=0)

    status = Column(String(20), default="OK")

    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())