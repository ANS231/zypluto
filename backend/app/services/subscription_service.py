#user\backend\app\services\subscription_service.py

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.subscription_plan import SubscriptionPlan
from app.models.subscription_price import SubscriptionPrice
from app.models.user_subscription import UserSubscription
from app.models.enterprise_contract import EnterpriseContract


# =====================================================
# Get Plans By Region
# =====================================================
def get_plans_by_region(region: str, db: Session):

    plans = db.query(SubscriptionPlan).filter(
        SubscriptionPlan.is_active == True
    ).all()

    result = []

    for plan in plans:

        price = db.query(SubscriptionPrice).filter_by(
            subscription_id=plan.id,
            region=region
        ).first()

        if not price:
            price = db.query(SubscriptionPrice).filter_by(
                subscription_id=plan.id,
                region="ROW"
            ).first()

        result.append({
            "id": plan.id,
            "name": plan.name,
            "dataset_category": plan.dataset_category,

            # 🔥 UNIFIED LIMIT
            "total_limit_mb": plan.total_limit_mb,

            "price": float(price.monthly_price) if price else None,
            "currency": price.currency if price else None
        })

    return result


# =====================================================
# Get Current Subscription
# =====================================================
def get_current_subscription(username: str, db: Session):

    now = datetime.utcnow()

    # =============================
    # ENTERPRISE (PRIORITY)
    # =============================
    enterprise = db.query(EnterpriseContract).filter(
        EnterpriseContract.username == username,
        EnterpriseContract.is_active == True
    ).first()

    if enterprise:
        status = "active" if enterprise.expire_date > now else "expired"

        return {
            "plan_name": "Enterprise Plan",
            "subscription_id": 4,
            "expire_date": enterprise.expire_date,
            "status": status,
            "is_enterprise": True,

            # 🔥 UNIFIED LIMIT
            "total_limit_mb": enterprise.total_custom_limit_mb
        }

    # =============================
    # NORMAL SUBSCRIPTION
    # =============================
    subscription = db.query(UserSubscription).filter(
        UserSubscription.username == username,
        UserSubscription.status == "active"
    ).order_by(UserSubscription.id.desc()).first()

    if subscription:

        plan = db.query(SubscriptionPlan).filter(
            SubscriptionPlan.id == subscription.subscription_id
        ).first()

        status = "active" if subscription.expire_date > now else "expired"

        return {
            "plan_name": plan.name if plan else "Unknown Plan",
            "subscription_id": subscription.subscription_id,
            "expire_date": subscription.expire_date,
            "status": status,
            "is_enterprise": False,

            # 🔥 UNIFIED LIMIT
            "total_limit_mb": plan.total_limit_mb if plan else 0
        }

    return None


# =====================================================
# Create / Upgrade Subscription
# =====================================================
def create_or_upgrade_subscription(username: str, plan_id: int, db: Session):

    # ❌ Enterprise cannot upgrade
    enterprise = db.query(EnterpriseContract).filter(
        EnterpriseContract.username == username,
        EnterpriseContract.is_active == True
    ).first()

    if enterprise:
        raise HTTPException(
            status_code=400,
            detail="Enterprise users cannot modify subscription plans"
        )

    if plan_id not in [1, 2, 3]:
        raise HTTPException(
            status_code=400,
            detail="Invalid subscription plan"
        )

    # Remove old active subscription
    db.query(UserSubscription).filter(
        UserSubscription.username == username,
        UserSubscription.status == "active"
    ).delete()

    new_sub = UserSubscription(
        username=username,
        subscription_id=plan_id,
        start_date=datetime.utcnow(),
        expire_date=datetime.utcnow() + timedelta(days=30),
        status="active"
    )

    db.add(new_sub)
    db.commit()

    return new_sub