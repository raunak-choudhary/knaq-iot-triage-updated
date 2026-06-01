from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(db)

    def get_by_token(self, token: str) -> User | None:
        return self.db.query(User).filter(User.token == token).first()

    def get_by_id_and_company(self, user_id: str, company: str) -> User | None:
        return (
            self.db.query(User)
            .filter(User.id == user_id, User.company == company)
            .first()
        )

    def list_by_company(self, company: str) -> list[User]:
        return self.db.query(User).filter(User.company == company).all()
