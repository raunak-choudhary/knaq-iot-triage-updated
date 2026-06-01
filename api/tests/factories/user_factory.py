import uuid

from sqlalchemy.orm import Session

from app.models.user import User


def make_user(
    db: Session,
    name: str = "Test User",
    role: str = "Building Manager",
    company: str = "Brookfield Properties",
    token: str | None = None,
) -> User:
    if token is None:
        token = f"token-{uuid.uuid4().hex[:8]}"
    user = User(
        id=uuid.uuid4().hex,
        name=name,
        role=role,
        company=company,
        token=token,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
