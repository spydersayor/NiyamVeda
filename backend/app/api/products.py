import os
import re
import uuid
import shutil
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Query
from typing import List, Optional, Dict, Any
from app.core.config import settings
from app.schemas.models import ProductCreate, ProductUpdate, ProductResponse, ProductFact
from app.repositories.product_repo import product_repo

router = APIRouter(prefix="/api/products", tags=["Products"])

def _sanitize_filename(filename: str) -> str:
    """
    Sanitize uploaded filename to prevent directory traversal and illegal characters.
    """
    clean_name = os.path.basename(filename)
    clean_name = clean_name.replace("\x00", "").replace("..", "")
    clean_name = re.sub(r'[^a-zA-Z0-9._-]', '_', clean_name)
    if not clean_name or clean_name.startswith("."):
        clean_name = f"document_{clean_name.lstrip('.')}"
    return clean_name

def extract_facts_from_pdf(file_path: str) -> Dict[str, Any]:
    """
    Extract structured engineering facts from an uploaded technical datasheet PDF.
    Uses PyMuPDF (fitz) with deterministic pattern matching.
    """
    extracted_text = ""
    try:
        import fitz
        doc = fitz.open(file_path)
        for page in doc:
            extracted_text += page.get_text() + "\n"
        doc.close()
    except Exception:
        # Fallback reading raw text lines
        try:
            with open(file_path, "r", errors="ignore") as f:
                extracted_text = f.read()
        except Exception:
            extracted_text = ""

    facts: Dict[str, Any] = {}
    lower_text = extracted_text.lower()

    # 1. Voltage pattern: e.g. "Rated Voltage: 230V AC" or "230V, 50Hz"
    volt_match = re.search(r'(?:voltage|operating\s*voltage|rated\s*voltage)[:\s]+([0-9]{2,3}\s*V(?:\s*AC|\s*DC)?(?:,\s*[0-9]{2}\s*Hz)?)', extracted_text, re.IGNORECASE)
    if not volt_match:
        volt_match = re.search(r'\b([0-9]{2,3}\s*V\s*(?:AC|DC))\b', extracted_text, re.IGNORECASE)
    if volt_match:
        facts["operating_voltage"] = volt_match.group(1).strip()

    # 2. Power pattern: e.g. "Rated Power: 1200W" or "Power Consumption: 48W"
    power_match = re.search(r'(?:power|rated\s*power|power\s*consumption|wattage)[:\s]+([0-9]+(?:\.[0-9]+)?\s*W(?:att)?)', extracted_text, re.IGNORECASE)
    if not power_match:
        power_match = re.search(r'\b([0-9]{2,4}\s*W)\b', extracted_text, re.IGNORECASE)
    if power_match:
        facts["power_consumption"] = power_match.group(1).strip()

    # 3. Capacity / Volume pattern: e.g. "Capacity: 1.7L" or "8 Liters"
    cap_match = re.search(r'(?:capacity|volume|storage)[:\s]+([0-9]+(?:\.[0-9]+)?\s*(?:L|Liters?|ml))\b', extracted_text, re.IGNORECASE)
    if not cap_match:
        cap_match = re.search(r'\b([0-9]+(?:\.[0-9]+)?\s*(?:L|Liters?))\b', extracted_text, re.IGNORECASE)
    if cap_match:
        facts["water_storage_capacity"] = cap_match.group(1).strip()

    # 4. Materials detection
    detected_materials = []
    if "ss304" in lower_text or "ss 304" in lower_text or "stainless steel 304" in lower_text or "304 stainless steel" in lower_text:
        detected_materials.append("SS304 Stainless Steel inner vessel")
    elif "stainless steel" in lower_text or "steel" in lower_text:
        detected_materials.append("Stainless Steel")

    if "polypropylene" in lower_text or "pp lid" in lower_text or " pp " in lower_text:
        detected_materials.append("Polypropylene lid")
    elif "polycarbonate" in lower_text:
        detected_materials.append("Polycarbonate casing")
    elif "abs" in lower_text:
        detected_materials.append("Flame-Retardant ABS")

    if detected_materials:
        facts["material_composition"] = ", ".join(detected_materials)

    # 5. Heating Element & Liquid Heating
    if any(k in lower_text for k in ["heating element", "boiling", "kettle", "water boiler", "dry-boil", "cut-out"]):
        facts["has_heating_element"] = True
        facts["intended_use"] = "Domestic boiling and heating of potable water"
        facts["category"] = "Household Electrical Appliances (Liquid Heaters)"
        facts["food_contact"] = True
    elif any(k in lower_text for k in ["purifier", "reverse osmosis", "ro system", "tds reduction", "filtration"]):
        facts["intended_use"] = "Domestic kitchen water filtration and mineral ionization"
        facts["category"] = "Household Electrical Appliances (Water Filters)"
        facts["food_contact"] = True

    return facts

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
async def upload_supporting_document(
    file: UploadFile = File(...),
    product_id: Optional[str] = Query(None)
):
    """
    Supporting document upload.
    Validates MIME type, enforces a 10MB ceiling, sanitizes filenames,
    extracts engineering facts via PyMuPDF, and associates them with product facts.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename missing")

    safe_original_name = _sanitize_filename(file.filename)
    ext = os.path.splitext(safe_original_name)[1].lower()

    if ext != ".pdf" and file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only PDF documents (.pdf) are accepted as supporting documents."
        )

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    unique_filename = f"{uuid.uuid4().hex[:12]}_{safe_original_name}"
    file_location = os.path.join(settings.UPLOAD_DIR, unique_filename)

    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    total_bytes = 0
    chunk_size = 64 * 1024

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

    # Extract structured technical facts from the PDF
    extracted_facts = extract_facts_from_pdf(file_location)

    # If product_id was provided, update existing product facts with extracted facts
    if product_id:
        prod = product_repo.get(product_id)
        if prod:
            update_kwargs: Dict[str, Any] = {}
            if "operating_voltage" in extracted_facts and not prod.operating_voltage:
                update_kwargs["operating_voltage"] = extracted_facts["operating_voltage"]
            if "power_consumption" in extracted_facts and not prod.power_consumption:
                update_kwargs["power_consumption"] = extracted_facts["power_consumption"]
            if "water_storage_capacity" in extracted_facts and not prod.water_storage_capacity:
                update_kwargs["water_storage_capacity"] = extracted_facts["water_storage_capacity"]
            if "material_composition" in extracted_facts and not prod.material_composition:
                update_kwargs["material_composition"] = extracted_facts["material_composition"]
            if update_kwargs:
                product_repo.update(product_id, ProductUpdate(**update_kwargs))

    return {
        "filename": safe_original_name,
        "saved_as": unique_filename,
        "size_kb": file_size_kb,
        "status": "UPLOADED_SUPPORTING_INFO",
        "notice": "Supporting document uploaded and technical facts extracted successfully.",
        "extracted_facts": extracted_facts
    }
