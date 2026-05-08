#user\backend\app\routes\capture_payment_routes.py

from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import stripe
import random

from app.core.database import get_db
from app.core.config import STRIPE_SECRET_KEY

from app.models.capture_request import CaptureRequest
from app.models.capture_payment import CapturePayment
from app.models.capture_invoice import CaptureInvoice
from app.models.notification import Notification

router = APIRouter(
    prefix="/api/capture-payment",
    tags=["Capture Payment"]
)

stripe.api_key = STRIPE_SECRET_KEY


# =========================
# REQUEST BODY
# =========================
class PaymentBody(BaseModel):
    capture_request_id: int


# =========================
# CREATE PAYMENT
# =========================
@router.post("/pay")
def pay_capture_request(
    data: PaymentBody,
    request: Request,
    db: Session = Depends(get_db)
):

    username = request.session.get("username")

    if not username:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized"
        )

    capture_request = db.query(CaptureRequest).filter(
        CaptureRequest.id == data.capture_request_id,
        CaptureRequest.username == username
    ).first()

    if not capture_request:
        raise HTTPException(
            status_code=404,
            detail="Request not found"
        )

    if capture_request.payment_status == "paid":
        return {
            "message": "Already paid"
        }

    if not capture_request.price:
        raise HTTPException(
            status_code=400,
            detail="Price not set yet"
        )

    # =========================
    # STRIPE PAYMENT INTENT
    # =========================
    intent = stripe.PaymentIntent.create(
        amount=int(capture_request.price * 100),
        currency="usd",
        payment_method_types=["card"]
    )

    # =========================
    # STORE PAYMENT
    # =========================
    payment = CapturePayment(
        capture_request_id=capture_request.id,
        request_code=capture_request.request_code,
        username=username,

        stripe_payment_intent_id=intent.id,

        amount=capture_request.price,

        currency="usd",

        payment_method="card",

        status="paid"
    )

    db.add(payment)

    # =========================
    # UPDATE REQUEST
    # =========================
    capture_request.payment_status = "paid"

    db.commit()
    db.refresh(payment)

    # =========================
    # CREATE INVOICE ENTRY
    # =========================
    invoice_number = f"INV-{random.randint(100000,999999)}"

    invoice = CaptureInvoice(
        payment_id=payment.id,
        capture_request_id=capture_request.id,
        invoice_number=invoice_number,
        invoice_pdf_path=""
    )

    db.add(invoice)

    db.add(Notification(
        username=username,
        title="Payment Successful",
        message=f"Payment completed successfully for request {capture_request.request_code}",
        ticket_id=capture_request.request_code,
        type="capture",
        read=False
    ))

    db.commit()

    return {
        "message": "Payment successful",
        "invoice_id": invoice.id
    }