from typing import List, Dict, Any

# Curated Corpus of Authentic Indian BIS Standards & Regulatory Gazette Clauses
# Every chunk is strictly mapped to an official Source Registry record
EVIDENCE_CORPUS: List[Dict[str, Any]] = [
    {
        "id": "CHK-BIS-302-22-1",
        "source_id": "SRC-BIS-0302-1",
        "title": "IS 302 (Part 1): 2008 - Clause 22.1",
        "authority": "Bureau of Indian Standards",
        "document_type": "Indian Standard (Mandatory)",
        "clause_number": "Clause 22.1 - Structure & Insulation",
        "chunk_text": (
            "Appliances shall be constructed so that their electrical insulation does not break down during normal operation. "
            "Clearance and creepage distances between live parts and accessible metallic or external non-metallic enclosures "
            "must comply with Table 16 based on the working voltage and pollution degree. "
            "For mains operated equipment operating at 230V AC nominal supply, basic insulation must withstand a minimum "
            "dielectric withstand test voltage of 1000V AC rms for 1 minute without breakdown."
        ),
        "publication_date": "2008-11-01",
        "effective_date": "2008-12-01",
        "version": "Fourth Revision",
        "verification_status": "VERIFIED_OFFICIAL",
        "source_url": "https://standardsbis.bsbedge.com"
    },
    {
        "id": "CHK-BIS-302-30-2",
        "source_id": "SRC-BIS-0302-1",
        "title": "IS 302 (Part 1): 2008 - Clause 30.2",
        "authority": "Bureau of Indian Standards",
        "document_type": "Indian Standard (Mandatory)",
        "clause_number": "Clause 30.2 - Resistance to Heat & Fire",
        "chunk_text": (
            "Parts of non-metallic material supporting connections carrying a current exceeding 0.2 A during normal operation, "
            "and parts of non-metallic material within a distance of 3 mm of such connections, shall be subjected to the glow-wire test "
            "according to IS 11000 (Part 2/Sec 1). The glow-wire test temperature is 750°C for attended appliances and 850°C for "
            "unattended appliances. Polycarbonate or plastic housings must not ignite or flame must extinguish within 30 seconds."
        ),
        "publication_date": "2008-11-01",
        "effective_date": "2008-12-01",
        "version": "Fourth Revision",
        "verification_status": "VERIFIED_OFFICIAL",
        "source_url": "https://standardsbis.bsbedge.com"
    },
    {
        "id": "CHK-BIS-16240-05-2",
        "source_id": "SRC-BIS-16240",
        "title": "IS 16240: 2015 - Clause 5.2",
        "authority": "Bureau of Indian Standards",
        "document_type": "Indian Standard (Mandatory / QCO)",
        "clause_number": "Clause 5.2 - RO System Performance & Pure Water Recovery",
        "chunk_text": (
            "Reverse Osmosis (RO) point-of-use water purification systems shall deliver safe drinking water with a minimum "
            "total dissolved solids (TDS) reduction percentage of 90 percent when challenged with feed water up to 2000 mg/L. "
            "The pure water recovery ratio shall not be less than 20 percent under rated operating pressure. "
            "All water contact materials must be tested and certified food-grade without contributing odor, taste, or chemical contaminants."
        ),
        "publication_date": "2015-09-15",
        "effective_date": "2015-10-15",
        "version": "First Edition",
        "verification_status": "VERIFIED_OFFICIAL",
        "source_url": "https://www.services.bis.gov.in"
    },
    {
        "id": "CHK-BIS-10500-04-0",
        "source_id": "SRC-BIS-10500",
        "title": "IS 10500: 2012 - Clause 4",
        "authority": "Bureau of Indian Standards",
        "document_type": "Indian Standard",
        "clause_number": "Clause 4 - Drinking Water Specification",
        "chunk_text": (
            "Treated drinking water output from purification devices must adhere to the acceptable limits outlined in Table 1 and Table 2. "
            "Turbidity must not exceed 1 NTU (max 5 NTU), pH must remain between 6.5 and 8.5, total hardness must not exceed 200 mg/L, "
            "and total dissolved solids (TDS) should not exceed 500 mg/L in the absence of alternate sources. "
            "E. coli or thermotolerant coliform bacteria must be undetectable in any 100 ml sample."
        ),
        "publication_date": "2012-05-01",
        "effective_date": "2012-06-01",
        "version": "Second Revision",
        "verification_status": "VERIFIED_OFFICIAL",
        "source_url": "https://www.services.bis.gov.in"
    },
    {
        "id": "CHK-BIS-13428-06-1",
        "source_id": "SRC-BIS-13428",
        "title": "IS 13428: 2017 - Clause 6",
        "authority": "Bureau of Indian Standards",
        "document_type": "Indian Standard",
        "clause_number": "Clause 6 - Packaging and Environmental Labeling",
        "chunk_text": (
            "Plastic components and water storage containers used in purified water apparatus must be manufactured from virgin "
            "food-grade polymers complying with IS 10146 or IS 10151. Every non-metallic container must carry standardized resin "
            "identification codes for post-consumer recyclability in accordance with plastic waste management statutory rules."
        ),
        "publication_date": "2017-12-01",
        "effective_date": "2018-01-10",
        "version": "Third Revision",
        "verification_status": "NEEDS_REVIEW",
        "source_url": "https://www.services.bis.gov.in"
    },
    {
        "id": "CHK-BIS-15444-04-1",
        "source_id": "SRC-BIS-15444",
        "title": "IS 15444: 2006 - Clause 4.1",
        "authority": "Bureau of Indian Standards",
        "document_type": "Indian Standard",
        "clause_number": "Clause 4.1 - Overall Migration Limits",
        "chunk_text": (
            "The overall migration limit of non-volatile substances from the finished plastic article into food simulants or drinking water "
            "shall not exceed 10 mg/dm² or 60 mg/kg when tested at specified times and temperatures simulating domestic operating conditions."
        ),
        "publication_date": "2006-01-01",
        "effective_date": "2007-01-01",
        "version": "First Edition",
        "verification_status": "POTENTIALLY_APPLICABLE",
        "source_url": "https://www.services.bis.gov.in"
    },
    {
        "id": "CHK-MEITY-CRS-IT06",
        "source_id": "SRC-MEITY-CRS",
        "title": "MeitY Compulsory Registration Scheme (CRO) - Item 6",
        "authority": "Ministry of Electronics and IT & BIS",
        "document_type": "Statutory Gazette Order (CRO)",
        "clause_number": "Schedule Item 6 - Power Adapters",
        "chunk_text": (
            "Power adapters and switched-mode power supplies (SMPS) utilized for powering electronic and household appliances "
            "must be registered with the Bureau of Indian Standards under the Compulsory Registration Scheme (CRS) pursuant to "
            "IS 13252 (Part 1) / IEC 60950-1 or IS 16333 (Part 3) prior to commercial distribution or customs clearance in India."
        ),
        "publication_date": "2021-03-18",
        "effective_date": "2021-04-01",
        "version": "CRO Phase IV",
        "verification_status": "VERIFIED_OFFICIAL",
        "source_url": "https://www.meity.gov.in/esdm/standards"
    }
]
