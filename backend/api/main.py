"""
EcoTrace FastAPI Backend
Main API application with routes for accessing crawler data
"""

from fastapi import FastAPI, HTTPException, Depends, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional
from datetime import datetime
import os
from dotenv import load_dotenv

from .routes import companies, claims, search, analytics, graph
from .database import get_elasticsearch, get_neo4j, get_mongodb
from .models import HealthCheck
from .crawler_endpoint import router as crawler_router

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="EcoTrace API",
    description="Corporate Sustainability Claims Verification Platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware
allowed_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(companies.router, prefix="/api/companies", tags=["Companies"])
app.include_router(claims.router, prefix="/api/claims", tags=["Claims"])
app.include_router(search.router, prefix="/api/search", tags=["Search"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(graph.router, prefix="/api/graph", tags=["Knowledge Graph"])
app.include_router(crawler_router, tags=["Live Crawler"])


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "name": "EcoTrace API",
        "version": "1.0.0",
        "description": "Corporate Sustainability Claims Verification Platform",
        "docs": "/api/docs"
    }


@app.get("/api/health", response_model=HealthCheck, tags=["Health"])
async def health_check():
    """Health check endpoint"""
    # Check database connections
    es_healthy = False
    neo4j_healthy = False
    mongo_healthy = False

    try:
        es = get_elasticsearch()
        if es and es.ping():
            es_healthy = True
    except:
        pass

    try:
        driver = get_neo4j()
        if driver:
            with driver.session() as session:
                result = session.run("RETURN 1")
                neo4j_healthy = True
    except:
        pass

    try:
        client = get_mongodb()
        if client:
            client.server_info()
            mongo_healthy = True
    except:
        pass

    status_code = "healthy" if all([es_healthy, neo4j_healthy, mongo_healthy]) else "degraded"

    return HealthCheck(
        status=status_code,
        timestamp=datetime.utcnow(),
        services={
            "elasticsearch": es_healthy,
            "neo4j": neo4j_healthy,
            "mongodb": mongo_healthy
        }
    )


@app.on_event("startup")
async def startup_event():
    """Initialize connections on startup"""
    print("Starting EcoTrace API...")
    print(f"Allowed CORS origins: {allowed_origins}")


@app.on_event("shutdown")
async def shutdown_event():
    """Clean up on shutdown"""
    print("Shutting down EcoTrace API...")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("API_HOST", "0.0.0.0"),
        port=int(os.getenv("API_PORT", 8000)),
        reload=True
    )
