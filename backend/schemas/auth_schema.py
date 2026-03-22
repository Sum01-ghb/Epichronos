"""
Pydantic schemas for authentication (register/login).
"""

from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
  """POST /auth/register body."""

  name: str
  email: EmailStr
  password: str


class LoginRequest(BaseModel):
  """POST /auth/login body."""

  email: EmailStr
  password: str


class UserResponse(BaseModel):
  """User info returned to frontend (name, email for avatar/display)."""

  name: str
  email: str

  class Config:
    from_attributes = True


class LoginResponse(BaseModel):
  """Response for login and register: token + user."""

  token: str
  user: UserResponse


class RegisterResponse(BaseModel):
  """Same shape as login so frontend can auto-login after register."""

  token: str
  user: UserResponse

