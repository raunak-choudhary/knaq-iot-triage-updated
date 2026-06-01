from typing import TypeVar

from sqlalchemy.orm import Session

from app.database import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository:
    def __init__(self, db: Session):
        self.db = db
