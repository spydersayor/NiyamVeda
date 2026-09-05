from typing import List
from app.schemas.models import RuleDefinition, RuleCondition

# Deterministic BIS Compliance Rules
# Each rule is strictly linked to a verified source in the Source Registry
BIS_RULES: List[RuleDefinition] = [
    # RULE-BIS-014: Household Electrical Safety
    RuleDefinition(
        rule_id="RULE-BIS-014",
        rule_name="Household Electrical Safety - Insulation & Structure Under Mains Voltage",
        category="Household Electrical Appliance",
        conditions=[
            RuleCondition(field="is_electrical", operator="equals", value=True),
            RuleCondition(field="operating_voltage_num", operator="greater_than", value=50.0)
        ],
        logic_summary="IF Appliance Is Electrical AND Operating Voltage > 50V AC THEN Trigger Mandatory Electrical Insulation & Overload Review (IS 302 Part 1)",
        source_id="SRC-BIS-0302-1",
        source_clause="Clause 22.1 - Construction & Insulation",
        authority="Bureau of Indian Standards",
        verification_status="VERIFIED_OFFICIAL",
        output_requirement="Appliances shall be constructed so that their electrical insulation does not break down during normal operation (IS 302 Part 1: Clause 22.1).",
        output_risk="Incorrect insulation creepage distance or clearance under 230V AC mains operation can result in electric shock or dielectric breakdown test failure."
    ),

    # RULE-BIS-015: Liquid Heating Appliances / Electric Kettles
    RuleDefinition(
        rule_id="RULE-BIS-015",
        rule_name="Liquid Heating Safety - Thermal Cut-Out & Dry Boil Protection",
        category="Household Electrical Appliance",
        conditions=[
            RuleCondition(field="is_electrical", operator="equals", value=True),
            RuleCondition(field="has_heating_element", operator="equals", value=True)
        ],
        logic_summary="IF Electrical Appliance Has Heating Element For Boiling/Heating Liquids THEN Mandatory Thermal Cut-Out and Dry-Boil Protection Under IS 302 (Part 2/Sec 15)",
        source_id="SRC-BIS-0302-2-15",
        source_clause="Clause 19 - Abnormal Operation & Dry Boil Protection",
        authority="Bureau of Indian Standards",
        verification_status="VERIFIED_OFFICIAL",
        output_requirement="Appliances for heating liquids must incorporate an automatic dry-boil thermal cut-out that disconnects power under abnormal water-less operation.",
        output_risk="Absence or failure of dry-boil thermal protector can cause severe element overheating, vessel rupture, or fire hazard under abnormal boil-dry conditions."
    ),

    # RULE-BIS-002: Point of Use RO Water Purification Performance
    RuleDefinition(
        rule_id="RULE-BIS-002",
        rule_name="Point-of-Use Drinking Water Treatment RO Efficacy",
        category="Water Filtration",
        conditions=[
            RuleCondition(field="water_purification", operator="equals", value=True)
        ],
        logic_summary="IF Product Function = Water Purification / Filtration THEN Apply Point-of-Use Reverse Osmosis Performance & Recovery Criteria (IS 16240: 2015)",
        source_id="SRC-BIS-16240",
        source_clause="Clause 5.2 - TDS Reduction & Pure Water Recovery",
        authority="Bureau of Indian Standards",
        verification_status="VERIFIED_OFFICIAL",
        output_requirement="Point-of-use RO water purifier must achieve minimum 90% TDS rejection and minimum 20% water recovery ratio under standard test conditions.",
        output_risk="Insufficient recovery efficiency or inadequate post-filtration mineral retention leads to rejection during mandatory NABL testing."
    ),

    # RULE-BIS-004: Drinking Water Safety Baseline (IS 10500)
    RuleDefinition(
        rule_id="RULE-BIS-004",
        rule_name="Output Potable Water Quality Parameters",
        category="Water Filtration",
        conditions=[
            RuleCondition(field="water_purification", operator="equals", value=True),
            RuleCondition(field="food_contact", operator="equals", value=True)
        ],
        logic_summary="IF Product Treats Potable Drinking Water THEN Output Must Meet Permissible Chemical & Microbiological Limits of IS 10500: 2012",
        source_id="SRC-BIS-10500",
        source_clause="Table 1 & 2 - Organoleptic, Physical, and Chemical Limits",
        authority="Bureau of Indian Standards",
        verification_status="VERIFIED_OFFICIAL",
        output_requirement="Effluent water must comply with drinking water thresholds for pH, turbidity, heavy metals, and zero E. coli / coliforms.",
        output_risk="Secondary leaching from internal cartridge adhesives or uncertified carbon blocks may introduce chemical impurities above IS 10500 limits."
    ),

    # RULE-BIS-003: Polymeric Housing Flame Retardancy & Glow-Wire Test
    RuleDefinition(
        rule_id="RULE-BIS-003",
        rule_name="Polymer Enclosure Resistance to Heat and Fire",
        category="Materials & Enclosures",
        conditions=[
            RuleCondition(field="has_polycarbonate", operator="equals", value=True),
            RuleCondition(field="operating_voltage_num", operator="greater_than", value=50.0)
        ],
        logic_summary="IF Material Composition Contains Polycarbonate AND Operating Voltage > 50V AC THEN Enclosure Must Pass Glow-Wire Ignition Test at 750°C / 850°C",
        source_id="SRC-BIS-0302-1",
        source_clause="Clause 30.2 - Resistance to Heat and Fire",
        authority="Bureau of Indian Standards",
        verification_status="VERIFIED_OFFICIAL",
        output_requirement="Non-metallic enclosures supporting current-carrying parts must withstand glow-wire test at specified temperatures to prevent fire propagation.",
        output_risk="Standard commercial-grade Polycarbonate frequently fails glow-wire flammability tests. MSMEs must procure certified Flame-Retardant (FR-V0) grade resin."
    ),

    # RULE-BIS-005: Stainless Steel Food Contact Material Safety
    RuleDefinition(
        rule_id="RULE-BIS-005",
        rule_name="Stainless Steel Food Contact Vessel Specification",
        category="Materials & Metallurgy",
        conditions=[
            RuleCondition(field="has_stainless_steel", operator="equals", value=True),
            RuleCondition(field="food_contact", operator="equals", value=True)
        ],
        logic_summary="IF Material Contains Stainless Steel AND Application Involves Food/Water Contact THEN Conformance to Austenitic SS304/SS316 Under IS 6911 Mandatory",
        source_id="SRC-BIS-06911",
        source_clause="Clause 5.1 - Chemical Composition of Food-Grade Stainless Steel",
        authority="Bureau of Indian Standards",
        verification_status="VERIFIED_OFFICIAL",
        output_requirement="Stainless steel contact surfaces must conform to food-grade austenitic grades (SS304/SS316) with minimum 17.5% Cr and 8.0% Ni to prevent toxic metal leaching.",
        output_risk="Use of non-food-grade or inferior ferritic steel (e.g. 200 series) causes rust pitting, nickel leaching into boiling water, and test rejection."
    ),

    # RULE-BIS-006: Plastics for Food Contact Applications
    RuleDefinition(
        rule_id="RULE-BIS-006",
        rule_name="Polymeric Food Contact Overall Migration Safety",
        category="Materials & Polymers",
        conditions=[
            RuleCondition(field="has_plastic", operator="equals", value=True),
            RuleCondition(field="food_contact", operator="equals", value=True)
        ],
        logic_summary="IF Non-metallic / Polymeric Material Involves Food/Drinking Water Contact THEN Overall Migration Limit (<10 mg/dm²) Under IS 15444 Applies",
        source_id="SRC-BIS-15444",
        source_clause="Clause 4.1 - Overall Migration Limits",
        authority="Bureau of Indian Standards",
        verification_status="POTENTIALLY_APPLICABLE",
        output_requirement="The overall migration limit of non-volatile substances from the finished plastic article into food simulants or drinking water shall not exceed 10 mg/dm².",
        output_risk="Uncertified polymer masterbatches or plasticizers can leach toxic non-volatile residues into potable water, failing migration test standards."
    ),

    # RULE-BIS-007: SPI Polymer Resin Identification & Packaging Norms
    RuleDefinition(
        rule_id="RULE-BIS-007",
        rule_name="Polymer Resin Identification & Statutory Recyclability Labeling",
        category="Environmental & Packaging",
        conditions=[
            RuleCondition(field="has_plastic", operator="equals", value=True)
        ],
        logic_summary="IF Product Utilizes Plastic Enclosures or Packaging THEN Standardized SPI Polymer Recycling Codes and Environmental Labeling Mandatory",
        source_id="SRC-BIS-13428",
        source_clause="Clause 6 - Packaging and Environmental Labeling",
        authority="Bureau of Indian Standards",
        verification_status="NEEDS_REVIEW",
        output_requirement="Every non-metallic enclosure or container must carry standardized SPI polymer resin identification codes for post-consumer recyclability.",
        output_risk="Absence of resin marking prevents statutory Plastic Waste Management clearance from State Pollution Control Boards."
    ),

    # RULE-BIS-020: MeitY CRS Registration for External Power Supply / Adapters
    RuleDefinition(
        rule_id="RULE-BIS-020",
        rule_name="Compulsory Registration Scheme (CRS) for Power Adapters",
        category="Electronics",
        conditions=[
            RuleCondition(field="is_electrical", operator="equals", value=True),
            RuleCondition(field="power_consumption_num", operator="greater_than", value=20.0)
        ],
        logic_summary="IF Appliance Powered by Switched Mode Power Supply (SMPS) > 20W THEN Power Adapter Must Carry MeitY CRS BIS Registration Mark",
        source_id="SRC-MEITY-CRS",
        source_clause="Schedule Item 6 - Power Adapters",
        authority="Ministry of Electronics and Information Technology (MeitY) & BIS",
        verification_status="VERIFIED_OFFICIAL",
        output_requirement="The internal or external AC-DC power supply module must be independently registered under BIS Compulsory Registration Scheme (CRS).",
        output_risk="Using unbranded or uncertified SMPS modules will block overall product BIS certification even if the mechanical enclosure passes."
    ),

    # RULE-BIS-60950: Commercial Equipment Safety
    RuleDefinition(
        rule_id="RULE-BIS-60950",
        rule_name="Commercial Electrical Safety & EMC Emissions",
        category="Commercial Electronics",
        conditions=[
            RuleCondition(field="is_commercial", operator="equals", value=True),
            RuleCondition(field="is_electrical", operator="equals", value=True)
        ],
        logic_summary="IF Product Application Is Commercial/IT THEN Mandatory Verification Under IS/IEC 60950-1 and EMC Emissions Testing",
        source_id="SRC-BIS-60950",
        source_clause="Clause 1.2 - Safety Requirements for Commercial Equipment",
        authority="Bureau of Indian Standards",
        verification_status="VERIFIED_OFFICIAL",
        output_requirement="Commercial-grade electrical apparatus must comply with commercial safety limits and mandatory Electromagnetic Compatibility (EMC) testing.",
        output_risk="Electromagnetic interference with industrial grid or insufficient commercial insulation margins leads to BIS registration query."
    ),

    # RULE-BIS-030: Non-Electrical Stainless Steel Utensils Specification
    RuleDefinition(
        rule_id="RULE-BIS-030",
        rule_name="Non-Electrical Stainless Steel Cooking Utensils Safety",
        category="Cookware & Kitchen Utensils",
        conditions=[
            RuleCondition(field="is_electrical", operator="equals", value=False),
            RuleCondition(field="has_stainless_steel", operator="equals", value=True),
            RuleCondition(field="food_contact", operator="equals", value=True)
        ],
        logic_summary="IF Non-Electrical Cooking Utensil / Food Container Fabricated from Stainless Steel THEN Conformance to IS 14756: 2022 Mandatory",
        source_id="SRC-BIS-14756",
        source_clause="Clause 4.2 - Food Grade Utensil Material Safety",
        authority="Bureau of Indian Standards",
        verification_status="VERIFIED_OFFICIAL",
        output_requirement="Stainless steel cooking utensils and food containers shall be fabricated from certified food-grade stainless steel sheet complying with IS 6911.",
        output_risk="Handle thermal degradation or handle attachment failure under 150°C load test causes failure under IS 14756 physical durability testing."
    )
]
