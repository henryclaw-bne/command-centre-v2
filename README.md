# Command Centre v2

A modern ticket management and operational intelligence platform built with FastAPI, Next.js, and SQLite.

## Architecture

- **Backend**: FastAPI with SQLModel (SQLAlchemy + Pydantic) for data modeling and API endpoints
- **Frontend**: Next.js 14 with TypeScript for the user interface
- **Database**: SQLite for local development, PostgreSQL for production
- **Deployment**: Railway for easy cloud deployment

## Features

- Ticket ingestion via CSV upload
- Customer management and timeline tracking
- Operational metrics dashboard
- SLA monitoring and alerts
- Responsive web interface

## Local Development Setup

### Prerequisites

- Python 3.8+
- Node.js 18+
- Git

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the backend server:
   ```bash
   py -m uvicorn app.main:app --reload
   ```

   The backend will be available at http://127.0.0.1:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at http://localhost:3000 (or next available port)

### Database

The application uses SQLite by default for local development. The database file `command_centre.db` will be created automatically when the backend starts.

## Railway Deployment

1. Create a new project on Railway
2. Connect your GitHub repository
3. Add environment variables:
   - `DATABASE_URL`: PostgreSQL connection string (Railway provides this automatically)
   - `NEXT_PUBLIC_BACKEND_URL`: Your Railway backend URL
   - `DEMO_PASSWORD`: A shared internal demo access password
4. Deploy the backend and frontend services

## API Documentation

Once the backend is running, visit http://127.0.0.1:8000/docs for interactive API documentation.

## Project Structure

```
command-centre-v2/
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── api/       # API endpoints
│   │   ├── models/    # Database models
│   │   ├── schemas/   # Pydantic schemas
│   │   └── main.py    # FastAPI app
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/          # Next.js frontend
│   ├── app/           # Next.js app router
│   ├── components/    # React components
│   ├── lib/           # Utility functions
│   └── package.json
├── infra/             # Infrastructure configs
│   ├── docker-compose.yml
│   └── env.example
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

MIT License