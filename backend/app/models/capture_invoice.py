from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.sql import func

from app.core.database import Base


class CaptureInvoice(Base):

    __tablename__ = "capture_invoices"
    __table_args__ = {"schema": "app_admin"}

    id = Column(Integer, primary_key=True, index=True)

    payment_id = Column(Integer)

    capture_request_id = Column(Integer)

    invoice_number = Column(String(50))

    invoice_pdf_path = Column(String)

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp()
    )