#user\backend\app\models\capture_registry.py

from sqlalchemy import Column, Integer, String
from app.core.database import Base


class CaptureRegistry(Base):

    __tablename__ = "capture_registry"
    __table_args__ = {"schema": "app_admin"}

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(100), index=True)
    request_code = Column(String(50))


    dataset_name = Column(String)
    table_name = Column(String)

    # 🔥 NEW COLUMN
    download_status = Column(String(5), default="no")