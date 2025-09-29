from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import os
from dotenv import load_dotenv

from app.routes import experiments, events

# Load environment variables
load_dotenv()

# Create FastAPI app with metadata for Swagger
app = FastAPI(
    title="A/B Testing and Optimization API",
    description="Automated A/B testing system with experiment assignment and event tracking",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc",  # ReDoc
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(experiments.router, prefix="/api", tags=["experiments"])
app.include_router(events.router, prefix="/api", tags=["events"])

# Root endpoint redirects to docs
@app.get("/")
async def root():
    return RedirectResponse(url="/docs")

# Health check
@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "healthy", "message": "A/B Testing API is running"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
