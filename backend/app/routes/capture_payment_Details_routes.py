#user\backend\app\routes\capture_payment_Details_routes.py
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.models.capture_payment import CapturePayment

router = APIRouter(
    prefix="/api/capture-payment-details",
    tags=["Capture Payment Details"]
)


# =========================
# GET USER PAYMENT DETAILS
# =========================
@router.get("/")
def get_payment_details(
    request: Request,
    db: Session = Depends(get_db)
):

    username = request.session.get("username")

    if not username:
        raise HTTPException(status_code=401)

    payments = db.query(CapturePayment).filter(
        CapturePayment.username == username
    ).order_by(
        CapturePayment.created_at.desc()
    ).all()

    return [
        {
            "id": p.id,
            "request_code": p.request_code,
            "amount": float(p.amount),
            "currency": p.currency,
            "status": p.status,
            "payment_method": p.payment_method,
            "stripe_payment_intent_id": p.stripe_payment_intent_id,
            "created_at": p.created_at
        }
        for p in payments
    ]