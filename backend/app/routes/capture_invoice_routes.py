from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.models.capture_invoice import CaptureInvoice

router = APIRouter(
    prefix="/api/capture-invoice",
    tags=["Capture Invoice"]
)


@router.get("/{invoice_id}")
def get_invoice(
    invoice_id: int,
    request: Request,
    db: Session = Depends(get_db)
):

    username = request.session.get("username")

    if not username:
        raise HTTPException(
            status_code=401
        )

    invoice = db.query(CaptureInvoice).filter(
        CaptureInvoice.id == invoice_id
    ).first()

    if not invoice:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found"
        )

    return {
        "invoice_id": invoice.id,
        "invoice_number": invoice.invoice_number,
        "created_at": invoice.created_at
    }