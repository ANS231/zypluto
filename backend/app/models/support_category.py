#user\backend\app\models\support_category.py

from sqlalchemy import Column, Integer, String
from app.core.database import Base


class SupportCategory(Base):
    __tablename__ = "support_categories"
    __table_args__ = {"schema": "app_admin"}

    id = Column(Integer, primary_key=True, index=True)

    category_name = Column(String(100), unique=True)