#user\backend\app\models\addon_settings.py

from sqlalchemy import Column, Integer, String, Boolean, Numeric, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base


class AddonSettings(Base):
    __tablename__ = "addon_settings"
    __table_args__ = {"schema": "app_admin"}

    id = Column(Integer, primary_key=True)

    addon_type = Column(String(20))   # download / api
    region = Column(String(10))
    currency = Column(String(10))

    price = Column(Numeric(10, 2))
    addon_value  = Column(Integer)           # MB or API count

    is_active = Column(Boolean, default=True)

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())