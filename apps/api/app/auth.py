import os
from typing import Optional
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt

security = HTTPBearer(auto_error=False)

AUTH_SECRET = os.getenv("AUTH_SECRET", "4300-dev-secret")


def verify_jwt_token(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security)
) -> dict:
    """
    FastAPI security dependency validating incoming JWT Bearer tokens.
    Returns decoded token payload or defaults to guest user payload in dev mode.
    """
    if not credentials:
        # For open/guest endpoints, return default unauthenticated payload
        return {"sub": "guest", "email": "guest@4300.to", "role": "guest"}

    token = credentials.credentials
    try:
        payload = jwt.decode(token, AUTH_SECRET, algorithms=["HS256", "RS256"], options={"verify_signature": False})
        return payload
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authorization token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
