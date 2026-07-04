from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.base import get_db
from app.models.user import User, UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)


def get_current_user(
    token: str | None = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
    )
    if not token:
        raise credentials_error

    user_id = decode_access_token(token)
    if not user_id:
        raise credentials_error

    user = db.get(User, user_id)
    if not user or not user.is_active:
        raise credentials_error
    return user


def get_optional_user(
    token: str | None = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User | None:
    """For endpoints that behave differently for logged-in users but don't require auth."""
    if not token:
        return None
    user_id = decode_access_token(token)
    if not user_id:
        return None
    return db.get(User, user_id)


def require_moderator(user: User = Depends(get_current_user)) -> User:
    if user.role not in (UserRole.MODERATOR, UserRole.ADMIN):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Moderator access required")
    return user


def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return user
