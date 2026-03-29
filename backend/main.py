"""
EpiChronos FastAPI backend.
Serves REST API for the React frontend; CORS enabled for http://localhost:5173.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
import models  # noqa: F401 - register User with Base.metadata before create_all
from routes.auth_routes import router as auth_router
from routes.patient_routes import router as patient_router
from routes.predict_routes import router as predict_router

app = FastAPI(title="EpiChronos API", version="1.0.0")

# CORS: allow React dev server to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://epichronos.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    """Create SQLite tables when the application starts."""
    init_db()


# Mount routes
app.include_router(auth_router)  # /auth/register, /auth/login
app.include_router(predict_router)  # /predict
app.include_router(patient_router)  # /patients/history, /patients/report/{id}


@app.get("/")
def root():
    return {"message": "EpiChronos API", "docs": "/docs"}
