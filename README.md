# Expense Tracker (Expense_project)

An internal expense management web application consisting of a Django REST API backend and a React + Vite frontend. The project supports user registration with OTP verification, role-based dashboards (Employee / Manager / HoD / Compensator), expense requests, approvals, and payment workflows.

This repository contains both backend and frontend code and includes a Docker Compose configuration to run the full stack locally.

---

## Table of contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture & Ports](#architecture--ports)
- [Quick start — Docker (recommended)](#quick-start--docker-recommended)
- [Local development (manual)](#local-development-manual)
  - [Backend (Django)](#backend-django)
  - [Frontend (React + Vite)](#frontend-react--vite)
- [Configuration / Environment variables](#configuration--environment-variables)
- [API Endpoints (summary)](#api-endpoints-summary)
- [Project structure](#project-structure)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User registration + email OTP verification
- Login and role-based dashboards for Employees, Managers, HoD, and Compensators
- Create expense items and raise expense requests
- Managers/HoDs can approve/reject requests, Compensators can mark as paid
- Email notifications using Sendinblue (Anymail)

## Tech stack

- Backend: Django 5.2, Django REST Framework, djangorestframework-simplejwt
- Database: MySQL (docker-compose) / mysqlclient
- Email: Anymail (Sendinblue)
- Frontend: React 19 + Vite, TailwindCSS, axios
- Dev & deployment: Docker / Docker Compose

## Architecture & Ports

The workspace contains three major services defined in `docker-compose.yaml`:

- MySQL database (db) — port 3306
- Backend (Django) — port 8000
- Frontend (Vite) — port 5173

When running via Docker Compose the backend and frontend are wired together and use the container hostnames in the settings.

## Quick start — Docker (recommended)

Prerequisites: Docker and Docker Compose installed.

From the repository root:

```powershell
# Build and run all services (MySQL, backend, frontend)
docker-compose up --build

# Stop and remove
docker-compose down
```

Notes:

- The Compose file mounts local code into the containers (volumes), running migrations automatically for the backend, and runs the dev server for the frontend.
- Backend: http://localhost:8000
- Frontend (dev): http://localhost:5173

## Local development (manual)

If you prefer not to use Docker, you can run each part manually.

### Backend (Django)

Prereqs: Python (3.11+ recommended), MySQL server or change `DATABASES` to use sqlite for local dev.

```powershell
cd backend

# create and activate virtualenv (Windows PowerShell)
python -m venv .venv
.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt

# configure database connection (see Configuration section)

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

### Frontend (React + Vite)

Prereqs: Node.js (>=18). From repo root:

```powershell
cd frontend/vite-project
npm install
npm run dev

# Build for production
npm run build
npm run preview
```

## Configuration / Environment variables

Sensitive settings should be moved into environment variables in production. The sample values in `backend/backend/settings.py` and `docker-compose.yaml` are for local development only.

Important values to set:

- `SECRET_KEY` — Django secret key
- Database: `NAME`, `USER`, `PASSWORD`, `HOST`, `PORT` (see docker-compose for local development)
- `ANYMAIL` / Sendinblue API key for email: `SENDINBLUE_API_KEY`
- `DEFAULT_FROM_EMAIL` — sender email

Create a `.env` file or set environment variables appropriate to your deployment.

## API Endpoints (summary)

Core API endpoints are defined under `core/urls.py` and are included in the project under both `/api/` and `/auth/`.

Common endpoints (POST unless stated otherwise):

- `POST /api/send-otp/` — register & send OTP (body: username, email, password, phone_number)
- `POST /api/verify-otp/` — verify OTP (body: email, otp)
- `POST /api/login/` — login (body: email, password)
- `POST /api/manager/dashboard/` — manager dashboard (body: email)
- `POST /api/reset-password/` — reset password
- `POST /api/expenses/` — create an expense (multipart for files) + raise request
- `POST /api/expense-history/` — get expense history
- Manager / HoD / Compensator endpoints for viewing/updating requests:
  - `POST /api/manager-other-request/`
  - `POST /api/Hod-other-request/`
  - `POST /api/update_request/`
  - `POST /api/hod_update_request/`
  - `POST /api/Comp-other-request/`
  - `POST /api/Comp_update_request/`

Note: The API is built with Django REST Framework; you can add authentication (JWT) for secure endpoints using `djangorestframework-simplejwt`.

## Project structure (high level)

- backend/ — Django backend project
  - backend/ — Django project folder (settings, urls, wsgi)
  - core/ — application: models, views, serializers, urls, migrations
  - requirements.txt
- frontend/vite-project/ — React + Vite frontend
  - src/ — React components & pages
  - package.json
- docker-compose.yaml — bring up db, backend, frontend

## Testing

Backend tests (Django):

```powershell
cd backend
# run tests
python manage.py test
```

Frontend: add tests using your preferred test framework (Jest / Vitest) — currently not included.

## Contributing

Contributions are welcome. Please open issues for bugs/feature requests and create pull requests for changes. Keep the following in mind:

- Follow the existing coding style
- Add tests for server-side logic when possible
- Do not commit secrets

## License

This project doesn't include a license file in the repository. Add a LICENSE file if you want to mark the project with a specific open source license.

---

If you want, I can additionally:

- Add a .env.example for backend (the settings file uses clear config values now)
- Add an explicit API reference (curl examples) to the README
- Add simple `docker-compose.dev.yml` or production examples

Let me know which extras you'd like and I can add them next.
