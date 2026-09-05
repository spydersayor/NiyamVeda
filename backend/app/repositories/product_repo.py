import json
import uuid
from datetime import datetime
from typing import List, Optional, Any, Dict
from psycopg2.extras import RealDictCursor
from app.core.database import get_connection
from app.schemas.models import ProductCreate, ProductUpdate, ProductResponse, ProductFact

class ProductRepository:
    """
    PostgreSQL-backed product repository for NiyamVeda.
    Persists product profiles, confirmed facts, and project statuses.
    """
    def __init__(self):
        pass

    def _row_to_product(self, row: Dict[str, Any]) -> ProductResponse:
        raw_facts = row.get("facts")
        if isinstance(raw_facts, str):
            try:
                raw_facts = json.loads(raw_facts)
            except Exception:
                raw_facts = []
        elif not isinstance(raw_facts, list):
            raw_facts = []

        facts = [ProductFact(**f) if isinstance(f, dict) else f for f in raw_facts]

        created_at = row.get("created_at")
        if isinstance(created_at, str):
            try:
                created_at = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
            except Exception:
                created_at = datetime.now()
        elif not isinstance(created_at, datetime):
            created_at = datetime.now()

        updated_at = row.get("updated_at")
        if isinstance(updated_at, str):
            try:
                updated_at = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))
            except Exception:
                updated_at = datetime.now()
        elif not isinstance(updated_at, datetime):
            updated_at = datetime.now()

        return ProductResponse(
            id=row["id"],
            project_name=row["project_name"],
            product_name=row["product_name"],
            category=row["category"],
            intended_use=row["intended_use"],
            material_composition=row["material_composition"],
            technical_characteristics=row["technical_characteristics"],
            operating_voltage=row["operating_voltage"],
            power_consumption=row["power_consumption"],
            water_storage_capacity=row["water_storage_capacity"],
            has_uv_module=bool(row["has_uv_module"]),
            manufacturing_origin=row["manufacturing_origin"] or "India",
            target_market=row["target_market"] or "Domestic",
            status=row["status"] or "DRAFT",
            facts=facts,
            created_at=created_at,
            updated_at=updated_at
        )

    def _seed_demo_data(self):
        demo_id = "demo-purifier-001"
        existing = self.get(demo_id)
        if existing:
            return

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
        facts_json = json.dumps([f.model_dump() if hasattr(f, "model_dump") else f.dict() for f in facts])

        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO products (
                        id, project_name, product_name, category, intended_use,
                        material_composition, technical_characteristics, operating_voltage,
                        power_consumption, water_storage_capacity, has_uv_module,
                        manufacturing_origin, target_market, status, facts, created_at, updated_at
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW()
                    ) ON CONFLICT (id) DO NOTHING
                """, (
                    demo_id,
                    "Smart Purifier Compliance Project",
                    "Smart Alkaline Water Purifier",
                    "Household Electrical Appliances (Water Filters)",
                    "Domestic kitchen water filtration and mineral ionization",
                    "Polycarbonate casing, carbon block filters, UV-LED sanitization chamber",
                    "Operating voltage: 230V AC, Frequency: 50Hz, Power consumption: 48W, Water storage: 8L, Integrated UV-LED module for water quality.",
                    "230V AC, 50Hz",
                    "48W",
                    "8 Liters",
                    True,
                    "India",
                    "Domestic",
                    "CONFIRMED",
                    facts_json
                ))

    def get(self, product_id: str) -> Optional[ProductResponse]:
        with get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT * FROM products WHERE id = %s", (product_id,))
                row = cur.fetchone()
                if row:
                    return self._row_to_product(dict(row))
        return None

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
        facts_json = json.dumps([f.model_dump() if hasattr(f, "model_dump") else f.dict() for f in facts])

        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO products (
                        id, project_name, product_name, category, intended_use,
                        material_composition, technical_characteristics, operating_voltage,
                        power_consumption, water_storage_capacity, has_uv_module,
                        manufacturing_origin, target_market, status, facts, created_at, updated_at
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW()
                    )
                """, (
                    pid,
                    data.project_name or "New Compliance Project",
                    data.product_name,
                    data.category,
                    data.intended_use,
                    data.material_composition,
                    data.technical_characteristics,
                    data.operating_voltage,
                    data.power_consumption,
                    data.water_storage_capacity,
                    data.has_uv_module,
                    data.manufacturing_origin,
                    data.target_market,
                    "DRAFT",
                    facts_json
                ))

        return self.get(pid)

    def update(self, product_id: str, data: ProductUpdate) -> Optional[ProductResponse]:
        prod = self.get(product_id)
        if not prod:
            return None

        d_dict = data.model_dump(exclude_unset=True) if hasattr(data, "model_dump") else data.dict(exclude_unset=True)
        if not d_dict:
            return prod

        set_clauses = []
        values = []
        for k, v in d_dict.items():
            if k == "facts" and isinstance(v, list):
                set_clauses.append("facts = %s")
                values.append(json.dumps([f.model_dump() if hasattr(f, "model_dump") else f.dict() for f in v]))
            else:
                set_clauses.append(f"{k} = %s")
                values.append(v)

        set_clauses.append("updated_at = NOW()")
        values.append(product_id)

        sql = f"UPDATE products SET {', '.join(set_clauses)} WHERE id = %s"
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, tuple(values))

        return self.get(product_id)

    def list_all(self) -> List[ProductResponse]:
        with get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT * FROM products ORDER BY created_at DESC")
                rows = cur.fetchall()
                return [self._row_to_product(dict(r)) for r in rows]

product_repo = ProductRepository()
