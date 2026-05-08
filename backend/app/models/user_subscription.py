#user\backend\app\models\user_subscription.py

from sqlalchemy import Column, Integer, String, DateTime, TIMESTAMP, Enum
from sqlalchemy.sql import func
from app.core.database import Base

subscription_status_enum = Enum(
    "active", "expired", "cancelled",
    name="subscription_status_enum"
)


class UserSubscription(Base):

    __tablename__ = "user_subscriptions"
    __table_args__ = {"schema": "app_admin"}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    username = Column(String(100), index=True, nullable=False)

    subscription_id = Column(Integer, nullable=False)

    start_date = Column(DateTime, nullable=False)
    expire_date = Column(DateTime, nullable=False)

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp()
    )

    status = Column(subscription_status_enum, default="active")