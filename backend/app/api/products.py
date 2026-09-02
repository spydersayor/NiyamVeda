import os
import shutil
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import List, Optional
from app.core.config import settings
from app.schemas.models import ProductCreate, ProductUpdate, ProductResponse, ProductFact
from app.repositories.product_repo import product_repo

router = APIRouter(prefix="/api/products", tags=["Products"])

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
    prod = product_repo.get(product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    prod.status = "CONFIRMED"
    return prod

@router.post("/upload")
async def upload_supporting_document(file: UploadFile = File(...)):
    """
    Supporting document upload.
    Note: Supporting documents provide additional context but do NOT
    override authoritative regulatory sources.
    """
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_location = os.path.join(settings.UPLOAD_DIR, file.filename)
    
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)

    file_size_kb = round(os.path.getsize(file_location) / 1024, 1)

    return {
        "filename": file.filename,
        "size_kb": file_size_kb,
        "status": "UPLOADED_SUPPORTING_INFO",
        "notice": "Supporting document uploaded. It provides contextual engineering data but does not constitute an authoritative standard."
    }
