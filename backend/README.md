# EpiChronos Backend

FastAPI backend for user authentication. Uses SQLite, JWT (python-jose), and passlib (bcrypt).

## Setup

From the `backend` directory:

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate   # Linux/macOS
pip install -r requirements.txt
```

## Run the server

From the `backend` directory:

```bash
uvicorn main:app --reload
```

- API: http://localhost:8000  
- Docs: http://localhost:8000/docs  

## Frontend integration

In the React app (frontend), set the API base URL so auth requests go to this backend:

- Create `frontend/.env` with:
  ```
  VITE_API_URL=http://localhost:8000
  ```
- Then `POST /auth/register` and `POST /auth/login` will hit http://localhost:8000.

## Endpoints

- **POST /auth/register** — Body: `{ "name", "email", "password" }` → returns `{ "token", "user": { "name", "email" } }`
- **POST /auth/login** — Body: `{ "email", "password" }` → returns `{ "token", "user": { "name", "email" } }`

Database file: `backend/epichronos.db` (created on first run).
