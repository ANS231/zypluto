#user\backend\app\services\file_service.py

import os
import shutil
from app.core.config import UPLOAD_BASE_PATH

def save_files(user_type: str, username: str, files: dict):

    if not UPLOAD_BASE_PATH:
        raise ValueError("UPLOAD_BASE_PATH not configured")

    base_path = os.path.abspath(UPLOAD_BASE_PATH)

    user_folder = os.path.join(base_path, user_type, username)
    os.makedirs(user_folder, exist_ok=True)

    for key, file in files.items():
        if not file:
            continue

        filename = os.path.basename(file.filename)  # 🔥 safer
        file_path = os.path.join(user_folder, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)