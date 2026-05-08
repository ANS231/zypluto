#user\backend\app\routes\payment_routes.py

from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.core.database import get_db
from app.models.user_subscription import UserSubscription
from app.models.subscription_addon import SubscriptionAddon
from app.models.enterprise_contract import EnterpriseContract
from app.models.addon_settings import AddonSettings
from app.models.admin_audit_logs import AdminAuditLogs
from app.models.addon_purchases import AddonPurchase
from app.models.user_audit_logs import UserAuditLogs
from app.models.user_usage_tracking import UserUsageTracking
from app.models.personal_user import PersonalUser
from app.models.company_user import CompanyUser

router = APIRouter(prefix="/api/payment", tags=["Payment"])


# 🔥 HELPER → GET USER REGION
def get_user_region(username, db):
    user = db.query(PersonalUser).filter(
        PersonalUser.username == username
    ).first()

    if user and hasattr(user, "region"):
        return user.region

    company = db.query(CompanyUser).filter(
        CompanyUser.username == username
    ).first()

    if company and hasattr(company, "region"):
        return company.region

    return "INDIA"  # fallback


@router.post("/success")
def payment_success(
    request: Request,
    payment_type: str,
    plan_id: int = None,
    addon_type: str = None,
    gb: int = None,
    db: Session = Depends(get_db)
):

    username = request.session.get("username")

    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")

    now = datetime.utcnow()

    try:

        # =====================================
        # 🔵 SUBSCRIPTION PURCHASE
        # =====================================
        if payment_type == "subscription":

            if not plan_id:
                raise HTTPException(status_code=400, detail="Plan ID required")

            db.query(UserSubscription).filter(
                UserSubscription.username == username
            ).delete()

            db.add(UserSubscription(
                username=username,
                subscription_id=plan_id,
                start_date=now,
                expire_date=now + timedelta(days=30),
                status="active"
            ))

            db.add(AdminAuditLogs(
                admin_username="system",
                action="SUBSCRIPTION_PURCHASE",
                target_username=username,
                target_table="user_subscriptions"
            ))

            db.add(UserAuditLogs(
                username=username,
                action="PURCHASE_SUBSCRIPTION",
                target_resource=f"plan_id={plan_id}",
                resource_table="user_subscriptions"
            ))

            db.commit()

            return {"message": "Subscription activated"}

        # =====================================
        # 🟢 ADDON PURCHASE
        # =====================================
        elif payment_type == "addon":

            if not addon_type or not gb:
                raise HTTPException(status_code=400, detail="addon_type & gb required")

            # 🚫 BLOCK ENTERPRISE
            enterprise = db.query(EnterpriseContract).filter(
                EnterpriseContract.username == username,
                EnterpriseContract.is_active == True
            ).first()

            if enterprise:
                raise HTTPException(
                    status_code=400,
                    detail="Addon not allowed for Enterprise users"
                )

            # 🔥 GET REGION
            region = get_user_region(username, db)

            # 🔥 FETCH CONFIG
            setting = db.query(AddonSettings).filter(
                AddonSettings.addon_type == addon_type,
                AddonSettings.region == region,
                AddonSettings.is_active == True
            ).first()

            if not setting:
                raise HTTPException(status_code=400, detail="Invalid addon config")

            # 🔥 CALCULATION
            total_mb = gb * 1000
            base_mb = setting.addon_value
            base_price = float(setting.price)

            units = (total_mb + base_mb - 1) // base_mb
            total_price = units * base_price

            month = now.strftime("%Y-%m")

            # ✅ subscription_addons
            db.add(SubscriptionAddon(
                username=username,
                month_year=month,
                extra_download_mb=total_mb,
                amount=total_price,
                currency=setting.currency
            ))

            # ✅ addon_purchases
            db.add(AddonPurchase(
                username=username,
                addon_type=addon_type,
                addon_value=total_mb,
                price=total_price,
                currency=setting.currency
            ))

            # ✅ user_usage_tracking
            usage = db.query(UserUsageTracking).filter(
                UserUsageTracking.username == username
            ).first()

            if usage:
                usage.total_download_mb += total_mb
            else:
                db.add(UserUsageTracking(
                    username=username,
                    total_download_mb=total_mb,
                    api_calls_used=0
                ))

            # ✅ logs
            db.add(AdminAuditLogs(
                admin_username="system",
                action="ADDON_PURCHASE",
                target_username=username,
                target_table="subscription_addons"
            ))

            db.add(UserAuditLogs(
                username=username,
                action="PURCHASE_ADDON",
                target_resource=f"{gb}GB",
                resource_table="subscription_addons"
            ))

            db.commit()

            return {
                "message": "Addon purchased successfully",
                "gb": gb,
                "total_price": total_price
            }

        else:
            raise HTTPException(status_code=400, detail="Invalid payment type")

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))