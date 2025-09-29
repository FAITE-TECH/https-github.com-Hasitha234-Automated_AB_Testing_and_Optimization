@echo off
echo Starting FastAPI A/B Testing Backend...
echo.
echo Server will be available at:
echo   - Swagger UI: http://localhost:8000/docs
echo   - ReDoc: http://localhost:8000/redoc
echo   - API: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d %~dp0
uvicorn main:app --reload --port 8000 --host 0.0.0.0
