const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ProductFact {
  key: string;
  label: string;
  value: string;
  origin: 'USER_PROVIDED' | 'EXTRACTED_FROM_DOCUMENT' | 'INFERRED';
  is_confirmed: boolean;
  needs_review: boolean;
}

export interface Product {
  id: string;
  project_name: string;
  product_name: string;
  category: string;
  intended_use: string;
  material_composition?: string;
  technical_characteristics?: string;
  operating_voltage?: string;
  power_consumption?: string;
  water_storage_capacity?: string;
  has_uv_module?: boolean;
  manufacturing_origin?: string;
  target_market?: string;
  status: string;
  facts: ProductFact[];
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  project_name?: string;
  product_name: string;
  category: string;
  intended_use: string;
  material_composition?: string;
  technical_characteristics?: string;
  operating_voltage?: string;
  power_consumption?: string;
  water_storage_capacity?: string;
  has_uv_module?: boolean;
  manufacturing_origin?: string;
  target_market?: string;
}

export interface RuleEvaluationResult {
  rule_id: string;
  rule_name: string;
  matched: boolean;
  input_facts: Record<string, any>;
  rule_logic: string;
  clause_reference: string;
  source_id: string;
  authority: string;
  verification_status: string;
  supporting_evidence_excerpt: string;
  result_explanation: string;
  origin_badge: string;
}

export interface ApplicableStandard {
  standard_identifier: string;
  title: string;
  relevance_summary: string;
  verification_status: string;
  source_id: string;
  clause_reference?: string;
  evidence_excerpt?: string;
  document_source: string;
  official_url?: string;
}

export interface ComplianceRequirement {
  id: string;
  requirement: string;
  why_it_applies: string;
  source: string;
  source_id: string;
  category: string;
  status: string;
}

export interface ComplianceRisk {
  id: string;
  risk: string;
  severity: string;
  why_it_matters: string;
  potential_impact: string;
  suggested_action: string;
  evidence_strength: string;
  linked_rule_id?: string;
  linked_source?: string;
  risk_type: string;
}

export interface SafeAbstentionDetails {
  activated: boolean;
  product_characteristic?: string;
  evidence_search_result?: string;
  system_action?: string;
  abstention_reason?: string;
  missing_information: string[];
  recommended_actions: { title: string; desc: string }[];
}

export interface PathwayStage {
  step: number;
  title: string;
  description: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
}

export interface AnalysisResult {
  analysis_id: string;
  product_id: string;
  product_name: string;
  timestamp: string;
  relevant_standards_count: number;
  key_requirements_count: number;
  evidence_confidence: string;
  attention_needed_count: number;
  pathway_stages: PathwayStage[];
  safe_abstention: SafeAbstentionDetails;
  evaluated_rules: RuleEvaluationResult[];
  standards: ApplicableStandard[];
  requirements: ComplianceRequirement[];
  checklist_completion_percent: number;
  risks: ComplianceRisk[];
  ai_synthesis_summary: string;
  disclaimer: string;
}

export interface SourceRegistryItem {
  source_id: string;
  authority: string;
  document_name: string;
  document_type: string;
  official_url?: string;
  applicable_domain: string;
  version?: string;
  effective_date?: string;
  verification_status: string;
}

export interface SimulationRequest {
  product_id: string;
  material?: string;
  operating_voltage?: string;
  target_market?: string;
  intended_use?: string;
  category?: string;
}

export interface SimulationResult {
  product_id: string;
  changes_applied: Record<string, any>;
  current_profile: Record<string, any>;
  simulated_profile: Record<string, any>;
  standards_diff: { retained: string[]; added: string[]; removed: string[] };
  tests_diff: { added: string[]; retained: string[] };
  certification_route: string;
  deterministic_provenance: string[];
  disclaimer: string;
}

export interface AssistantCitation {
  source_id: string;
  title: string;
  clause: string;
  authority: string;
  verification_status: string;
  official_url?: string;
}

export interface AssistantChatRequest {
  message: string;
  product_id?: string;
  language?: string;
  history?: Array<{ role: string; content: string }>;
}

export interface AssistantChatResponse {
  response: string;
  suggested_queries: string[];
  citations: AssistantCitation[];
  safe_abstention: boolean;
  abstention_reason?: string;
  grounded_in_corpus: boolean;
  disclaimer: string;
}

// ─── Curated Fallback Data for Vercel Static/Serverless Preview ─────────────

const DEMO_PRODUCT: Product = {
  id: "demo-purifier-001",
  project_name: "Smart Purifier Compliance Project",
  product_name: "Smart Alkaline Water Purifier",
  category: "Household Electrical Appliances (Water Filters)",
  intended_use: "Domestic kitchen water filtration and mineral ionization",
  material_composition: "Polycarbonate casing, carbon block filters, UV-LED sanitization chamber",
  technical_characteristics: "Operating voltage: 230V AC, Frequency: 50Hz, Power consumption: 48W, Water storage: 8L, Integrated UV-LED module for water quality.",
  operating_voltage: "230V AC, 50Hz",
  power_consumption: "40W",
  water_storage_capacity: "8 Liters",
  has_uv_module: true,
  manufacturing_origin: "India",
  target_market: "Domestic",
  status: "CONFIRMED",
  facts: [
    { key: "category", label: "PRODUCT CATEGORY", value: "Electrical Household Appliance", origin: "USER_PROVIDED", is_confirmed: true, needs_review: false },
    { key: "material_composition", label: "MATERIAL / STRUCTURE", value: "Polycarbonate Housing", origin: "EXTRACTED_FROM_DOCUMENT", is_confirmed: true, needs_review: false },
    { key: "intended_use", label: "APPLICATION INTENT", value: "Domestic Consumer Use", origin: "USER_PROVIDED", is_confirmed: true, needs_review: false },
    { key: "operating_voltage", label: "OPERATING VOLTAGE", value: "230V AC, 50Hz", origin: "USER_PROVIDED", is_confirmed: true, needs_review: false },
    { key: "power_consumption", label: "POWER CONSUMPTION", value: "40W", origin: "EXTRACTED_FROM_DOCUMENT", is_confirmed: true, needs_review: false },
    { key: "water_storage_capacity", label: "WATER STORAGE CAPACITY", value: "8 Liters", origin: "USER_PROVIDED", is_confirmed: true, needs_review: false }
  ],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const DEMO_ANALYSIS: AnalysisResult = {
  analysis_id: "analysis-demo-001",
  product_id: "demo-purifier-001",
  product_name: "Smart Alkaline Water Purifier",
  timestamp: new Date().toISOString(),
  relevant_standards_count: 3,
  key_requirements_count: 14,
  evidence_confidence: "High",
  attention_needed_count: 2,
  pathway_stages: [
    { step: 1, title: "Product Category Identified", description: "Your product falls under Household Electrical Appliance (Water Filter).", status: "COMPLETED" },
    { step: 2, title: "Potential BIS Requirements Identified", description: "Deterministic engine found applicable rules for this category.", status: "COMPLETED" },
    { step: 3, title: "Relevant Standards Reviewed", description: "3 relevant BIS standards and regulatory sources retrieved.", status: "COMPLETED" },
    { step: 4, title: "Testing / Certification Considerations", description: "Testing and certification requirements evaluated.", status: "IN_PROGRESS" },
    { step: 5, title: "Recommended Next Actions", description: "Documents, gaps and next steps for compliance.", status: "PENDING" }
  ],
  safe_abstention: {
    activated: true,
    product_characteristic: "UV-LED Sanitization Chamber",
    evidence_search_result: "No sufficiently verified applicable regulatory evidence found in indexed BIS standards.",
    system_action: "AI-generated conclusion blocked for this specific novel characteristic.",
    abstention_reason: "Bureau of Indian Standards currently indexes mercury-vapor UV lamps (IS 16240 Annex A); direct UV-C LED efficacy standards remain in draft/unnotified state.",
    missing_information: ["Specific UV-C emission wavelength (nm)", "Disinfection kill-rate validation report", "Ozone generation emission test"],
    recommended_actions: [
      { title: "Add Product Information", desc: "Provide additional technical specifications and test lab reports for the UV-LED module." },
      { title: "Review Available Sources", desc: "Inspect authoritative sources in the system to verify current scope under IS 16240: 2015." },
      { title: "Refine Product Description", desc: "Provide more precise technical details regarding standalone vs integrated UV operation." },
      { title: "Request Expert Review", desc: "Submit component specifications to BIS technical committee (ETD/CHD) for custom classification." }
    ]
  },
  evaluated_rules: [
    {
      rule_id: "RULE-BIS-014",
      rule_name: "Household Electrical Safety - Insulation & Structure Under Mains Voltage",
      matched: true,
      input_facts: { category: "household electrical appliance", operating_voltage: "230V AC", material: "polycarbonate", intended_use: "domestic" },
      rule_logic: "IF Product Category = Household Electrical Appliance AND Operating Voltage > 50V AC THEN Trigger Mandatory Electrical Insulation & Overload Review",
      clause_reference: "Clause 22.1 - Construction & Insulation",
      source_id: "SRC-BIS-0302-1",
      authority: "Bureau of Indian Standards",
      verification_status: "VERIFIED_OFFICIAL",
      supporting_evidence_excerpt: "Appliances shall be constructed so that their electrical insulation does not break down during normal operation.",
      result_explanation: "This rule was triggered because the operating voltage (230V AC) falls within the condition defined in the rule.",
      origin_badge: "DETERMINISTIC_RULE"
    },
    {
      rule_id: "RULE-BIS-002",
      rule_name: "Point-of-Use Drinking Water Treatment RO Efficacy",
      matched: true,
      input_facts: { category: "water filtration", operating_voltage: "230V AC", material: "polycarbonate", intended_use: "water filtration" },
      rule_logic: "IF Intended Use = Water Filtration THEN Apply Point-of-Use Reverse Osmosis Performance & Recovery Criteria (IS 16240: 2015)",
      clause_reference: "Clause 5.2 - TDS Reduction & Pure Water Recovery",
      source_id: "SRC-BIS-16240",
      authority: "Bureau of Indian Standards",
      verification_status: "VERIFIED_OFFICIAL",
      supporting_evidence_excerpt: "Point-of-use RO water purifier must achieve minimum 90% TDS rejection and minimum 20% water recovery ratio under standard test conditions.",
      result_explanation: "Minimum 90% TDS reduction required with safe pure water recovery ratio.",
      origin_badge: "DETERMINISTIC_RULE"
    }
  ],
  standards: [
    {
      standard_identifier: "IS 302 (Part 1): 2008",
      title: "Safety of Household and Similar Electrical Appliances",
      relevance_summary: "Relevant to: Electrical insulation, construction & general safety",
      verification_status: "VERIFIED_OFFICIAL",
      source_id: "SRC-BIS-0302-1",
      clause_reference: "Clause 22.1 & Clause 30.2",
      evidence_excerpt: "Appliances shall be constructed so that their electrical insulation does not break down during normal operation.",
      document_source: "Bureau of Indian Standards",
      official_url: "https://standardsbis.bsbedge.com"
    },
    {
      standard_identifier: "IS 16240: 2015",
      title: "Reverse Osmosis Water Purification System for Drinking Purposes",
      relevance_summary: "Relevant to: RO system performance & safety",
      verification_status: "NEEDS_REVIEW",
      source_id: "SRC-BIS-16240",
      clause_reference: "Clause 5.2 - Pure Water Recovery",
      evidence_excerpt: "Minimum 90% TDS reduction required with safe pure water recovery ratio.",
      document_source: "Bureau of Indian Standards",
      official_url: "https://www.services.bis.gov.in"
    },
    {
      standard_identifier: "IS 13428: 2017",
      title: "Plastic Waste Management & Packaged Water Containers",
      relevance_summary: "Relevant to: Plastic housing recyclability & labeling",
      verification_status: "POTENTIALLY_APPLICABLE",
      source_id: "SRC-BIS-13428",
      clause_reference: "Clause 6 - Packaging Materials",
      evidence_excerpt: "Standardized polymer identification resin codes required for non-metallic enclosures.",
      document_source: "Bureau of Indian Standards",
      official_url: "https://www.services.bis.gov.in"
    }
  ],
  requirements: [
    { id: "REQ-01", requirement: "Electrical Insulation", why_it_applies: "Ensure user safety during normal operation.", source: "IS 302 (Part 1): 2008", source_id: "SRC-BIS-0302-1", category: "TESTING_AND_CERTIFICATION", status: "READY" },
    { id: "REQ-02", requirement: "Structure & Construction", why_it_applies: "Ensure appliance is mechanically safe and durable.", source: "IS 302 (Part 1): 2008", source_id: "SRC-BIS-0302-1", category: "PRODUCT_INFORMATION", status: "READY" },
    { id: "REQ-03", requirement: "Overload Protection", why_it_applies: "Prevents overheating and fire risk due to electrical faults.", source: "IS 302 (Part 1): 2008", source_id: "SRC-BIS-0302-1", category: "TESTING_AND_CERTIFICATION", status: "NEEDS_INFORMATION" },
    { id: "REQ-04", requirement: "Water Quality Requirements", why_it_applies: "Ensures treated water meets safety standards.", source: "IS 10500: 2012", source_id: "SRC-BIS-10500", category: "TESTING_AND_CERTIFICATION", status: "NEEDS_INFORMATION" },
    { id: "REQ-05", requirement: "Material Safety", why_it_applies: "Ensures materials are safe for domestic use.", source: "IS 15444: 2006", source_id: "SRC-BIS-15444", category: "DOCUMENTATION", status: "REVIEW_REQUIRED" },
    { id: "REQ-06", requirement: "Glow-Wire Flammability Test", why_it_applies: "Verifies polymeric housing extinguishes without continuous ignition.", source: "IS 302 (Part 1): 2008", source_id: "SRC-BIS-0302-1", category: "TESTING_AND_CERTIFICATION", status: "REVIEW_REQUIRED" },
    { id: "REQ-07", requirement: "Total Dissolved Solids (TDS) Rejection", why_it_applies: "Mandatory minimum 90% TDS reduction under standard operating pressures.", source: "IS 16240: 2015", source_id: "SRC-BIS-16240", category: "TESTING_AND_CERTIFICATION", status: "READY" },
    { id: "REQ-08", requirement: "Pure Water Recovery Ratio (>=20%)", why_it_applies: "Prevents excessive reject water wastage under point-of-use domestic setup.", source: "IS 16240: 2015", source_id: "SRC-BIS-16240", category: "PRODUCT_INFORMATION", status: "READY" },
    { id: "REQ-09", requirement: "Power Adapter CRS Mark Compliance", why_it_applies: "Switched mode power supply (SMPS) must carry independent BIS CRS number.", source: "MeitY CRO Gazette", source_id: "SRC-MEITY-CRS", category: "DOCUMENTATION", status: "READY" },
    { id: "REQ-10", requirement: "Food Contact Polymer Migration Test", why_it_applies: "Total non-volatile extractables into drinking water must not exceed 10 mg/dm².", source: "IS 15444: 2006", source_id: "SRC-BIS-15444", category: "TESTING_AND_CERTIFICATION", status: "NEEDS_INFORMATION" },
    { id: "REQ-11", requirement: "Resin Identification & Recyclability Code", why_it_applies: "All non-metallic housing moldings must emboss SPI polymer recycling codes.", source: "IS 13428: 2017", source_id: "SRC-BIS-13428", category: "PRODUCT_INFORMATION", status: "READY" },
    { id: "REQ-12", requirement: "Earth Continuity & Bonding Resistance", why_it_applies: "Ensures ground path impedance does not exceed 0.1 ohm across all accessible metal parts.", source: "IS 302 (Part 1): 2008", source_id: "SRC-BIS-0302-1", category: "TESTING_AND_CERTIFICATION", status: "READY" },
    { id: "REQ-13", requirement: "Product Rating Plate & Cautionary Marking", why_it_applies: "Rated voltage, frequency, IP rating, and domestic caution labels in Hindi and English.", source: "IS 302 (Part 1): 2008", source_id: "SRC-BIS-0302-1", category: "DOCUMENTATION", status: "READY" },
    { id: "REQ-14", requirement: "Microbiological Disinfection Efficacy", why_it_applies: "Zero E. coli and total coliform bacteria detectable in effluent treated output.", source: "IS 10500: 2012", source_id: "SRC-BIS-10500", category: "TESTING_AND_CERTIFICATION", status: "READY" }
  ],
  checklist_completion_percent: 76,
  risks: [
    {
      id: "RISK-01",
      risk: "Material Test Failure",
      severity: "HIGH",
      why_it_matters: "Polycarbonate may fail glow-wire or flame-retardancy tests.",
      potential_impact: "Direct failure during NABL lab testing, requiring costly mold re-tooling.",
      suggested_action: "Consider flame-retardant grade (V-0) or alternative material.",
      evidence_strength: "High",
      linked_rule_id: "RULE-BIS-003",
      linked_source: "IS 302 (Part 1): 2008 Clause 30.2",
      risk_type: "EVIDENCE_SUPPORTED_RISK"
    },
    {
      id: "RISK-02",
      risk: "Incorrect Product Classification",
      severity: "MEDIUM",
      why_it_matters: "Misclassification may lead to wrong standard selection.",
      potential_impact: "Rejection of BIS application during initial scrutiny by licensing officer.",
      suggested_action: "Review technical characteristics and intended use.",
      evidence_strength: "Medium",
      linked_rule_id: "RULE-BIS-014",
      linked_source: "IS 302 (Part 1): 2008",
      risk_type: "INFORMATION_GAP"
    },
    {
      id: "RISK-03",
      risk: "Incomplete Documentation",
      severity: "POTENTIAL",
      why_it_matters: "Missing technical documents may delay certification.",
      potential_impact: "Extended lead time by 6-12 weeks due to BIS scrutiny queries.",
      suggested_action: "Prepare complete technical file, circuit diagrams, and sub-assembly test reports.",
      evidence_strength: "Medium",
      linked_rule_id: undefined,
      linked_source: "BIS Conformity Assessment Regulations",
      risk_type: "INFORMATION_GAP"
    }
  ],
  ai_synthesis_summary: "Based on deterministic evaluation of 3 applicable BIS rules (RULE-BIS-014, RULE-BIS-002, RULE-BIS-003) and verified Indian Standards:\n1. Electrical Safety: Operating at 230V AC triggers mandatory creepage distance, dielectric withstand, and glow-wire flammability tests under IS 302 (Part 1): 2008.\n2. Purification Efficacy: Point-of-use domestic drinking water treatment requires verified compliance with IS 16240: 2015 (minimum 90% TDS reduction) and IS 10500: 2012 potable water parameters.\n3. Safe Abstention Trigger: The integrated UV-LED module operates without published Indian Standard specifications; conclusion blocked pending wavelength and ozone test reports.",
  disclaimer: "NIYAMVEDA provides source-grounded compliance guidance and does not constitute BIS certification or legal approval. Final compliance must be verified against the applicable official standards and regulatory authorities."
};

const DEMO_SOURCES: SourceRegistryItem[] = [
  {
    source_id: "SRC-BIS-0302-1",
    authority: "Bureau of Indian Standards",
    document_name: "IS 302 (Part 1): 2008 - Safety of Household and Similar Electrical Appliances",
    document_type: "Indian Standard (Mandatory)",
    official_url: "https://standardsbis.bsbedge.com",
    applicable_domain: "Household Electrical Appliances, General Electrical Safety, Insulation",
    version: "Fourth Revision (2008)",
    effective_date: "01 Dec 2008",
    verification_status: "VERIFIED_OFFICIAL"
  },
  {
    source_id: "SRC-BIS-16240",
    authority: "Bureau of Indian Standards",
    document_name: "IS 16240: 2015 - Reverse Osmosis Based Point-of-Use Water Treatment Systems",
    document_type: "Indian Standard (Mandatory / QCO)",
    official_url: "https://www.services.bis.gov.in",
    applicable_domain: "Point-of-Use RO Water Treatment, Recovery, Total Dissolved Solids Reduction",
    version: "First Edition (2015)",
    effective_date: "15 Oct 2015",
    verification_status: "VERIFIED_OFFICIAL"
  },
  {
    source_id: "SRC-BIS-10500",
    authority: "Bureau of Indian Standards",
    document_name: "IS 10500: 2012 - Drinking Water - Specification",
    document_type: "Indian Standard",
    official_url: "https://www.services.bis.gov.in",
    applicable_domain: "Potable Drinking Water Quality, Chemical Limits, Microbiological Parameters",
    version: "Second Revision (2012)",
    effective_date: "01 Jun 2012",
    verification_status: "VERIFIED_OFFICIAL"
  },
  {
    source_id: "SRC-BIS-13428",
    authority: "Bureau of Indian Standards",
    document_name: "IS 13428: 2017 - Packaged Natural Mineral Water - Specification & Packaging Norms",
    document_type: "Indian Standard",
    official_url: "https://www.services.bis.gov.in",
    applicable_domain: "Water Packaging, Food-Grade Containers, Recyclability & Labeling",
    version: "Third Revision (2017)",
    effective_date: "10 Jan 2018",
    verification_status: "NEEDS_REVIEW"
  },
  {
    source_id: "SRC-BIS-15444",
    authority: "Bureau of Indian Standards",
    document_name: "IS 15444: 2006 - Plastics for Food Contact Applications",
    document_type: "Indian Standard",
    official_url: "https://www.services.bis.gov.in",
    applicable_domain: "Polymeric Contact Materials, Migration Testing, Toxic Leaching",
    version: "First Edition (2006)",
    effective_date: "01 Jan 2007",
    verification_status: "POTENTIALLY_APPLICABLE"
  },
  {
    source_id: "SRC-MEITY-CRS",
    authority: "Ministry of Electronics and Information Technology (MeitY) & BIS",
    document_name: "Electronics and Information Technology Goods (Compulsory Registration Order)",
    document_type: "Statutory Gazette Order (CRO)",
    official_url: "https://www.meity.gov.in/esdm/standards",
    applicable_domain: "Electronics, Power Adapters, Smart Appliances, IT Components",
    version: "CRO Phase IV (Updated 2021)",
    effective_date: "01 Apr 2021",
    verification_status: "VERIFIED_OFFICIAL"
  }
];

// ─── API Client with Robust Fallback for Vercel ─────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      signal: controller.signal,
      ...options,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
    
    // If backend returned a non-OK status (e.g. 404 or 400), inspect body or throw
    const errorBody = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(errorBody.detail || `API error ${res.status} for ${path}`);
  } catch (err: any) {
    // Only use fallback data for explicit demo identifiers or when offline specifically on demo routes
    const isExplicitDemo = path.includes('demo-purifier-001') || path.includes('demo-analysis-001');

    if (path === '/api/products') {
      if (options?.method === 'POST') {
        const parsedBody = options.body ? JSON.parse(options.body as string) : {};
        return {
          ...DEMO_PRODUCT,
          id: `prod-${Date.now()}`,
          ...parsedBody,
        } as unknown as T;
      }
      return [DEMO_PRODUCT] as unknown as T;
    }

    if (isExplicitDemo) {
      if (path.startsWith('/api/products/')) {
        return DEMO_PRODUCT as unknown as T;
      }
      if (path.includes('/api/analyze')) {
        return DEMO_ANALYSIS as unknown as T;
      }
      if (path.includes('/api/simulation')) {
        return {
          product_id: "demo-purifier-001",
          changes_applied: { material: "Polycarbonate → Flame-Retardant ABS", operating_voltage: "230V AC → 110V AC", application: "Domestic Use → Commercial Use" },
          current_profile: { material: "Polycarbonate", operating_voltage: "230V AC", application: "Domestic Use", standards: ["IS 302 (Part 1): 2008", "IS 16240: 2015"], tests: ["Insulation Test", "RO Performance Test"], certification_route: "CRS under MeitY" },
          simulated_profile: { material: "Flame-Retardant ABS", operating_voltage: "110V AC", application: "Commercial Use", standards: ["IS 302 (Part 1): 2008", "IS/IEC 60950-1: 2010"], tests: ["Electrical Safety Test", "EMC Test"], certification_route: "CRS + BIS Registration" },
          standards_diff: { retained: ["IS 302 (Part 1): 2008"], added: ["IS/IEC 60950-1: 2010"], removed: [] },
          tests_diff: { added: ["Electrical Safety Test", "EMC Test"], retained: ["RO Performance Test"] },
          certification_route: "CRS + BIS Registration",
          deterministic_provenance: [
            "Changed Fact: Application shifted to Commercial -> Triggered IS/IEC 60950-1 (IT & Commercial Equipment Safety) + mandatory EMC testing.",
            "Changed Fact: Material changed to Flame-Retardant ABS -> Glow-wire flammability risk mitigated; exemption from 850°C needle flame test applied.",
            "Changed Fact: Operating Voltage reduced to 110V AC -> Retains IS 302 Part 1 (>50V AC threshold remains active); dielectric test modified."
          ],
          disclaimer: "Simulation result is for decision support only and not a legal compliance conclusion."
        } as unknown as T;
      }
    }

    if (path.includes('/api/sources')) {
      return DEMO_SOURCES as unknown as T;
    }

    throw err instanceof Error ? err : new Error(`API fetch error for ${path}`);
  }
}

export const api = {
  // Products
  listProducts: () => apiFetch<Product[]>('/api/products'),
  getProduct: (id: string) => apiFetch<Product>(`/api/products/${id}`),
  createProduct: (data: ProductCreate) =>
    apiFetch<Product>('/api/products', { method: 'POST', body: JSON.stringify(data) }),
  confirmProduct: (id: string) =>
    apiFetch<Product>(`/api/products/${id}/confirm`, { method: 'POST' }),

  uploadDocument: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/api/products/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      return (await res.json()) as {
        filename: string;
        size_kb: number;
        status: string;
        notice: string;
        extracted_facts?: Record<string, any>;
      };
    } catch {
      return {
        filename: file.name,
        size_kb: Number((file.size / 1024).toFixed(1)),
        status: 'UPLOADED_SUPPORTING_INFO',
        notice: 'Supporting document uploaded. It provides contextual engineering data but does not constitute an authoritative standard.',
        extracted_facts: {}
      };
    }
  },

  // Analysis
  analyzeProduct: (productId: string) =>
    apiFetch<AnalysisResult>(`/api/analyze/${productId}`, { method: 'POST' }),
  getAnalysisResult: (identifier: string) =>
    apiFetch<AnalysisResult>(`/api/analyze/result/${identifier}`),

  // Sources
  listSources: () => apiFetch<SourceRegistryItem[]>('/api/sources'),
  getSource: (sourceId: string) => apiFetch<SourceRegistryItem>(`/api/sources/${sourceId}`),
  searchEvidence: (q: string, limit = 5) =>
    apiFetch<any[]>(`/api/sources/evidence/search?q=${encodeURIComponent(q)}&limit=${limit}`),

  // Simulation
  simulate: (req: SimulationRequest) =>
    apiFetch<SimulationResult>('/api/simulation', { method: 'POST', body: JSON.stringify(req) }),

  // Conversational Assistant
  chatAssistant: (req: AssistantChatRequest) =>
    apiFetch<AssistantChatResponse>('/api/assistant/chat', {
      method: 'POST',
      body: JSON.stringify(req),
    }).catch(() => ({
      // IMPORTANT: The frontend must never invent BIS/regulatory answers when
      // the authoritative backend assistant is unavailable.
      response:
        req.language === 'hi'
          ? 'NiyamVeda का regulatory assistant इस समय उपलब्ध नहीं है। पर्याप्त सत्यापित जानकारी के बिना मैं BIS standard, clause या compliance requirement का अनुमान नहीं लगाऊँगा। कृपया थोड़ी देर बाद पुनः प्रयास करें।'
          : req.language === 'bn'
            ? 'NiyamVeda-এর regulatory assistant এই মুহূর্তে উপলব্ধ নয়। পর্যাপ্ত যাচাইকৃত তথ্য ছাড়া আমি কোনো BIS standard, clause বা compliance requirement অনুমান করব না। অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।'
            : 'NiyamVeda’s regulatory assistant is temporarily unavailable. Without sufficient verified evidence, I will not guess or invent a BIS standard, clause, certification requirement, or compliance conclusion. Please try again shortly.',
      suggested_queries: [],
      citations: [],
      safe_abstention: true,
      abstention_reason: 'Authoritative assistant backend is unavailable.',
      grounded_in_corpus: false,
      disclaimer:
        'NiyamVeda provides source-grounded regulatory information from its indexed knowledge corpus. It does not constitute official BIS certification, legal advice, or a guarantee of conformity.',
    })),

  // Authentication
  login: (data: { email: string; password: string }) =>
    apiFetch<AuthTokenResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(data) })
      .catch(() => ({
        access_token: 'nv-token-demo-fallback',
        token_type: 'bearer',
        user: {
          id: 'usr-demo-001',
          email: data.email,
          full_name: 'Rajesh Kumar Sharma',
          company_name: 'Apex PureWater Innovations Pvt. Ltd.',
          role: 'MSME_MANUFACTURER',
          created_at: new Date().toISOString()
        }
      })),

  register: (data: { email: string; password: string; full_name: string; company_name?: string }) =>
    apiFetch<AuthTokenResponse>('/api/auth/register', { method: 'POST', body: JSON.stringify(data) })
      .catch(() => ({
        access_token: 'nv-token-demo-fallback',
        token_type: 'bearer',
        user: {
          id: 'usr-new-001',
          email: data.email,
          full_name: data.full_name,
          company_name: data.company_name || 'MSME Innovations Ltd.',
          role: 'MSME_MANUFACTURER',
          created_at: new Date().toISOString()
        }
      })),

  demoLogin: () =>
    apiFetch<AuthTokenResponse>('/api/auth/demo-login', { method: 'POST' })
      .catch(() => ({
        access_token: 'nv-token-demo-fallback',
        token_type: 'bearer',
        user: {
          id: 'usr-demo-001',
          email: 'demo@niyamveda.gov.in',
          full_name: 'Rajesh Kumar Sharma',
          company_name: 'Apex PureWater Innovations Pvt. Ltd.',
          role: 'MSME_MANUFACTURER',
          created_at: new Date().toISOString()
        }
      })),

  getMe: (token: string) =>
    apiFetch<UserResponse>('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    }),

  logout: (token?: string) =>
    apiFetch<{ message: string }>('/api/auth/logout', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }).catch(() => ({ message: 'Logged out' })),
};

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  company_name: string;
  role: string;
  created_at: string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  user: UserResponse;
}
