#user\backend\app\routes\notification_routes.py

from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.notification import Notification

router = APIRouter(prefix="/api", tags=["Notification"])


@router.get("/notifications")
def get_notifications(request: Request, db: Session = Depends(get_db)):
    username = request.session.get("username")

    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")

    notifications = db.query(Notification).filter(
        Notification.username == username
    ).order_by(Notification.created_at.desc()).all()

    return notifications


@router.post("/notifications/read/{id}")
def mark_notification(id: int, request: Request, db: Session = Depends(get_db)):
    username = request.session.get("username")

    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")

    notif = db.query(Notification).filter(
        Notification.id == id,
        Notification.username == username
    ).first()

    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    notif.read = True
    db.commit()

    return {"message": "updated"}