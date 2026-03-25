"""
Auth API routes: register and login.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas.auth_schema import (
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserResponse,
)
from utils import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=RegisterResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new user.
    - Reject if email already exists.
    - Hash password with passlib (bcrypt), store user, return JWT + user so frontend can stay logged in.
    """
    # Check if email already exists
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    # Hash password and create user
    hashed = hash_password(data.password)
    user = User(
        name=data.name.strip(),
        email=data.email.lower().strip(),
        hashed_password=hashed,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    # Return same shape as login: token + user (frontend stores in localStorage)
    token = create_access_token(data={"user_id": user.id, "email": user.email})
    return RegisterResponse(
        token=token,
        user=UserResponse(name=user.name, email=user.email),
    )


@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    """
    Login with email and password.
    - Verify user exists and password matches.
    - Return JWT token and user (name, email) for frontend.
    """
    user = db.query(User).filter(User.email == data.email.lower().strip()).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    token = create_access_token(data={"user_id": user.id, "email": user.email})
    return LoginResponse(
        token=token,
        user=UserResponse(name=user.name, email=user.email),
    )
