#user\backend\app\routes\support_routes.py

from fastapi import APIRouter, Depends, Request, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
import os

from app.core.database import get_db
from app.core.config import SUPPORT_FILE_PATH
from app.models.support_ticket import SupportTicket
from app.models.support_message import SupportMessage
from app.models.notification import Notification
from app.services.support_service import create_ticket, add_message

router = APIRouter(prefix="/api", tags=["Support"])


# ============================
# CREATE TICKET
# ============================

@router.post("/support/create")
async def create_support_ticket(
    request: Request,
    subject: str = Form(...),
    category: str = Form(...),
    message: str = Form(...),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
):

    username = request.session.get("username")

    if not username:
        raise HTTPException(status_code=401, detail="User not logged in")

    data = {
        "username": username,
        "subject": subject,
        "category": category,
        "message": message,
        "user_type": "user"
    }

    ticket = create_ticket(db, data)

    attachment_path = None

    if file:
        folder = os.path.join(SUPPORT_FILE_PATH, "user", ticket.ticket_id)
        os.makedirs(folder, exist_ok=True)

        file_path = os.path.join(folder, file.filename)

        with open(file_path, "wb") as f:
            f.write(await file.read())

        attachment_path = file_path

    add_message(db, ticket.ticket_id, "user", message, attachment_path)

    return {"ticket_id": ticket.ticket_id}


# ============================
# GET USER TICKETS
# ============================

@router.get("/support/my-tickets")
def get_my_tickets(request: Request, db: Session = Depends(get_db)):

    username = request.session.get("username")

    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")

    return db.query(SupportTicket).filter(
        SupportTicket.username == username
    ).order_by(SupportTicket.created_at.desc()).all()


# ============================
# GET MESSAGES
# ============================

@router.get("/support/messages/{ticket_id}")
def get_messages(ticket_id: str, db: Session = Depends(get_db)):

    return db.query(SupportMessage).filter(
        SupportMessage.ticket_id == ticket_id
    ).order_by(SupportMessage.created_at.asc()).all()


# ============================
# REPLY
# ============================

@router.post("/support/reply")
async def reply_ticket(
    request: Request,
    ticket_id: str = Form(...),
    message: str = Form(...),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):

    username = request.session.get("username")

    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")

    ticket = db.query(SupportTicket).filter(
        SupportTicket.ticket_id == ticket_id
    ).first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if ticket.status == "closed":
        raise HTTPException(status_code=400, detail="Ticket already closed")

    attachment = None

    if file:
        folder = os.path.join(SUPPORT_FILE_PATH, ticket.user_type, ticket.ticket_id)
        os.makedirs(folder, exist_ok=True)

        file_path = os.path.join(folder, file.filename)

        with open(file_path, "wb") as f:
            f.write(await file.read())

        attachment = file_path

    add_message(db, ticket_id, "user", message, attachment)

    db.add(Notification(
        username="admin",
        message=f"{username} replied to ticket {ticket_id}"
    ))

    db.commit()

    return {"message": "reply added"}