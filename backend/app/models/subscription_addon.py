#user\backend\app\models\subscription_addon.py

from sqlalchemy import Column, Integer, String, DECIMAL, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base


class SubscriptionAddon(Base):
    __tablename__ = "subscription_addons"
    __table_args__ = {"schema": "app_admin"}

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(100), nullable=False, index=True)

    # Format: YYYY-MM
    month_year = Column(String(7), nullable=False, index=True)

    # 🔥 Unified extra data (MB)
    extra_mb = Column(Integer, nullable=False)

    amount = Column(DECIMAL(10, 2), nullable=False)
    currency = Column(String(10), nullable=False)

    created_at = Column(TIMESTAMP, server_default=func.now())