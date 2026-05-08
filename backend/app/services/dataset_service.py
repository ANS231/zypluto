#user\backend\app\services\dataset_service.py

from sqlalchemy.orm import Session
from sqlalchemy import text, or_
from datetime import datetime

from app.models.dataset_registry import DatasetRegistry
from app.models.user_subscription import UserSubscription
from app.models.enterprise_contract import EnterpriseContract
from app.models.user_audit_logs import UserAuditLogs


# -------------------------------
# 🔥 PLAN → TIER MAP (CRITICAL FIX)
# -------------------------------
PLAN_TIER_MAP = {
    1: "starter",
    2: "professional",
    3: "expert",
    4: "enterprise"
}


# -------------------------------
# 🔥 ACCESS CONTROL
# -------------------------------
ACCESS_MAP = {
    "starter": ["starter"],
    "professional": ["starter", "professional"],
    "expert": ["starter", "professional", "expert"],
    "enterprise": ["starter", "professional", "expert", "enterprise"]
}


# -------------------------------
# 🔍 GET USER TIER
# -------------------------------
def get_user_tier(username: str, db: Session):

    now = datetime.utcnow()

    # 🔥 ENTERPRISE FIRST
    enterprise = db.query(EnterpriseContract).filter(
        EnterpriseContract.username == username,
        EnterpriseContract.is_active == True
    ).first()

    if enterprise and enterprise.expire_date > now:
        return "enterprise"

    sub = db.query(UserSubscription).filter(
        UserSubscription.username == username,
        UserSubscription.status == "active"
    ).order_by(UserSubscription.id.desc()).first()

    if not sub or sub.expire_date <= now:
        return None

    return PLAN_TIER_MAP.get(sub.subscription_id)


# -------------------------------
# 🔍 SEARCH DATASETS (FINAL FIX)
# -------------------------------
def search_datasets(db: Session, query: str, username: str):

    user_tier = get_user_tier(username, db)

    datasets = db.query(DatasetRegistry).filter(
        or_(
            DatasetRegistry.level1.ilike(f"%{query}%"),
            DatasetRegistry.level2.ilike(f"%{query}%"),
            DatasetRegistry.level3.ilike(f"%{query}%"),
            DatasetRegistry.dataset_name.ilike(f"%{query}%")
        )
    ).distinct().all()

    if not datasets:
        return []

    results = []

    for d in datasets:

        dataset_tier = (d.tier or "").strip().lower()

        if not user_tier:
            is_locked = True
        else:
            allowed = ACCESS_MAP.get(user_tier, [])
            is_locked = dataset_tier not in allowed

        results.append({
            "id": d.id,
            "dataset_name": d.dataset_name,
            "is_locked": is_locked
        })

    # 🔥 SAFE AUDIT LOG (NO CRASH)
    try:
        db.add(UserAuditLogs(
            username=username,
            action="search",
            target_resource=query,
            resource_table="dataset_registry"
        ))
        db.commit()
    except:
        db.rollback()

    return results


# -------------------------------
# SAFE QUERY
# -------------------------------
def build_query(table_name: str, limit: int = None):

    if "." in table_name:
        schema, table = table_name.split(".", 1)

        if limit:
            return text(f'SELECT * FROM "{schema}"."{table}" LIMIT {limit}')
        return text(f'SELECT * FROM "{schema}"."{table}"')

    if limit:
        return text(f'SELECT * FROM "{table_name}" LIMIT {limit}')
    return text(f'SELECT * FROM "{table_name}"')


# -------------------------------
# 👁️ PREVIEW
# -------------------------------
def preview_dataset(dataset_db: Session, table_name: str):

    query = build_query(table_name, 3)

    result = dataset_db.execute(query)
    rows = result.fetchall()

    if not rows:
        return []

    columns = result.keys()
    return [dict(zip(columns, row)) for row in rows]


# -------------------------------
# ⬇️ DOWNLOAD
# -------------------------------
def download_dataset(dataset_db: Session, table_name: str):

    query = build_query(table_name)

    result = dataset_db.execute(query)
    rows = result.fetchall()

    if not rows:
        return []

    columns = result.keys()
    return [dict(zip(columns, row)) for row in rows]