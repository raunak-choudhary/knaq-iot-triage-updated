from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import UserRepository


class AuthService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def get_user_by_token(self, token: str) -> User | None:
        return self.repo.get_by_token(token)
