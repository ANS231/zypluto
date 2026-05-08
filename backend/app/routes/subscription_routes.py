#user\backend\app\routes\subscription_routes.py

from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.subscription_service import (
    get_plans_by_region,
    get_current_subscription,
    create_or_upgrade_subscription
)

router = APIRouter(prefix="/api/subscription", tags=["Subscription"])


@router.get("/plans")
def get_plans(region: str, db: Session = Depends(get_db)):
    return get_plans_by_region(region, db)


@router.get("/current")
def current_subscription(request: Request, db: Session = Depends(get_db)):

    username = request.session.get("username")

    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")

    return get_current_subscription(username, db)


@router.post("/upgrade")
def upgrade_subscription(plan_id: int, request: Request, db: Session = Depends(get_db)):

    username = request.session.get("username")

    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")

    return create_or_upgrade_subscription(username, plan_id, db)