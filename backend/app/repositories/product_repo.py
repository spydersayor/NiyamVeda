import uuid
from datetime import datetime
from typing import Dict, List, Optional
from app.schemas.models import ProductCreate, ProductUpdate, ProductResponse, ProductFact

class ProductRepository:
    """
    In-memory and persistent product storage for NiyamVeda MVP.
    Stores drafts, confirmed facts, and uploaded file metadata.
    """
    def __init__(self):
        self._products: Dict[str, ProductResponse] = {}
        self._seed_demo_data()

    def _seed_demo_data(self):
        demo_id = "demo-purifier-001"
        facts = [
            ProductFact(
                key="category",
                label="PRODUCT CATEGORY",
                value="Electrical Household Appliance",
                origin="USER_PROVIDED",
                is_confirmed=True
            ),
            ProductFact(
                key="material_composition",
                label="MATERIAL / STRUCTURE",
                value="Polycarbonate Housing",
                origin="EXTRACTED_FROM_DOCUMENT",
                is_confirmed=True
            ),
            ProductFact(
                key="intended_use",
                label="APPLICATION INTENT",
                value="Domestic Consumer Use",
                origin="USER_PROVIDED",
                is_confirmed=True
            ),
            ProductFact(
                key="operating_voltage",
                label="OPERATING VOLTAGE",
                value="230V AC, 50Hz",
                origin="USER_PROVIDED",
                is_confirmed=True
            ),
            ProductFact(
                key="power_consumption",
                label="POWER CONSUMPTION",
                value="40W",
                origin="EXTRACTED_FROM_DOCUMENT",
                is_confirmed=True
            ),
            ProductFact(
                key="water_storage_capacity",
                label="WATER STORAGE CAPACITY",
                value="8 Liters",
                origin="USER_PROVIDED",
                is_confirmed=True
            )
        ]

        self._products[demo_id] = ProductResponse(
            id=demo_id,
            project_name="Smart Purifier Compliance Project",
            product_name="Smart Alkaline Water Purifier",
            category="Household Electrical Appliances (Water Filters)",
            intended_use="Domestic kitchen water filtration and mineral ionization",
            material_composition="Polycarbonate casing, carbon block filters, UV-LED sanitization chamber",
            technical_characteristics="Operating voltage: 230V AC, Frequency: 50Hz, Power consumption: 48W, Water storage: 8L, Integrated UV-LED module for water quality.",
            operating_voltage="230V AC, 50Hz",
            power_consumption="48W",
            water_storage_capacity="8 Liters",
            has_uv_module=True,
            manufacturing_origin="India",
            target_market="Domestic",
            status="CONFIRMED",
            facts=facts,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

    def get(self, product_id: str) -> Optional[ProductResponse]:
        return self._products.get(product_id)

    def create(self, data: ProductCreate) -> ProductResponse:
        pid = f"prod-{str(uuid.uuid4())[:8]}"
        facts = [
            ProductFact(key="category", label="PRODUCT CATEGORY", value=data.category, origin="USER_PROVIDED"),
            ProductFact(key="material_composition", label="MATERIAL / STRUCTURE", value=data.material_composition or "Unspecified", origin="USER_PROVIDED"),
            ProductFact(key="intended_use", label="APPLICATION INTENT", value=data.intended_use, origin="USER_PROVIDED"),
            ProductFact(key="operating_voltage", label="OPERATING VOLTAGE", value=data.operating_voltage or "Unspecified", origin="USER_PROVIDED"),
            ProductFact(key="power_consumption", label="POWER CONSUMPTION", value=data.power_consumption or "Unspecified", origin="USER_PROVIDED"),
            ProductFact(key="water_storage_capacity", label="WATER STORAGE CAPACITY", value=data.water_storage_capacity or "Unspecified", origin="USER_PROVIDED"),
        ]
        
        prod = ProductResponse(
            id=pid,
            project_name=data.project_name or "New Compliance Project",
            product_name=data.product_name,
            category=data.category,
            intended_use=data.intended_use,
            material_composition=data.material_composition,
            technical_characteristics=data.technical_characteristics,
            operating_voltage=data.operating_voltage,
            power_consumption=data.power_consumption,
            water_storage_capacity=data.water_storage_capacity,
            has_uv_module=data.has_uv_module,
            manufacturing_origin=data.manufacturing_origin,
            target_market=data.target_market,
            status="DRAFT",
            facts=facts,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        self._products[pid] = prod
        return prod

    def update(self, product_id: str, data: ProductUpdate) -> Optional[ProductResponse]:
        prod = self.get(product_id)
        if not prod:
            return None
        
        d_dict = data.model_dump(exclude_unset=True) if hasattr(data, "model_dump") else data.dict(exclude_unset=True)
        for k, v in d_dict.items():
            setattr(prod, k, v)
        prod.updated_at = datetime.now()
        self._products[product_id] = prod
        return prod

    def list_all(self) -> List[ProductResponse]:
        return list(self._products.values())

product_repo = ProductRepository()
