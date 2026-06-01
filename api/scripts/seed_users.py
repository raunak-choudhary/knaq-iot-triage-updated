import uuid

import structlog

from app.database import SessionLocal, get_db
from app.models.user import User
from sqlalchemy.orm import Session

logger = structlog.get_logger()

SEED_USERS = [
    {
        "token": "token-alice-brookfield",
        "name": "Alice Chen",
        "role": "Building Manager",
        "company": "Brookfield Properties",
    },
    {
        "token": "token-bob-brookfield",
        "name": "Bob Martinez",
        "role": "Technician",
        "company": "Brookfield Properties",
    },
    {
        "token": "token-carol-hines",
        "name": "Carol Kim",
        "role": "Building Manager",
        "company": "Hines",
    },
    {
        "token": "token-dave-hines",
        "name": "Dave Okafor",
        "role": "Technician",
        "company": "Hines",
    },
    {
        "token": "token-eve-mitsui",
        "name": "Eve Tanaka",
        "role": "Building Manager",
        "company": "Mitsui Fudosan",
    },
    {
        "token": "token-frank-mitsui",
        "name": "Frank Sato",
        "role": "Technician",
        "company": "Mitsui Fudosan",
    },
]


def seed_users(db: Session) -> None:
    for data in SEED_USERS:
        existing = db.query(User).filter(User.token == data["token"]).first()
        if existing is None:
            user = User(
                id=uuid.uuid4().hex,
                name=data["name"],
                role=data["role"],
                company=data["company"],
                token=data["token"],
            )
            db.add(user)
            logger.info("seeded_user", name=data["name"], company=data["company"])
    db.commit()


if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_users(db)
    finally:
        db.close()
