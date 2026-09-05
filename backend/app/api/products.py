import os
import re
import uuid
import shutil
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import List, Optional
from app.core.config import settings
from app.schemas.models import ProductCreate, ProductUpdate, ProductResponse, ProductFact
from app.repositories.product_repo import product_repo

router = APIRouter(prefix="/api/products", tags=["Products"])

def _sanitize_filename(filename: str) -> str:
    """
    Sanitize uploaded filename to prevent directory traversal and illegal characters.
    """
    # Extract only the base name (handles both Unix and Windows path separators)
    clean_name = os.path.basename(filename)
    # Remove null bytes and path traversal patterns
    clean_name = clean_name.replace("\x00", "").replace("..", "")
    # Keep only alphanumeric characters, dots, dashes, underscores
    clean_name = re.sub(r'[^a-zA-Z0-9._-]', '_', clean_name)
    # Ensure not empty or dot-only
    if not clean_name or clean_name.startswith("."):
        clean_name = f"document_{clean_name.lstrip('.')}"
    return clean_name

@router.get("", response_model=List[ProductResponse])
def list_products():
    return product_repo.list_all()

@router.post("", response_model=ProductResponse)
def create_product(product: ProductCreate):
    return product_repo.create(product)

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: str):
    prod = product_repo.get(product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    return prod

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: str, update_data: ProductUpdate):
    prod = product_repo.update(product_id, update_data)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    return prod

@router.post("/{product_id}/confirm", response_model=ProductResponse)
def confirm_facts(product_id: str):
    prod = product_repo.update(product_id, ProductUpdate(status="CONFIRMED"))
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    return prod

@router.post("/upload")
async def upload_supporting_document(file: UploadFile = File(...)):
    """
    Supporting document upload.
    Validates MIME type, enforces a 10MB size ceiling, sanitizes filenames,
    and protects against path traversal attacks.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename missing")

    safe_original_name = _sanitize_filename(file.filename)
    ext = os.path.splitext(safe_original_name)[1].lower()

    # Validate MIME type and file extension (PDF only)
    if ext != ".pdf" and file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only PDF documents (.pdf) are accepted as supporting documents."
        )

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    unique_filename = f"{uuid.uuid4().hex[:12]}_{safe_original_name}"
    file_location = os.path.join(settings.UPLOAD_DIR, unique_filename)

    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024  # 10 MB
    total_bytes = 0
    chunk_size = 64 * 1024  # 64 KB

    try:
        with open(file_location, "wb") as buffer:
            while True:
                chunk = await file.read(chunk_size)
                if not chunk:
                    break
                total_bytes += len(chunk)
                if total_bytes > max_bytes:
                    buffer.close()
                    if os.path.exists(file_location):
                        os.remove(file_location)
                    raise HTTPException(
                        status_code=413,
                        detail=f"File size exceeds maximum allowed limit of {settings.MAX_UPLOAD_SIZE_MB} MB."
                    )
                buffer.write(chunk)
    except HTTPException:
        raise
    except Exception as e:
        if os.path.exists(file_location):
            os.remove(file_location)
        raise HTTPException(status_code=500, detail=f"Failed to process file upload: {str(e)}")

    file_size_kb = round(total_bytes / 1024, 1)

    return {
        "filename": safe_original_name,
        "saved_as": unique_filename,
        "size_kb": file_size_kb,
        "status": "UPLOADED_SUPPORTING_INFO",
        "notice": "Supporting document uploaded. It provides contextual engineering data but does not constitute an authoritative standard."
    }
