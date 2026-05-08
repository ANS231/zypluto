#user\backend\app\routes\invoice_routes.py

from fastapi import APIRouter
from fastapi.responses import FileResponse
import os

router = APIRouter(prefix="/api/invoice", tags=["Invoice"])


@router.get("/{invoice_id}")
def download_invoice(invoice_id: int):

    path = f"invoices/invoice_{invoice_id}.txt"  # FIXED

    if os.path.exists(path):
        return FileResponse(path, filename=f"invoice_{invoice_id}.txt")

    return {"message": "Invoice not found"}