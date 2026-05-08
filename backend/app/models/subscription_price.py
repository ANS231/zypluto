#user\backend\app\models\subscription_price.py

from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from app.core.database import Base


class SubscriptionPrice(Base):
    __tablename__ = "subscription_prices"
    __table_args__ = {"schema": "app_admin"}

    id = Column(Integer, primary_key=True, index=True)

    subscription_id = Column(
        Integer,
        ForeignKey("app_admin.subscription_plans.id")
    )

    region = Column(String(10))
    currency = Column(String(5))

    monthly_price = Column(Numeric(10, 2))