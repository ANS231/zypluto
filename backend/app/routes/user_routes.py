#user\backend\app\routes\user_routes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from fastapi import Request

from app.core.database import get_db
from app.models.company_user import CompanyUser
from app.models.personal_user import PersonalUser
from app.core.security import verify_password, create_access_token
from datetime import datetime
from app.models.enterprise_contract import EnterpriseContract

router = APIRouter(prefix="/api")


class LoginRequest(BaseModel):
    username: str
    password: str
    role: str



@router.get("/enterprise/check")
def check_enterprise_payment(
    request: Request,
    db: Session = Depends(get_db)
):
    username = request.session.get("username")

    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")

    contract = db.query(EnterpriseContract).filter(
        EnterpriseContract.username == username,
        EnterpriseContract.is_active == True
    ).first()

    if not contract:
        return {"enterprise": False}

    # 🔥 expiry check
    if contract.expire_date < datetime.utcnow():
        return {
            "enterprise": True,
            "expired": True
        }

    # 🔥 unpaid check
    if contract.payment_status == "unpaid":
        return {
            "enterprise": True,
            "payment_required": True,
            "amount": float(contract.monthly_price),
            "currency": contract.currency
        }

    return {
        "enterprise": True,
        "payment_required": False
    }