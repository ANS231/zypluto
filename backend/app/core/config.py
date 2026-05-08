#user\backend\app\core\config.py

from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
UPLOAD_BASE_PATH = os.getenv("UPLOAD_BASE_PATH")
SUPPORT_FILE_PATH = os.getenv("SUPPORT_FILE_PATH")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")

AUTH_MODE = os.getenv("AUTH_MODE", "session")


DATASET_DATABASE_URL = os.getenv("DATASET_DATABASE_URL")
