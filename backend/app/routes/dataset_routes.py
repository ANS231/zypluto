#user\backend\app\routes\dataset_routes.py

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
import csv
import io

from app.core.database import get_db
from app.core.dataset_db import get_dataset_db

from app.models.dataset_registry import DatasetRegistry
from app.models.user_audit_logs import UserAuditLogs
from app.models.dataset_download_history import DatasetDownloadHistory

from app.services.dataset_service import (
    search_datasets,
    preview_dataset,
    download_dataset,
    get_user_tier,
    ACCESS_MAP
)

router = APIRouter(prefix="/api/datasets", tags=["Datasets"])


# ---------------------------
# SEARCH
# ---------------------------
@router.get("/search")
def search(q: str, request: Request, db: Session = Depends(get_db)):

    username = request.session.get("username")

    if not username:
        raise HTTPException(status_code=401)

    return search_datasets(db, q, username)


# ---------------------------
# PREVIEW
# ---------------------------
@router.get("/preview")
def preview(dataset_id: int, request: Request,
            db: Session = Depends(get_db),
            dataset_db: Session = Depends(get_dataset_db)):

    username = request.session.get("username")

    if not username:
        raise HTTPException(status_code=401)

    dataset = db.query(DatasetRegistry).filter(
        DatasetRegistry.id == dataset_id
    ).first()

    if not dataset:
        raise HTTPException(status_code=404)

    user_tier = get_user_tier(username, db)

    if not user_tier:
        raise HTTPException(status_code=403, detail="No subscription")

    dataset_tier = (dataset.tier or "").strip().lower()

    if dataset_tier not in ACCESS_MAP.get(user_tier, []):
        raise HTTPException(status_code=403, detail="Upgrade required")

    data = preview_dataset(dataset_db, dataset.table_name)

    try:
        db.add(DatasetDownloadHistory(
            username=username,
            dataset_id=dataset.id,
            dataset_name=dataset.dataset_name,
            action="preview",
            size_mb=1
        ))

        db.add(UserAuditLogs(
            username=username,
            action="preview",
            target_resource=dataset.dataset_name,
            resource_table=dataset.table_name
        ))

        db.commit()
    except:
        db.rollback()

    return data


# ---------------------------
# DOWNLOAD
# ---------------------------
@router.get("/download")
def download(dataset_id: int, request: Request,
             db: Session = Depends(get_db),
             dataset_db: Session = Depends(get_dataset_db)):

    username = request.session.get("username")

    if not username:
        raise HTTPException(status_code=401)

    dataset = db.query(DatasetRegistry).filter(
        DatasetRegistry.id == dataset_id
    ).first()

    if not dataset:
        raise HTTPException(status_code=404)

    user_tier = get_user_tier(username, db)

    if not user_tier:
        raise HTTPException(status_code=403)

    dataset_tier = (dataset.tier or "").strip().lower()

    if dataset_tier not in ACCESS_MAP.get(user_tier, []):
        raise HTTPException(status_code=403, detail="Upgrade required")

    data = download_dataset(dataset_db, dataset.table_name)

    if not data:
        raise HTTPException(status_code=404)

    size_mb = max(len(data) * 0.001, 1)

    try:
        db.add(DatasetDownloadHistory(
            username=username,
            dataset_id=dataset.id,
            dataset_name=dataset.dataset_name,
            action="download",
            size_mb=int(size_mb)
        ))

        db.add(UserAuditLogs(
            username=username,
            action="download",
            target_resource=dataset.dataset_name,
            resource_table=dataset.table_name
        ))

        db.commit()
    except:
        db.rollback()

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=data[0].keys())
    writer.writeheader()
    writer.writerows(data)
    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={dataset.dataset_name}.csv"
        }
    )

# ---------------------------
# 📜 DOWNLOAD HISTORY
# ---------------------------
@router.get("/history")
def get_history(request: Request, db: Session = Depends(get_db)):

    username = request.session.get("username")

    if not username:
        raise HTTPException(status_code=401)

    history = db.query(DatasetDownloadHistory).filter(
        DatasetDownloadHistory.username == username
    ).order_by(DatasetDownloadHistory.id.desc()).limit(10).all()

    return [
        {
            "dataset_name": h.dataset_name,
            "action": h.action,
            "size_mb": h.size_mb,
            "created_at": h.created_at.strftime("%Y-%m-%d %H:%M")
        }
        for h in history
    ]