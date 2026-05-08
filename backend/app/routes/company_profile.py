#user\backend\app\routes\company_profile.py

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.company_user import CompanyUser
from app.schemas.company_user import CompanyUserProfile

router = APIRouter(prefix="/company", tags=["Company"])


@router.get("/profile", response_model=CompanyUserProfile)
def get_company_profile(request: Request, db: Session = Depends(get_db)):

    username = request.session.get("username")
    role = request.session.get("role")

    if not username:
        raise HTTPException(status_code=401, detail="Not logged in")

    if role != "company":
        raise HTTPException(status_code=403, detail="Company access only")

    company = db.query(CompanyUser).filter(
        CompanyUser.username == username
    ).first()

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    return company