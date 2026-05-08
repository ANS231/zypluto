#user\backend\app\routes\user_profile.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.personal_user import PersonalUser
from app.schemas.personal_user import PersonalUserProfile
from app.core.security import get_current_username

router = APIRouter(prefix="/user", tags=["User"])


@router.get("/profile", response_model=PersonalUserProfile)
def get_user_profile(
    username: str = Depends(get_current_username),
    db: Session = Depends(get_db)
):
    """
    Fetch logged-in personal user profile.
    Works with both session and JWT auth modes.
    """

    user = db.query(PersonalUser).filter(
        PersonalUser.username == username
    ).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user