#user\backend\app\routes\addon_routes.py

from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.database import get_db
from app.models.subscription_addon import SubscriptionAddon
from app.models.user_subscription import UserSubscription
from app.models.enterprise_contract import EnterpriseContract
from app.models.addon_settings import AddonSettings

router = APIRouter(
    prefix="/api/addon",
    tags=["Addon"]
)

# --------------------------------
# Get Active Subscription
# --------------------------------
def get_active_subscription(username, db):
    return db.query(UserSubscription).filter(
        UserSubscription.username == username,
        UserSubscription.status == "active"
    ).order_by(UserSubscription.id.desc()).first()


# --------------------------------
# GET ADDON SETTINGS (FIXED)
# --------------------------------
@router.get("/settings")
def get_addon_settings(region: str = "INDIA", db: Session = Depends(get_db)):

    # ✅ Try exact region
    settings = db.query(AddonSettings).filter(
        AddonSettings.region == region,
        AddonSettings.is_active == True
    ).all()

    # 🔥 Fallback to USA (USD) if not found
    if not settings:
        settings = db.query(AddonSettings).filter(
            AddonSettings.region == "USA",
            AddonSettings.is_active == True
        ).all()

    return [
        {
            "id": s.id,
            "addon_type": s.addon_type,
            "price": float(s.price),
            "currency": s.currency,
            "value": s.addon_value   # ✅ STANDARD FIELD
        }
        for s in settings
    ]


# --------------------------------
# PURCHASE ADDON (CLEAN FIX)
# --------------------------------
@router.post("/purchase")
def purchase_addon(
    addon_id: int,
    request: Request,
    db: Session = Depends(get_db)
):

    username = request.session.get("username")

    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")

    now = datetime.utcnow()
    month = now.strftime("%Y-%m")

    # 🚫 Block enterprise
    enterprise = db.query(EnterpriseContract).filter(
        EnterpriseContract.username == username,
        EnterpriseContract.is_active == True
    ).first()

    if enterprise:
        raise HTTPException(
            status_code=400,
            detail="Addon not allowed for Enterprise users"
        )

    # ✅ Check subscription
    sub = get_active_subscription(username, db)

    if not sub:
        raise HTTPException(status_code=403, detail="No active subscription")

    if sub.expire_date <= now:
        raise HTTPException(status_code=403, detail="Subscription expired")

    # 🔥 Fetch addon config
    setting = db.query(AddonSettings).filter(
        AddonSettings.id == addon_id,
        AddonSettings.is_active == True
    ).first()

    if not setting:
        raise HTTPException(status_code=400, detail="Invalid addon")

    # 💾 Save addon
    addon = SubscriptionAddon(
        username=username,
        month_year=month,
        extra_mb=setting.addon_value if setting.addon_type == "download" else 0,
        amount=setting.price,
        currency=setting.currency
    )

    db.add(addon)
    db.commit()

    return {
        "message": "Addon purchased successfully",
        "addon_id": setting.id,
        "type": setting.addon_type,
        "value": setting.addon_value,  # ✅ FIXED
        "amount": float(setting.price),
        "currency": setting.currency
    }