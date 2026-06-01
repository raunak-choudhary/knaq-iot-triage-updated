from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.exceptions import AuthError
from app.models.user import User
from app.services.auth_service import AuthService

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise AuthError(detail="Authorization header missing.")
    token = credentials.credentials
    auth_service = AuthService(db)
    user = auth_service.get_user_by_token(token)
    if user is None:
        raise AuthError(detail="Invalid or expired token.")
    return user
