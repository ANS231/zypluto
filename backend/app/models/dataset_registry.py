#user\backend\app\models\dataset_registry.py

from sqlalchemy import Column, Integer, String
from app.core.database import Base

class DatasetRegistry(Base):
    __tablename__ = "dataset_registry"
    __table_args__ = {"schema": "app_admin"}

    id = Column(Integer, primary_key=True, index=True)

    tier = Column(String)
    level1 = Column(String)
    level2 = Column(String)
    level3 = Column(String)

    dataset_name = Column(String)
    table_name = Column(String)