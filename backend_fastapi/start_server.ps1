Write-Host "Starting FastAPI A/B Testing Backend..." -ForegroundColor Green
Write-Host ""
Write-Host "Server will be available at:" -ForegroundColor Yellow
Write-Host "  - Swagger UI: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "  - ReDoc: http://localhost:8000/redoc" -ForegroundColor Cyan
Write-Host "  - API: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Change to the script's directory
Set-Location $PSScriptRoot

# Start the server
uvicorn main:app --reload --port 8000 --host 0.0.0.0
