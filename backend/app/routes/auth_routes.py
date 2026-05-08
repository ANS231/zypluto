#user\backend\app\routes\auth_routes.py

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.core.config import AUTH_MODE
from app.models.personal_user import PersonalUser
from app.models.company_user import CompanyUser

router = APIRouter(tags=["Authentication"])


# =========================
# REQUEST MODEL
# =========================
class LoginRequest(BaseModel):
    username: str
    password: str


# =========================
# LOGIN
# =========================
@router.post("/api/login")
def login(data: LoginRequest, request: Request, db: Session = Depends(get_db)):

    username = data.username
    password = data.password

    role = None
    user = None

    # 🔎 Check personal user
    personal = db.query(PersonalUser).filter(
        PersonalUser.username == username
    ).first()

    if personal:
        user = personal
        role = "personal"
    else:
        company = db.query(CompanyUser).filter(
            CompanyUser.username == username
        ).first()

        if company:
            user = company
            role = "company"

    # =========================
    # DEBUG LOGS
    # =========================
    print("========== LOGIN DEBUG ==========")
    print("USERNAME:", username)
    print("USER FOUND:", user)

    if user:
        print("DB HASH:", user.password_hash)
        print("PASSWORD MATCH:", verify_password(password, user.password_hash))
        print("USER STATUS:", user.status)
    else:
        print("USER NOT FOUND IN DB")

    print("================================")

    # ❌ Invalid credentials
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # 🚫 BLOCK IF NOT APPROVED
    if user.status != "approved":
        raise HTTPException(
            status_code=403,
            detail=f"Your account is {user.status}. Please wait for admin approval."
        )

    # =========================
    # SESSION MODE
    # =========================
    if AUTH_MODE == "session":

        request.session.clear()   # 🔥 clear old session

        request.session["username"] = user.username
        request.session["role"] = role

        # 🔥 SAFETY: region may not exist
        request.session["region"] = getattr(user, "region", "INDIA")

        print("SESSION SET:", dict(request.session))

        return {
            "token": None,
            "role": role,
            "status": user.status
        }

    # =========================
    # JWT MODE
    # =========================
    elif AUTH_MODE == "jwt":

        token = create_access_token(
            data={"sub": user.username, "role": role}
        )

        return {
            "token": token,
            "role": role,
            "status": user.status
        }

    raise HTTPException(status_code=500, detail="Invalid AUTH_MODE configuration")


# =========================
# LOGOUT (🔥 NEW - CRITICAL)
# =========================
@router.post("/api/logout")
def logout(request: Request):

    print("LOGOUT CALLED")

    # 🔥 THIS FIXES YOUR ISSUE
    request.session.clear()

    return {"message": "Logged out successfully"}


# =========================
# CURRENT USER (OPTIONAL BUT USEFUL)
# =========================
@router.get("/api/me")
def get_current_user(request: Request):

    username = request.session.get("username")
    role = request.session.get("role")

    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")

    return {
        "username": username,
        "role": role
    }