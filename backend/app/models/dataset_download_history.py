#user\backend\app\models\dataset_download_history.py

from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base


class DatasetDownloadHistory(Base):

    __tablename__ = "dataset_download_history"
    __table_args__ = {"schema": "app_admin"}

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(100))
    dataset_id = Column(Integer)
    dataset_name = Column(String)

    action = Column(String(20))  # search / preview / download
    size_mb = Column(Integer)

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp()
    )