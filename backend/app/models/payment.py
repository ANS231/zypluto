#user\backend\app\models\payment.py

from sqlalchemy import Column, Integer, String, DECIMAL, TIMESTAMP, Enum
from sqlalchemy.sql import func
from app.core.database import Base

payment_status_enum = Enum("pending", "paid", "failed", name="payment_status_enum")

class Payment(Base):
    __tablename__ = "payments"
    __table_args__ = {"schema": "app_admin"}

    id = Column(Integer, primary_key=True)
    username = Column(String(100))
    amount = Column(DECIMAL(10,2))
    currency = Column(String(10))
    payment_status = Column(payment_status_enum)
    created_at = Column(TIMESTAMP, server_default=func.now())