#user\backend\app\schemas\personal_user.py

from pydantic import BaseModel
from datetime import datetime
from enum import Enum

class StatusEnum(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class PersonalUserProfile(BaseModel):
    full_name: str
    address: str
    username: str
    status: StatusEnum
    created_at: datetime

    model_config = {
        "from_attributes": True
    }