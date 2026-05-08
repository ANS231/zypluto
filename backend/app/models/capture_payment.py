from sqlalchemy import Column, Integer, String, TIMESTAMP, Numeric
from sqlalchemy.sql import func

from app.core.database import Base


class CapturePayment(Base):

    __tablename__ = "capture_payments"
    __table_args__ = {"schema": "app_admin"}

    id = Column(Integer, primary_key=True, index=True)

    capture_request_id = Column(Integer)

    request_code = Column(String(50))

    username = Column(String(100))

    stripe_payment_intent_id = Column(String(255))

    amount = Column(Numeric(10, 2))

    currency = Column(String(10), default="usd")

    payment_method = Column(String(50))

    status = Column(String(20), default="pending")

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp()
    )