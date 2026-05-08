#user\backend\app\models\invoice.py

from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base

class Invoice(Base):
    __tablename__ = "invoices"
    __table_args__ = {"schema": "app_admin"}

    id = Column(Integer, primary_key=True)
    payment_id = Column(Integer, ForeignKey("app_admin.payments.id"))
    invoice_number = Column(String(50))
    invoice_pdf_path = Column(String(255))
    created_at = Column(TIMESTAMP, server_default=func.now())