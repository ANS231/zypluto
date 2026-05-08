#user\backend\app\routes\public_support_routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.models.public_support_request import PublicSupportRequest

router = APIRouter(prefix="/public-support", tags=["Public Support"])


class PublicSupportRequestSchema(BaseModel):
    name: str
    email: str
    subject: str
    message: str


@router.post("/create")
def create_public_support(data: PublicSupportRequestSchema, db: Session = Depends(get_db)):

    new_request = PublicSupportRequest(
        name=data.name,
        email=data.email,
        subject=data.subject,
        message=data.message,
    )

    db.add(new_request)
    db.commit()

    return {"message": "Support request submitted successfully"}