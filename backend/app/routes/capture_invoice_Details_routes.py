#user\backend\app\routes\capture_invoice_Details_routes.py

from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.models.capture_invoice import CaptureInvoice
from app.models.capture_payment import CapturePayment

router = APIRouter(
    prefix="/api/capture-invoice-details",
    tags=["Capture Invoice Details"]
)


# =========================
# GET USER INVOICE DETAILS
# =========================
@router.get("/")
def get_invoice_details(
    request: Request,
    db: Session = Depends(get_db)
):

    username = request.session.get("username")

    if not username:
        raise HTTPException(status_code=401)

    results = db.query(
        CaptureInvoice,
        CapturePayment
    ).join(
        CapturePayment,
        CaptureInvoice.payment_id == CapturePayment.id
    ).filter(
        CapturePayment.username == username
    ).order_by(
        CaptureInvoice.created_at.desc()
    ).all()

    data = []

    for inv, pay in results:

        data.append({
            "invoice_id": inv.id,
            "invoice_number": inv.invoice_number,

            "request_code": pay.request_code,

            "amount": float(pay.amount),

            "currency": pay.currency,

            "status": pay.status,

            "payment_method": pay.payment_method,

            "created_at": inv.created_at
        })

    return data