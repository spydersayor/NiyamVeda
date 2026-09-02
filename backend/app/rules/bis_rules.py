from typing import List
from app.schemas.models import RuleDefinition, RuleCondition

# Deterministic BIS Compliance Rules
# Each rule is strictly linked to a verified source in the Source Registry
BIS_RULES: List[RuleDefinition] = [
    # RULE-BIS-014 (Shown prominently on Screen 5 and Screen 6 of visual reference)
    RuleDefinition(
        rule_id="RULE-BIS-014",
        rule_name="Household Electrical Safety - Insulation & Structure Under Mains Voltage",
        category="Household Electrical Appliance",
        conditions=[
            RuleCondition(field="category", operator="contains", value="Household Electrical Appliance"),
            RuleCondition(field="operating_voltage_num", operator="greater_than", value=50.0)
        ],
        logic_summary="IF Product Category = Household Electrical Appliance AND Operating Voltage > 50V AC THEN Trigger Mandatory Electrical Insulation & Overload Review",
        source_id="SRC-BIS-0302-1",
        source_clause="Clause 22.1 - Construction & Insulation",
        authority="Bureau of Indian Standards",
        verification_status="VERIFIED_OFFICIAL",
        output_requirement="Appliances shall be constructed so that their electrical insulation does not break down during normal operation (IS 302 Part 1: Clause 22.1).",
        output_risk="Incorrect insulation creepage distance or clearance under 230V AC mains operation can result in electric shock or dielectric breakdown test failure."
    ),
    
    # RULE-BIS-002: Point of Use RO Water Purification Performance
    RuleDefinition(
        rule_id="RULE-BIS-002",
        rule_name="Point-of-Use Drinking Water Treatment RO Efficacy",
        category="Water Filtration",
        conditions=[
            RuleCondition(field="intended_use", operator="contains", value="water filtration")
        ],
        logic_summary="IF Intended Use = Water Filtration THEN Apply Point-of-Use Reverse Osmosis Performance & Recovery Criteria (IS 16240: 2015)",
        source_id="SRC-BIS-16240",
        source_clause="Clause 5.2 - TDS Reduction & Pure Water Recovery",
        authority="Bureau of Indian Standards",
        verification_status="VERIFIED_OFFICIAL",
        output_requirement="Point-of-use RO water purifier must achieve minimum 90% TDS rejection and minimum 20% water recovery ratio under standard test conditions.",
        output_risk="Insufficient recovery efficiency or inadequate post-filtration mineral retention leads to rejection during mandatory NABL testing."
    ),

    # RULE-BIS-003: Polymeric Housing Flame Retardancy & Glow-Wire Test
    RuleDefinition(
        rule_id="RULE-BIS-003",
        rule_name="Polymer Enclosure Resistance to Heat and Fire",
        category="Materials & Enclosures",
        conditions=[
            RuleCondition(field="material_composition", operator="contains", value="polycarbonate"),
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

    # RULE-BIS-004: Drinking Water Safety Baseline (IS 10500)
    RuleDefinition(
        rule_id="RULE-BIS-004",
        rule_name="Output Potable Water Quality Parameters",
        category="Water Filtration",
        conditions=[
            RuleCondition(field="intended_use", operator="contains", value="domestic")
        ],
        logic_summary="IF Intended Application = Domestic Drinking Water THEN Output Must Meet Permissible Chemical & Microbiological Limits of IS 10500: 2012",
        source_id="SRC-BIS-10500",
        source_clause="Table 1 & 2 - Organoleptic, Physical, and Chemical Limits",
        authority="Bureau of Indian Standards",
        verification_status="VERIFIED_OFFICIAL",
        output_requirement="Effluent water must comply with drinking water thresholds for pH, turbidity, heavy metals, and zero E. coli / coliforms.",
        output_risk="Secondary leaching from internal cartridge adhesives or uncertified carbon blocks may introduce chemical impurities above IS 10500 limits."
    ),

    # RULE-BIS-020: MeitY CRS Registration for External Power Supply / Adapters
    RuleDefinition(
        rule_id="RULE-BIS-020",
        rule_name="Compulsory Registration Scheme (CRS) for Power Adapters",
        category="Electronics",
        conditions=[
            RuleCondition(field="power_consumption_num", operator="greater_than", value=20.0),
            RuleCondition(field="category", operator="contains", value="Electrical")
        ],
        logic_summary="IF Appliance Powered by Switched Mode Power Supply (SMPS) > 20W THEN Power Adapter Must Carry MeitY CRS BIS Registration Mark",
        source_id="SRC-MEITY-CRS",
        source_clause="Item 6 - Power Adapters for IT and AV Equipment",
        authority="Ministry of Electronics and Information Technology (MeitY) & BIS",
        verification_status="VERIFIED_OFFICIAL",
        output_requirement="The internal or external AC-DC power supply module must be independently registered under BIS Compulsory Registration Scheme (CRS).",
        output_risk="Using unbranded or uncertified SMPS modules will block overall product BIS certification even if the mechanical enclosure passes."
    )
]
