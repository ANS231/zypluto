#user\backend\app\routes\personal_routes.py

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.personal_user import PersonalUser
from app.models.company_user import CompanyUser
from app.core.security import hash_password
#from app.services.file_service import save_files

router = APIRouter(prefix="/api/personal", tags=["Personal"])


@router.post("/signup")
def personal_signup(
    full_name: str = Form(...),
    address: str = Form(...),
    username: str = Form(...),
    password: str = Form(...),
    reenter_password: str = Form(...),
    #national_id: UploadFile = File(...),
    #live_photo: UploadFile = File(...),
    #address_proof: UploadFile = File(...),
    region: str = Form(...),
    db: Session = Depends(get_db)
):

    if password != reenter_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    if db.query(PersonalUser).filter_by(username=username).first() or \
       db.query(CompanyUser).filter_by(username=username).first():
        raise HTTPException(status_code=400, detail="Username already exists")

    try:
        user = PersonalUser(
            full_name=full_name,
            address=address,
            username=username,
            password_hash=hash_password(password),
            region=region,
            status="pending"
        )

        db.add(user)

        # Save files first
     #   save_files("personal_user", username, {
      #      "national_id": national_id,
       #     "live_photo": live_photo,
        #    "address_proof": address_proof
        #})

        db.commit()

        return {"message": "Personal signup submitted for approval"}

    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Signup failed")