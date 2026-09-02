from typing import Dict, List
from app.schemas.models import SourceRegistryItem

# Authoritative Source Registry
# Curated Indian Regulatory Standards and Gazette Orders for SIH26107
SOURCE_REGISTRY: Dict[str, SourceRegistryItem] = {
    "SRC-BIS-0302-1": SourceRegistryItem(
        source_id="SRC-BIS-0302-1",
        authority="Bureau of Indian Standards",
        document_name="IS 302 (Part 1): 2008 - Safety of Household and Similar Electrical Appliances",
        document_type="Indian Standard (Mandatory)",
        official_url="https://standardsbis.bsbedge.com",
        applicable_domain="Household Electrical Appliances, General Electrical Safety, Insulation",
        version="Fourth Revision (2008)",
        effective_date="01 Dec 2008",
        verification_status="VERIFIED_OFFICIAL"
    ),
    "SRC-BIS-16240": SourceRegistryItem(
        source_id="SRC-BIS-16240",
        authority="Bureau of Indian Standards",
        document_name="IS 16240: 2015 - Reverse Osmosis Based Point-of-Use Water Treatment Systems",
        document_type="Indian Standard (Mandatory / QCO)",
        official_url="https://www.services.bis.gov.in",
        applicable_domain="Point-of-Use RO Water Treatment, Recovery, Total Dissolved Solids Reduction",
        version="First Edition (2015)",
        effective_date="15 Oct 2015",
        verification_status="VERIFIED_OFFICIAL"
    ),
    "SRC-BIS-10500": SourceRegistryItem(
        source_id="SRC-BIS-10500",
        authority="Bureau of Indian Standards",
        document_name="IS 10500: 2012 - Drinking Water - Specification",
        document_type="Indian Standard",
        official_url="https://www.services.bis.gov.in",
        applicable_domain="Potable Drinking Water Quality, Chemical Limits, Microbiological Parameters",
        version="Second Revision (2012)",
        effective_date="01 Jun 2012",
        verification_status="VERIFIED_OFFICIAL"
    ),
    "SRC-BIS-13428": SourceRegistryItem(
        source_id="SRC-BIS-13428",
        authority="Bureau of Indian Standards",
        document_name="IS 13428: 2017 - Packaged Natural Mineral Water - Specification & Packaging Norms",
        document_type="Indian Standard",
        official_url="https://www.services.bis.gov.in",
        applicable_domain="Water Packaging, Food-Grade Containers, Recyclability & Labeling",
        version="Third Revision (2017)",
        effective_date="10 Jan 2018",
        verification_status="NEEDS_REVIEW"
    ),
    "SRC-BIS-15444": SourceRegistryItem(
        source_id="SRC-BIS-15444",
        authority="Bureau of Indian Standards",
        document_name="IS 15444: 2006 - Plastics for Food Contact Applications",
        document_type="Indian Standard",
        official_url="https://www.services.bis.gov.in",
        applicable_domain="Polymeric Contact Materials, Migration Testing, Toxic Leaching",
        version="First Edition (2006)",
        effective_date="01 Jan 2007",
        verification_status="POTENTIALLY_APPLICABLE"
    ),
    "SRC-MEITY-CRS": SourceRegistryItem(
        source_id="SRC-MEITY-CRS",
        authority="Ministry of Electronics and Information Technology (MeitY) & BIS",
        document_name="Electronics and Information Technology Goods (Compulsory Registration Order)",
        document_type="Statutory Gazette Order (CRO)",
        official_url="https://www.meity.gov.in/esdm/standards",
        applicable_domain="Electronics, Power Adapters, Smart Appliances, IT Components",
        version="CRO Phase IV (Updated 2021)",
        effective_date="01 Apr 2021",
        verification_status="VERIFIED_OFFICIAL"
    ),
    "SRC-BIS-60950": SourceRegistryItem(
        source_id="SRC-BIS-60950",
        authority="Bureau of Indian Standards",
        document_name="IS/IEC 60950-1: 2010 - Information Technology Equipment - Safety",
        document_type="Indian Standard (Harmonized with IEC)",
        official_url="https://standardsbis.bsbedge.com",
        applicable_domain="IT Equipment, Commercial Electronics, Mains Powered Adapters",
        version="First Revision (2010)",
        effective_date="15 Jul 2010",
        verification_status="VERIFIED_OFFICIAL"
    )
}

def get_source_or_none(source_id: str) -> SourceRegistryItem | None:
    return SOURCE_REGISTRY.get(source_id)

def list_sources() -> List[SourceRegistryItem]:
    return list(SOURCE_REGISTRY.values())
