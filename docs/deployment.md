# Deployment Guide

## Overview
This guide covers local production validation and Railway deployment for Command Centre v2.

## Required Environment Variables

- `DATABASE_URL`
  - Example: `postgresql://postgres:postgres@db:5432/command_centre`
  - Railway will provide this when you attach a PostgreSQL database.

- `NEXT_PUBLIC_BACKEND_URL`
  - Example: `https://<your-backend-service>.up.railway.app`
  - Used by the frontend to call backend APIs.

- `DEMO_PASSWORD`
  - Shared internal access password for the frontend staging gate.
  - Not exposed to the public UI.

## Local Validation Steps

### Backend

1. Install dependencies:
   ```bash
   cd backend
   py -m pip install -r requirements.txt
   ```

2. Start the backend locally:
   ```bash
   set DATABASE_URL=sqlite:///./command_centre.db
   py -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

3. Verify the health endpoint:
   - `http://127.0.0.1:8000/api/health`

### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Build the frontend:
   ```bash
   npm run build
   ```

3. Start the frontend locally with the backend URL:
   ```bash
   set NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   set DEMO_PASSWORD=changeme
   npm run start
   ```

4. Open the app and enter the shared demo password at `/login`.

### Docker

1. Build images:
   ```bash
   docker compose -f infra/docker-compose.yml build --no-cache
   ```

2. Start services:
   ```bash
   docker compose -f infra/docker-compose.yml up -d
   ```

3. Verify backend health and API connectivity:
   - `http://localhost:8000/api/health`
   - `http://localhost:3000`

## Railway Deployment Steps

1. Create a Railway project and connect the GitHub repository.
2. Add services:
   - `backend` service using `backend/Dockerfile`
   - `frontend` service using `frontend/Dockerfile`
   - PostgreSQL database service
3. Set environment variables for each service:
   - Backend:
     - `DATABASE_URL`
     - `DEMO_PASSWORD`
   - Frontend:
     - `NEXT_PUBLIC_BACKEND_URL`
4. Confirm automatic deployment from GitHub on each push.

## Health Checks

- Frontend:
  - Should load and redirect to `/login` when not authenticated
  - Should use `NEXT_PUBLIC_BACKEND_URL` for API requests

- Backend:
  - `GET /api/health` returns `{ "status": "ok" }`
  - `POST /api/upload-csv` accepts CSV uploads

## Notes

- The frontend is protected by a lightweight shared password gate during staging.
- `middleware.ts` enforces the gating page for all UI routes.
- This is intended for internal demo access only, not for production-grade security.
