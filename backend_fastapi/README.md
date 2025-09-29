# FastAPI A/B Testing Backend

A modern FastAPI-based backend for automated A/B testing and optimization with comprehensive Swagger documentation.

## Features

- 🚀 **FastAPI** with automatic OpenAPI/Swagger documentation
- 📊 **A/B Testing Engine** with deterministic user assignment
- 📈 **Event Tracking** for analytics and conversion measurement
- 🎯 **Digital Ad Campaign Support** with campaign and ad tracking
- 🔄 **CORS Support** for frontend integration
- 💾 **Mock Database** for demo purposes (easily replaceable with PostgreSQL)

## Quick Start

1. **Install Dependencies**
   ```bash
   pip install fastapi uvicorn python-dotenv
   ```

2. **Set Environment Variables**
   ```bash
   copy demo.env .env
   ```

3. **Run the Server**
   ```bash
   python main.py
   ```

4. **Access Swagger Documentation**
   - Open http://localhost:8000/docs for interactive API documentation
   - Open http://localhost:8000/redoc for alternative documentation

## API Endpoints

### Experiments
- `POST /api/assignment` - Get user assignment to experiment variant
- `GET /api/experiments/{experiment_id}` - Get experiment configuration
- `GET /api/experiments/{experiment_id}/stats` - Get experiment statistics
- `GET /api/experiments` - List all experiments

### Events
- `POST /api/events` - Track any event (impression, click, conversion, custom)
- `GET /api/events/{experiment_id}` - Get events for an experiment
- `POST /api/events/impression` - Track impression (convenience endpoint)
- `POST /api/events/click` - Track click (convenience endpoint)
- `POST /api/events/conversion` - Track conversion (convenience endpoint)

### Health
- `GET /health` - Health check endpoint

## Environment Variables

- `PORT` - Server port (default: 8000)
- `HMAC_SALT` - Salt for deterministic hashing
- `HASH_SEED` - Seed for experiment assignment
- `DATABASE_URL` - Database connection (demo-mode for mock database)

## Architecture

```
backend_fastapi/
├── main.py                 # FastAPI application entry point
├── app/
│   ├── models/
│   │   └── schemas.py      # Pydantic models for request/response
│   ├── routes/
│   │   ├── experiments.py  # Experiment assignment endpoints
│   │   └── events.py       # Event tracking endpoints
│   └── utils/
│       ├── hash.py         # Deterministic assignment logic
│       └── database.py     # Database abstraction (mock for demo)
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## Example Usage

### 1. Get User Assignment
```bash
curl -X POST "http://localhost:8000/api/assignment" \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": "user123",
       "experiment_id": "homepage_banner",
       "device_type": "desktop"
     }'
```

### 2. Track Conversion
```bash
curl -X POST "http://localhost:8000/api/events/conversion" \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": "user123",
       "experiment_id": "homepage_banner",
       "variant": "variant_a"
     }'
```

### 3. View Experiment Stats
```bash
curl "http://localhost:8000/api/experiments/homepage_banner/stats"
```

## Production Setup

For production use:

1. Replace the mock database with PostgreSQL
2. Set up proper environment variables
3. Configure CORS origins for security
4. Add authentication/authorization
5. Set up logging and monitoring
6. Use a proper WSGI server like Gunicorn

## Swagger Documentation

The FastAPI backend automatically generates comprehensive API documentation:

- **Swagger UI**: Interactive documentation with try-it-out functionality
- **ReDoc**: Clean, responsive documentation
- **OpenAPI Schema**: Machine-readable API specification

Access the documentation at:
- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc (ReDoc)
- http://localhost:8000/openapi.json (OpenAPI schema)
