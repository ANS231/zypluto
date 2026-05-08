#user\backend\app\routes\capture_request_routes.py

from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from sqlalchemy import text
import csv
import io
import random

from app.core.database import get_db
from app.core.dataset_db import get_dataset_db

from app.models.capture_request import CaptureRequest
from app.models.capture_registry import CaptureRegistry
from app.models.user_audit_logs import UserAuditLogs
from app.models.notification import Notification

router = APIRouter(prefix="/api/capture", tags=["Capture Request"])


# ---------------------------
# REQUEST BODY
# ---------------------------
class CaptureRequestBody(BaseModel):
    name: str
    email_id: str
    contact_number: str
    address: str
    request_description: str


# ---------------------------
# SUBMIT REQUEST
# ---------------------------
@router.post("/submit")
def submit_capture_request(
    data: CaptureRequestBody,
    request: Request,
    db: Session = Depends(get_db)
):

    username = request.session.get("username")

    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")

    request_code = f"CR-{random.randint(100000, 999999)}"
    
    new_request = CaptureRequest(
        request_code=request_code,
        username=username,
        name=data.name,
        email_id=data.email_id,
        contact_number=data.contact_number,
        address=data.address,
        request_description=data.request_description
    )

    db.add(new_request)

    db.add(Notification(
        username=username,
        title="Capture Request Submitted",
        message=f"Your capture request {request_code} has been submitted successfully",
        ticket_id=request_code,
        type="capture",
        read=False
    ))

    db.add(UserAuditLogs(
        username=username,
        action="capture_request",
        target_resource=data.request_description,
        resource_table="capture_request"
    ))

    db.commit()

    return {
        "message": "Request submitted successfully",
        "request_id": new_request.id,
        "request_code": request_code
    }


# ---------------------------
# GET USER REQUEST STATUS
# ---------------------------
@router.get("/my-requests")
def my_requests(request: Request, db: Session = Depends(get_db)):

    username = request.session.get("username")

    if not username:
        raise HTTPException(status_code=401)

    data = db.query(CaptureRequest).filter(
        CaptureRequest.username == username
    ).order_by(CaptureRequest.id.desc()).all()

    return [
        {
            "id": r.id,
            "request_code": r.request_code,
            "status": r.status,
            "price": r.price,
            "payment_status": r.payment_status
        }
        for r in data
    ]


# ---------------------------
# GET USER ASSIGNED DATA
# ---------------------------
@router.get("/my-data")
def get_my_data(request: Request, db: Session = Depends(get_db)):

    username = request.session.get("username")

    if not username:
        raise HTTPException(status_code=401)

    records = db.query(CaptureRegistry).filter(
        CaptureRegistry.username == username
    ).all()

    response = []

    for r in records:

        req = db.query(CaptureRequest).filter(
            CaptureRequest.request_code == r.request_code
        ).first()

        payment_status = "pending"

        if req:
            payment_status = req.payment_status

        response.append({
            "id": r.id,
            "request_code": r.request_code,
            "dataset_name": r.dataset_name,
            "payment_status": payment_status
        })

    return response

# ---------------------------
# DOWNLOAD ASSIGNED DATA
# ---------------------------
@router.get("/download")
def download_capture_data(
    id: int,
    request: Request,
    db: Session = Depends(get_db),
    dataset_db: Session = Depends(get_dataset_db)
):

    username = request.session.get("username")

    if not username:
        raise HTTPException(status_code=401)

    # ---------------------------
    # FIND DATASET
    # ---------------------------
    record = db.query(CaptureRegistry).filter(
        CaptureRegistry.id == id,
        CaptureRegistry.username == username
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Data not found"
        )

    # ---------------------------
    # VERIFY PAYMENT
    # ---------------------------
    req = db.query(CaptureRequest).filter(
        CaptureRequest.request_code == record.request_code
    ).first()

    if not req or req.payment_status != "paid":
        raise HTTPException(
            status_code=403,
            detail="Payment required before download"
        )

    try:

        query = text(f'SELECT * FROM {record.table_name}')

        result = dataset_db.execute(query)

        rows = result.fetchall()

        if not rows:
            raise HTTPException(
                status_code=404,
                detail="No data"
            )

        columns = result.keys()

        output = io.StringIO()

        writer = csv.DictWriter(
            output,
            fieldnames=columns
        )

        writer.writeheader()

        writer.writerows([
            dict(zip(columns, r))
            for r in rows
        ])

        output.seek(0)

        # update download status
        record.download_status = "yes"

        db.add(UserAuditLogs(
            username=username,
            action="capture_download",
            target_resource=record.dataset_name,
            resource_table=record.table_name
        ))

        db.add(Notification(
            username=username,
            title="Dataset Downloaded",
            message=f"You downloaded dataset '{record.dataset_name}' successfully",
            ticket_id=record.request_code,
            type="capture",
            read=False
        ))

        db.commit()

        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={
                "Content-Disposition":
                f"attachment; filename={record.dataset_name}.csv"
            }
        )

    except Exception as e:

        print("CAPTURE DOWNLOAD ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail="Download failed"
        )