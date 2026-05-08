#user\backend\app\routes\company_routes.py

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.company_user import CompanyUser
from app.models.personal_user import PersonalUser
from app.core.security import hash_password
#from app.services.file_service import save_files

router = APIRouter(prefix="/api/company", tags=["Company"])


@router.post("/signup")
def company_signup(
    company_name: str = Form(...),
    address: str = Form(...),
    email: str = Form(...),
    username: str = Form(...),
    password: str = Form(...),
    reenter_password: str = Form(...),
    #mou: UploadFile = File(...),
    #director_national_id: UploadFile = File(...),
    #director_live_photo: UploadFile = File(...),
    #address_proof: UploadFile = File(...),
    region: str = Form(...),
    db: Session = Depends(get_db)
):

    if password != reenter_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    if db.query(PersonalUser).filter_by(username=username).first() or \
       db.query(CompanyUser).filter_by(username=username).first():
        raise HTTPException(status_code=400, detail="Username already exists")

    if db.query(CompanyUser).filter_by(email=email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    try:
        user = CompanyUser(
            company_name=company_name,
            address=address,
            email=email,
            username=username,
            password_hash=hash_password(password),
            region=region,
            status="pending"
        )

        db.add(user)

        # Save files first
        #save_files("company_user", username, {
         #   "mou": mou,
          #  "director_national_id": director_national_id,
           # "director_live_photo": director_live_photo,
            #"address_proof": address_proof
       # })

        db.commit()

        return {"message": "Company signup submitted for approval"}

    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Signup failed")