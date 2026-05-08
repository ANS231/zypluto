#user\backend\app\models\enterprise_contract.py

from sqlalchemy import Column, Integer, String, DateTime, Numeric, TIMESTAMP, Boolean
from sqlalchemy.sql import func
from app.core.database import Base


class EnterpriseContract(Base):

    __tablename__ = "enterprise_contracts"
    __table_args__ = {"schema": "app_admin"}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    username = Column(String(100), index=True, nullable=False)

    # 🔥 UNIFIED LIMIT
    total_custom_limit_mb = Column(Integer, nullable=True)

    monthly_price = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(10), nullable=False)

    start_date = Column(DateTime, nullable=False)
    expire_date = Column(DateTime, nullable=False)

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp()
    )

    is_active = Column(Boolean, default=True)

    payment_status = Column(String(20), default="unpaid")