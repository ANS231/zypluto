#user\backend\app\services\invoice_service.py

import os
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.invoice import Invoice


INVOICE_FOLDER = "invoices"


def generate_invoice_file(invoice_id: int):

    if not os.path.exists(INVOICE_FOLDER):
        os.makedirs(INVOICE_FOLDER)

    file_path = f"{INVOICE_FOLDER}/invoice_{invoice_id}.txt"

    with open(file_path, "w") as f:
        f.write("Capture.Expert Invoice\n")
        f.write("========================\n")
        f.write(f"Invoice ID: {invoice_id}\n")
        f.write(f"Generated On: {datetime.utcnow()}\n")
        f.write("Thank you for your payment.\n")

    return file_path


def create_invoice(payment_id: int, db: Session):

    invoice_number = f"INV-{payment_id}"

    invoice = Invoice(
        payment_id=payment_id,
        invoice_number=invoice_number,
        invoice_pdf_path=""  # set after file creation
    )

    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    file_path = generate_invoice_file(invoice.id)

    invoice.invoice_pdf_path = file_path
    db.commit()
    db.refresh(invoice)

    return invoice