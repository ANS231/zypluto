#user\backend\app\routes\usage_routes.py

from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.user_subscription import UserSubscription
from app.models.subscription_plan import SubscriptionPlan
from app.models.subscription_addon import SubscriptionAddon
from app.models.user_usage_tracking import UserUsageTracking
from app.models.enterprise_contract import EnterpriseContract


def get_active_subscription(username, db):
    return db.query(UserSubscription).filter(
        UserSubscription.username == username,
        UserSubscription.status == "active"
    ).order_by(UserSubscription.id.desc()).first()


def get_or_create_usage(username: str, db: Session):

    month = datetime.utcnow().strftime("%Y-%m")

    usage = db.query(UserUsageTracking).filter_by(
        username=username,
        month_year=month
    ).first()

    if not usage:
        usage = UserUsageTracking(
            username=username,
            month_year=month,
            download_used_mb=0,
            api_used=0,
            addon_mb=0,
            plan_limit_mb=0,
            total_limit_mb=0,
            remaining_mb=0,
            status="OK"
        )
        db.add(usage)
        db.commit()

    return usage


def calculate_total_limit(username: str, db: Session):

    now = datetime.utcnow()
    month = now.strftime("%Y-%m")

    enterprise = db.query(EnterpriseContract).filter(
        EnterpriseContract.username == username,
        EnterpriseContract.is_active == True
    ).first()

    if enterprise and enterprise.expire_date > now:
        return enterprise.total_limit_mb or 0

    sub = get_active_subscription(username, db)

    if not sub or sub.expire_date <= now:
        return 0

    plan = db.query(SubscriptionPlan).filter(
        SubscriptionPlan.id == sub.subscription_id
    ).first()

    plan_limit = plan.total_limit_mb or 0

    addons = db.query(SubscriptionAddon).filter(
        SubscriptionAddon.username == username,
        SubscriptionAddon.month_year == month
    ).all()

    addon_total = sum(a.extra_mb for a in addons)

    return plan_limit + addon_total


def check_and_consume(username: str, required_mb: int, usage_type: str, db: Session):

    usage = get_or_create_usage(username, db)

    total_limit = calculate_total_limit(username, db)

    total_used = (usage.download_used_mb or 0) + (usage.api_used or 0)

    remaining = total_limit - total_used

    if remaining < required_mb:
        raise HTTPException(
            status_code=403,
            detail="No data balance left. Please purchase addon."
        )

    if usage_type == "download":
        usage.download_used_mb = (usage.download_used_mb or 0) + required_mb
    else:
        usage.api_used = (usage.api_used or 0) + required_mb

    usage.total_limit_mb = total_limit
    usage.remaining_mb = total_limit - (
        usage.download_used_mb + usage.api_used
    )

    db.commit()