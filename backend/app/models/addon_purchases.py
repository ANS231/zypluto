#user\backend\app\models\addon_purchases.py

from sqlalchemy import Column, Integer, String, DECIMAL, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base


class AddonPurchase(Base):
    __tablename__ = "addon_purchases"
    __table_args__ = {"schema": "app_admin"}

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(100), nullable=False)

    addon_type = Column(String(50), nullable=False)
    addon_value = Column(Integer, nullable=False)

    price = Column(DECIMAL(10, 2), nullable=False)
    currency = Column(String(10), nullable=False)

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp()
    )