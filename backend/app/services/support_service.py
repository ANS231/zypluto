#user\backend\app\services\support_service.py

import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.support_ticket import SupportTicket
from app.models.support_message import SupportMessage
from app.models.support_priority import SupportPriority
from app.models.notification import Notification


# ============================
# GENERATE TICKET ID
# ============================

def generate_ticket_id():

    date = datetime.utcnow().strftime("%Y%m%d")

    uid = str(uuid.uuid4())[:6].upper()

    return f"TKT-{date}-{uid}"


# ============================
# CREATE TICKET
# ============================

def create_ticket(db: Session, data: dict):

    ticket_id = generate_ticket_id()

    priority = "Medium"

    pr = db.query(SupportPriority).filter(
        SupportPriority.priority_name == priority
    ).first()

    sla_deadline = None

    if pr:
        sla_deadline = datetime.utcnow() + timedelta(hours=pr.sla_hours)

    ticket = SupportTicket(
        ticket_id=ticket_id,
        username=data.get("username"),
        user_type=data.get("user_type"),
        name=data.get("name"),
        email=data.get("email"),
        subject=data.get("subject"),
        category=data.get("category"),
        priority=priority,
        status="open",
        sla_deadline=sla_deadline,
        created_at=datetime.utcnow()
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return ticket


# ============================
# ADD MESSAGE
# ============================

def add_message(
    db: Session,
    ticket_id: str,
    sender_type: str,
    message: str = None,
    attachment_path=None
):

    ticket = db.query(SupportTicket).filter(
        SupportTicket.ticket_id == ticket_id
    ).first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    # 🚫 Block reply if ticket closed
    if ticket.status == "closed":
        raise HTTPException(status_code=400, detail="Ticket already closed")

    msg = SupportMessage(
        ticket_id=ticket_id,
        sender_type=sender_type,
        message=message,
        attachment_path=attachment_path,
        created_at=datetime.utcnow()
    )

    db.add(msg)

    # ============================
    # NOTIFY ADMIN
    # ============================

    if sender_type == "user":

        notif = Notification(
            username="admin",
            message=f"{ticket.username} replied to ticket {ticket_id}",
            read=False
        )

        db.add(notif)

    db.commit()

    return msg