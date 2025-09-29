# Running the A/B Testing System

## 🚀 Quick Start

### FastAPI Backend (Port 8000)

**Option 1: Using PowerShell**
```powershell
cd backend_fastapi
.\start_server.ps1
```

**Option 2: Using Command Prompt**
```cmd
cd backend_fastapi
start_server.bat
```

**Option 3: Manual Start**
```bash
cd backend_fastapi
uvicorn main:app --reload --port 8000
```

### React Frontend (Port 5173)

```bash
cd frontend
npm run dev
```

## 📚 Access Points

### FastAPI Backend
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **API Base**: http://localhost:8000/api
- **Health Check**: http://localhost:8000/health

### React Frontend
- **Application**: http://localhost:5173

## 🧪 Testing the API

### Using the Test Script
```bash
cd backend_fastapi
python test_api.py
```

### Using Swagger UI
1. Open http://localhost:8000/docs
2. Click on any endpoint
3. Click "Try it out"
4. Fill in the parameters
5. Click "Execute"

## 🔧 Troubleshooting

### If FastAPI won't start:
1. Make sure you're in the `backend_fastapi` directory
2. Check that port 8000 is not in use: `netstat -an | findstr :8000`
3. Make sure Python dependencies are installed: `pip install fastapi uvicorn python-dotenv`

### If Frontend won't connect:
1. Make sure the FastAPI backend is running on port 8000
2. Check that the frontend API URL is correct in `frontend/src/api/experimentApi.jsx`

## 📝 Notes

- The FastAPI backend uses a mock database for demo purposes
- Both servers support hot-reloading for development
- CORS is enabled to allow frontend-backend communication
