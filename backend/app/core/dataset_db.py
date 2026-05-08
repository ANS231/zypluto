from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import DATASET_DATABASE_URL

engine = create_engine(DATASET_DATABASE_URL)

SessionLocalDataset = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_dataset_db():
    db = SessionLocalDataset()
    try:
        yield db
    finally:
        db.close()