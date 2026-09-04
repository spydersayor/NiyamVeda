from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.products import router as products_router
from app.api.analysis import router as analysis_router
from app.api.simulation import router as simulation_router
from app.api.sources import router as sources_router
from app.api.auth import router as auth_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Explainable BIS Compliance Intelligence Assistant for Indian MSMEs (SIH26107)",
    version=settings.VERSION
)

# Explicit CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth_router)
app.include_router(products_router)
app.include_router(analysis_router)
app.include_router(simulation_router)
app.include_router(sources_router)

@app.get("/")
def root_info():
    return {
        "project": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "problem_statement": settings.PROBLEM_STATEMENT,
        "status": "OPERATIONAL",
        "embedding_dimension": settings.EMBEDDING_DIMENSION,
        "llm_model": settings.LLM_MODEL,
        "disclaimer": settings.DISCLAIMER
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": "2026-09-02T20:50:00Z"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
