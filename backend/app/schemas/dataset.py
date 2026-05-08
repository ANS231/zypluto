from pydantic import BaseModel

class DatasetResponse(BaseModel):
    id: int
    tier: str
    level1: str
    level2: str
    level3: str
    dataset_name: str
    table_name: str

    class Config:
        from_attributes = True