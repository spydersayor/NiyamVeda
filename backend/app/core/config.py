import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "NIYAMVEDA"
    TAGLINE: str = "From Product to Compliance Clarity"
    PROBLEM_STATEMENT: str = "SIH26107"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    CORS_ORIGIN: str = "http://localhost:3000"
    
    # Database
    DATABASE_URL: str = "postgresql://niyamveda:niyamveda@localhost:5432/niyamveda_db"
    
    # AI & Embedding
    GEMINI_API_KEY: str = ""
    LLM_MODEL: str = "gemini-2.5-flash"
    EMBEDDING_MODEL: str = "text-embedding-004"
    
    # STRICT EMBEDDING DIMENSION: 768
    # Matches Gemini text-embedding-004 and pgvector column vector(768)
    EMBEDDING_DIMENSION: int = 768
    
    # Storage
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
    MAX_UPLOAD_SIZE_MB: int = 10
    
    # Official Disclaimer
    DISCLAIMER: str = (
        "NIYAMVEDA provides source-grounded compliance guidance and does not constitute "
        "BIS certification or legal approval. Final compliance must be verified against "
        "the applicable official standards and regulatory authorities."
    )

    @property
    def cors_origins(self) -> List[str]:
        origins = [origin.strip() for origin in self.CORS_ORIGIN.split(",") if origin.strip()]
        if "http://localhost:3000" not in origins:
            origins.append("http://localhost:3000")
        return origins

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
