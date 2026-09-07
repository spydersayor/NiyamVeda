export type SupportedLanguage = 'en' | 'hi' | 'bn';

export interface Translations {
  // Navigation
  nav_how_it_works: string;
  nav_sources: string;
  nav_about_us: string;
  nav_assistant: string;
  nav_profile: string;
  nav_sign_in: string;
  nav_sign_out: string;
  nav_start_analysis: string;
  nav_start: string;
  nav_tagline: string;
  nav_profile_tooltip: string;
  theme_toggle_dark: string;
  theme_toggle_light: string;
  theme_toggle_aria: string;
  language_selector: string;

  // Common UI
  common_save: string;
  common_cancel: string;
  common_close: string;
  common_continue: string;
  common_back: string;
  common_loading: string;
  common_verified: string;
  common_clear: string;
  common_status: string;
  common_action: string;
  common_processing: string;
  common_start: string;
  common_home: string;

  // Sidebar Tooltips
  sidebar_product: string;
  sidebar_analysis: string;
  sidebar_why_rule: string;
  sidebar_inspector: string;
  sidebar_standards: string;
  sidebar_requirements: string;
  sidebar_risks: string;
  sidebar_simulation: string;
  sidebar_sources: string;
  sidebar_abstention: string;

  // Profile & Preferences
  profile_title: string;
  profile_desc: string;
  profile_account_security: string;
  profile_preferences: string;
  profile_my_products: string;
  profile_auth_required_title: string;
  profile_auth_required_desc: string;
  profile_btn_signin: string;
  profile_btn_demo: string;
  profile_joined: string;
  profile_active_member: string;
  profile_btn_new_project: string;
  profile_sec_pwd_title: string;
  profile_sec_pwd_desc: string;
  profile_sec_pwd_badge: string;
  profile_sec_session_title: string;
  profile_sec_session_desc: string;
  profile_sec_session_badge: string;
  profile_sec_token_title: string;
  profile_sec_token_desc: string;
  profile_sec_token_badge: string;
  profile_pref_lang: string;
  profile_pref_theme: string;
  profile_theme_dark: string;
  profile_theme_light: string;
  profile_copilot_title: string;
  profile_copilot_desc: string;
  profile_copilot_launch: string;
  profile_products_sub: string;
  profile_products_count: string;
  profile_loading_products: string;
  profile_no_products_title: string;
  profile_no_products_desc: string;
  profile_add_first_product: string;
  profile_voltage_na: string;
  profile_btn_analysis: string;
  profile_btn_whatif: string;
  profile_btn_chat: string;
  profile_chat_tooltip: string;
  profile_fact_material: string;
  profile_fact_power: string;
  profile_fact_origin: string;
  profile_inspect_facts: string;

  // Assistant & Drawer
  assistant_title: string;
  assistant_subtitle: string;
  assistant_placeholder: string;
  assistant_send: string;
  assistant_quick_queries: string;
  assistant_select_product: string;
  assistant_no_product: string;
  assistant_citations: string;
  assistant_abstention_badge: string;
  assistant_disclaimer: string;
  assistant_grounded_badge: string;
  assistant_insufficient_badge: string;
  assistant_evasion_badge: string;
  assistant_context_active: string;
  assistant_eval_against: string;
  assistant_clear_context: string;
  assistant_official_source: string;
  assistant_verified_badge: string;
  assistant_loading: string;
  assistant_error_connect: string;
  assistant_page_loading: string;
  drawer_btn_ask: string;
  drawer_title: string;
  drawer_context_label: string;
  drawer_fullscreen: string;
  drawer_verified_sources: string;
  drawer_checking: string;
  drawer_chip_standards: string;
  drawer_chip_tests: string;
  drawer_chip_crs: string;
  drawer_placeholder: string;
  drawer_welcome_generic: string;
  drawer_welcome_product: string;

  // Hero & Landing
  hero_badge_ai: string;
  hero_badge_rule: string;
  hero_badge_source: string;
  hero_title_prefix: string;
  hero_title_middle: string;
  hero_title_suffix: string;
  hero_subtext: string;
  btn_analyse_product: string;
  btn_explore_how_it_works: string;
  badge_msme: string;
  steps_heading: string;
  step_1_title: string;
  step_1_desc: string;
  step_2_title: string;
  step_2_desc: string;
  step_3_title: string;
  step_3_desc: string;
  step_4_title: string;
  step_4_desc: string;
  badge_evidence: string;
  badge_source_traceable: string;
  badge_rule_based: string;
  badge_msme_friendly: string;

  // Analysis Dashboard
  metric_relevant_standards: string;
  metric_key_requirements: string;
  metric_evidence_confidence: string;
  metric_attention_needed: string;
  metric_identified: string;
  metric_criteria: string;
  metric_areas: string;
  summary_heading: string;
  summary_subheading: string;
  attention_heading: string;
  attention_subheading: string;
  attention_all_clear: string;
  why_applies_heading: string;
  why_applies_subheading: string;
  pathway_heading: string;
  btn_view_detailed_analysis: string;
  btn_inspect_rule: string;
  status_completed: string;
  status_in_progress: string;
  status_pending: string;
  analysis_strong: string;
  analysis_moderate: string;
  analysis_abstaining: string;
  analysis_preliminary: string;
  analysis_ready: string;
  analysis_ask_copilot: string;
  analysis_standards_identified: string;
  analysis_statutory_reqs: string;
  analysis_requiring_attention: string;
  analysis_action_items: string;
  analysis_action_required: string;
  analysis_all_clear_badge: string;
  analysis_incomplete_params: string;
  analysis_category: string;
  analysis_status: string;
  analysis_risk: string;
  analysis_mitigation: string;
  analysis_modal_view: string;
  analysis_physical_facts: string;
  analysis_deterministic_badge: string;
  analysis_product_facts: string;
  analysis_view_inspector: string;
  analysis_rule_provenance: string;
  analysis_modal_close: string;
  analysis_default_eval: string;

  // Forms & PDF Extraction
  form_product_def: string;
  form_product_name: string;
  form_category: string;
  form_intended_use: string;
  form_operating_voltage: string;
  form_power_consumption: string;
  form_water_storage: string;
  form_material_comp: string;
  form_tech_specs: string;
  pdf_upload_title: string;
  pdf_upload_prompt: string;
  pdf_verification_title: string;
  pdf_verification_notice: string;
  btn_confirm_facts: string;
  btn_submit_analysis: string;
  btn_save_continue: string;
  btn_back: string;

  // Product New Form
  product_new_step_1: string;
  product_new_step_2: string;
  product_new_step_3: string;
  product_new_step_4: string;
  product_new_step_5: string;
  product_new_title: string;
  product_new_name_label: string;
  product_new_cat_label: string;
  product_new_cat_household: string;
  product_new_cat_electronics: string;
  product_new_cat_plastic: string;
  product_new_use_label: string;
  product_new_mat_label: string;
  product_new_tech_label: string;
  product_new_docs_title: string;
  product_new_docs_optional: string;
  product_new_docs_attached: string;
  product_new_docs_file: string;
  product_new_docs_files: string;
  product_new_upload_drag: string;
  product_new_upload_hint: string;
  product_new_uploading: string;
  product_new_verified: string;
  product_new_remove_file: string;
  product_new_disclaimer: string;
  product_new_pdf_verify_title: string;
  product_new_pdf_extracted_badge: string;
  product_new_pdf_verify_notice: string;
  product_new_voltage_label: string;
  product_new_power_label: string;
  product_new_capacity_label: string;
  product_new_material_label: string;
  product_new_btn_confirm_facts: string;
  product_new_verified_success: string;
  product_new_btn_save_draft: string;
  product_new_btn_continue: string;
  product_new_file_limit_err: string;
  product_new_file_fail_err: string;

  // Product Facts Confirmation
  confirm_step_badge: string;
  confirm_title: string;
  confirm_subtitle: string;
  confirm_origin_extracted: string;
  confirm_origin_manufacturer: string;
  confirm_notice: string;
  confirm_btn_upload_another: string;
  confirm_btn_run_analysis: string;
  confirm_evaluating: string;

  // Simulation
  sim_title: string;
  sim_subtitle: string;
  sim_current_profile: string;
  sim_result_profile: string;
  sim_btn_run: string;
  sim_diff_standards: string;
  sim_retained: string;
  sim_added: string;
  sim_removed: string;
  sim_provenance: string;
  sim_header_title: string;
  sim_header_desc: string;
  sim_change_attrs: string;
  sim_attr_material: string;
  sim_attr_voltage: string;
  sim_attr_use: string;
  sim_btn_recalculate: string;
  sim_simulating: string;
  sim_impact_summary: string;
  sim_provenance_note: string;

  // Sources Directory Page
  sources_title: string;
  sources_subtitle: string;
  sources_search_placeholder: string;
  sources_loading: string;
  sources_scope: string;
  sources_effective: string;
  sources_enforced: string;
  sources_portal_link: string;
  sources_no_results: string;

  // Auth Page
  auth_portal_subtitle: string;
  auth_demo_badge: string;
  auth_demo_desc: string;
  auth_demo_btn: string;
  auth_tab_login: string;
  auth_tab_register: string;
  auth_full_name: string;
  auth_full_name_placeholder: string;
  auth_username: string;
  auth_username_placeholder: string;
  auth_company_name: string;
  auth_company_placeholder: string;
  auth_email: string;
  auth_email_placeholder: string;
  auth_password: string;
  auth_password_placeholder: string;
  auth_btn_login: string;
  auth_btn_register: string;
  auth_err_email_invalid: string;
  auth_err_fullname_invalid: string;
  auth_err_username_invalid: string;
  auth_err_username_taken: string;
  auth_err_generic: string;
  auth_err_demo: string;
  auth_card_role: string;
  auth_card_start: string;
  auth_card_signout: string;
  profile_label_username: string;
  profile_label_fullname: string;

  // Standards Page
  standards_title: string;
  standards_subtitle: string;
  standards_insufficient_title: string;
  standards_insufficient_desc: string;
  standards_badge_mandatory: string;
  standards_badge_gazette: string;
  standards_view_source: string;
  standards_why_applies: string;

  // Requirements Page
  req_title: string;
  req_completed: string;
  req_col_req: string;
  req_col_why: string;
  req_col_source: string;
  req_col_status: string;
  req_no_reqs: string;
  req_status_verified: string;
  req_status_action: string;
  req_status_pending: string;

  // Risks Page
  risks_title: string;
  risks_subtitle: string;
  risks_no_risks_title: string;
  risks_no_risks_desc: string;
  risks_why_matters: string;
  risks_suggested_action: string;
  risks_severity_high: string;
  risks_severity_medium: string;
  risks_severity_low: string;

  // Product Evidence Trail
  evidence_title: string;
  evidence_subtitle: string;
  evidence_rule_label: string;
  evidence_clause_citations: string;
  evidence_official_text: string;
  evidence_open_portal: string;
  evidence_rule_logic: string;

  // Why Rule Applies & Rule Inspector
  why_rule_title: string;
  why_rule_step_fact: string;
  why_rule_step_rule: string;
  why_rule_step_evidence: string;
  why_rule_step_conclusion: string;
  why_rule_btn_inspector: string;
  why_rule_btn_close: string;
  inspector_title: string;
  inspector_logic: string;
  inspector_evidence: string;
  inspector_sources: string;
  inspector_close: string;
  // Rule Inspector & Evidence Labels (used in analysis, sources, standards modals)
  rule_inspector_heading: string;
  inspector_verified_badge: string;
  inspector_outcome_heading: string;
  inspector_logic_heading: string;
  inspector_authoritative_badge: string;
  evidence_clause_label: string;
  evidence_source_label: string;
  evidence_excerpt_label: string;
  evidence_view_full_source: string;

  // Safe Abstention
  abstention_title: string;
  abstention_desc: string;
  abstention_badge: string;
  abstention_prod_char: string;
  abstention_evidence_result: string;
  abstention_why_safe: string;
  abstention_why_safe_desc: string;
  abstention_btn_back: string;
  abstention_btn_edit: string;

  // Footer
  footer_disclaimer: string;
  footer_rights: string;
  footer_academic_note: string;

  // About Page
  about_badge: string;
  about_project: string;
  about_title: string;
  about_intro: string;
  about_challenge_title: string;
  about_challenge_intro: string;
  about_challenge_1_title: string;
  about_challenge_1_text: string;
  about_challenge_2_title: string;
  about_challenge_2_text: string;
  about_challenge_3_title: string;
  about_challenge_3_text: string;
  about_approach_title: string;
  about_approach_intro: string;
  about_approach_1_title: string;
  about_approach_1_text: string;
  about_approach_2_title: string;
  about_approach_2_text: string;
  about_approach_3_title: string;
  about_approach_3_text: string;
  about_core_principle: string;
  about_parameter_title: string;
  about_parameter_text_1: string;
  about_parameter_text_2: string;
  about_architecture_title: string;
  about_architecture_desc: string;
  about_pillar_1_title: string;
  about_pillar_1_subtitle: string;
  about_pillar_1_desc: string;
  about_pillar_2_title: string;
  about_pillar_2_subtitle: string;
  about_pillar_2_desc: string;
  about_pillar_3_title: string;
  about_pillar_3_subtitle: string;
  about_pillar_3_desc: string;
  about_pillar_4_title: string;
  about_pillar_4_subtitle: string;
  about_pillar_4_desc: string;
  about_scope_label: string;
  about_mission_title: string;
  about_mission_text: string;
  about_how_link: string;
  about_sources_link: string;

  // How It Works Page
  how_badge: string;
  how_project: string;
  how_title: string;
  how_intro: string;
  how_engine_label: string;
  how_dynamic_title: string;
  how_dynamic_text: string;
  how_test_product: string;
  how_live_demo: string;
  how_dataflow: string;
  how_pipeline_title: string;
  how_pipeline_desc: string;
  how_rag_badge: string;
  how_operates: string;
  how_abstention_badge: string;
  how_abstention_title: string;
  how_abstention_text: string;
  how_whatif_label: string;
  how_whatif_title: string;
  how_whatif_text: string;
  how_whatif_button: string;

  // How It Works Steps
  how_step_1_title: string;
  how_step_1_cat: string;
  how_step_1_desc: string;
  how_step_1_detail: string;
  how_step_2_title: string;
  how_step_2_cat: string;
  how_step_2_desc: string;
  how_step_2_detail: string;
  how_step_3_title: string;
  how_step_3_cat: string;
  how_step_3_desc: string;
  how_step_3_detail: string;
  how_step_4_title: string;
  how_step_4_cat: string;
  how_step_4_desc: string;
  how_step_4_detail: string;
  how_step_5_title: string;
  how_step_5_cat: string;
  how_step_5_desc: string;
  how_step_5_detail: string;
  how_step_6_title: string;
  how_step_6_cat: string;
  how_step_6_desc: string;
  how_step_6_detail: string;
  how_step_7_title: string;
  how_step_7_cat: string;
  how_step_7_desc: string;
  how_step_7_detail: string;
  how_step_8_title: string;
  how_step_8_cat: string;
  how_step_8_desc: string;
  how_step_8_detail: string;

  // How It Works Flow Pills
  how_flow_1: string;
  how_flow_2: string;
  how_flow_3: string;
  how_flow_4: string;
  how_flow_5: string;
  how_flow_6: string;
  how_flow_7: string;
  how_flow_8: string;
}

export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    // Navigation
    nav_how_it_works: 'How It Works',
    nav_sources: 'Sources',
    nav_about_us: 'About Us',
    nav_assistant: 'AI Assistant',
    nav_profile: 'Profile',
    nav_sign_in: 'Sign In',
    nav_sign_out: 'Sign Out',
    nav_start_analysis: 'Start Analysis',
    nav_start: 'Start',
    nav_tagline: 'From Product to Compliance Clarity',
    nav_profile_tooltip: 'View Profile & Products',
    theme_toggle_dark: 'Switch to Dark Mode',
    theme_toggle_light: 'Switch to Light Mode',
    theme_toggle_aria: 'Toggle Theme',
    language_selector: 'Language',

    // Common UI
    common_save: 'Save',
    common_cancel: 'Cancel',
    common_close: 'Close',
    common_continue: 'Continue',
    common_back: 'Back',
    common_loading: 'Loading...',
    common_verified: 'Verified',
    common_clear: 'Clear',
    common_status: 'Status',
    common_action: 'Action',
    common_processing: 'Processing...',
    common_start: 'Start',
    common_home: 'Home',

    // Sidebar Tooltips
    sidebar_product: 'Product Facts',
    sidebar_analysis: 'Pathway Dashboard',
    sidebar_why_rule: 'Why This Rule Applies',
    sidebar_inspector: 'Rule Inspector',
    sidebar_standards: 'Relevant Standards',
    sidebar_requirements: 'Requirements Checklist',
    sidebar_risks: 'Potential Risks',
    sidebar_simulation: 'What-If Simulation',
    sidebar_sources: 'Evidence Trail',
    sidebar_abstention: 'Safe Abstention',

    // Profile & Preferences
    profile_title: 'MSME Manufacturer Profile',
    profile_desc: 'Manage your organization details, registered products, and regulatory preferences.',
    profile_account_security: 'Account Security',
    profile_preferences: 'Interface Preferences',
    profile_my_products: 'Your Registered Products',
    profile_auth_required_title: 'Authentication Required',
    profile_auth_required_desc: 'Please sign in or use demo evaluation access to view your organization profile and products.',
    profile_btn_signin: 'Sign In to Your Account',
    profile_btn_demo: 'Instant Evaluator Demo Access',
    profile_joined: 'Joined',
    profile_active_member: 'Active Member',
    profile_btn_new_project: 'New Compliance Project',
    profile_sec_pwd_title: 'Password Authentication',
    profile_sec_pwd_desc: 'Salted password authentication active',
    profile_sec_pwd_badge: 'SECURE',
    profile_sec_session_title: 'Session Management',
    profile_sec_session_desc: 'Server-side hashed session token',
    profile_sec_session_badge: 'ACTIVE',
    profile_sec_token_title: 'Token Expiry Window',
    profile_sec_token_desc: 'Automatic 24-hour expiration check',
    profile_sec_token_badge: '24 HOURS',
    profile_pref_lang: 'System Language / भाषा',
    profile_pref_theme: 'Appearance / Theme',
    profile_theme_dark: 'Dark Mode',
    profile_theme_light: 'Light Mode',
    profile_copilot_title: 'Regulatory Copilot',
    profile_copilot_desc: 'Have queries on IS 302, IS 16240, dry-boil requirements, or MeitY CRS registration?',
    profile_copilot_launch: 'Launch Conversational Assistant',
    profile_products_sub: 'Evaluated products, deterministic rule findings, and active compliance dossiers.',
    profile_products_count: 'Products',
    profile_loading_products: 'Loading your compliance dossiers...',
    profile_no_products_title: 'No products registered yet',
    profile_no_products_desc: 'Add your electrical appliance or hardware product to evaluate applicable BIS standards and build a verified compliance pathway.',
    profile_add_first_product: 'Add Your First Product',
    profile_voltage_na: 'Voltage not specified',
    profile_btn_analysis: 'Analysis',
    profile_btn_whatif: 'What-If',
    profile_btn_chat: 'Chat',
    profile_chat_tooltip: 'Chat with Assistant with this product context',
    profile_fact_material: 'Material:',
    profile_fact_power: 'Power:',
    profile_fact_origin: 'Origin:',
    profile_inspect_facts: 'Inspect Confirmed Facts',

    // Assistant & Drawer
    assistant_title: 'NiyamVeda AI Regulatory Assistant',
    assistant_subtitle: 'Source-grounded compliance intelligence based on Indian Standards (BIS) and Quality Control Orders.',
    assistant_placeholder: 'Ask about BIS standards, electric kettles, RO purifiers, stainless steel cookware...',
    assistant_send: 'Send Inquiry',
    assistant_quick_queries: 'Suggested Regulatory Queries',
    assistant_select_product: 'Link Product Context',
    assistant_no_product: 'General BIS Query (No specific product)',
    assistant_citations: 'Authoritative Standard Citations',
    assistant_abstention_badge: 'Safe Abstention Activated',
    assistant_disclaimer: 'NiyamVeda provides source-grounded assistive guidance and does not replace official BIS certification. Final compliance must be verified through accredited laboratories.',
    assistant_grounded_badge: 'BIS GROUNDED',
    assistant_insufficient_badge: 'INSUFFICIENT EVIDENCE',
    assistant_evasion_badge: 'REQUEST BLOCKED',
    assistant_context_active: 'Context Active:',
    assistant_eval_against: 'Evaluating queries against',
    assistant_clear_context: 'Clear Context',
    assistant_official_source: 'Official Standard Source',
    assistant_verified_badge: 'VERIFIED',
    assistant_loading: 'Retrieving authoritative Indian Standards & evaluating grounded context...',
    assistant_error_connect: 'We encountered a temporary connection issue. Please verify your query or try again.',
    assistant_page_loading: 'Loading Regulatory Assistant...',
    drawer_btn_ask: 'Ask Compliance Copilot',
    drawer_title: 'Regulatory Assistant',
    drawer_context_label: 'Context:',
    drawer_fullscreen: 'Open Fullscreen',
    drawer_verified_sources: 'Verified Sources:',
    drawer_checking: 'Checking BIS standards & rules...',
    drawer_chip_standards: 'What standards apply?',
    drawer_chip_tests: 'Required tests?',
    drawer_chip_crs: 'CRS registration?',
    drawer_placeholder: 'Ask about BIS compliance...',
    drawer_welcome_generic: 'Hello! I am your NiyamVeda regulatory copilot. Ask me about Indian Standards (BIS), Quality Control Orders, or certification routes.',
    drawer_welcome_product: 'Hello! I am your regulatory compliance copilot for this product. Ask me any question about applicable BIS standards, test procedures, or missing compliance facts.',

    // Hero & Landing
    hero_badge_ai: 'AI-Assisted',
    hero_badge_rule: 'Rule-Based',
    hero_badge_source: 'Source-Grounded',
    hero_title_prefix: 'Understand Your',
    hero_title_middle: 'Product’s',
    hero_title_suffix: 'Pathway',
    hero_subtext: 'Structured product analysis. Rule-based evaluation. Authoritative evidence. Clear next steps.',
    btn_analyse_product: 'Analyse Your Product',
    btn_explore_how_it_works: 'Explore How It Works',
    badge_msme: 'Built for Indian MSMEs & Hardware Startups',
    steps_heading: 'NiyamVeda Works in 4 Simple Steps',
    step_1_title: 'Define Product',
    step_1_desc: 'Enter basic specs in a guided flow.',
    step_2_title: 'Rule Engine',
    step_2_desc: 'Engine checks applicable standards.',
    step_3_title: 'Evidence Review',
    step_3_desc: 'Ground recommendations in sources.',
    step_4_title: 'Actionable Pathway',
    step_4_desc: 'Clear requirements, tests, next steps.',
    badge_evidence: 'Evidence Driven',
    badge_source_traceable: 'Source Traceable',
    badge_rule_based: 'Rule Based',
    badge_msme_friendly: 'MSME Friendly',

    // Analysis Dashboard
    metric_relevant_standards: 'Relevant Standards',
    metric_key_requirements: 'Key Requirements',
    metric_evidence_confidence: 'Evidence Confidence',
    metric_attention_needed: 'Attention Needed',
    metric_identified: 'Identified',
    metric_criteria: 'Criteria',
    metric_areas: 'Areas',
    summary_heading: 'Executive Compliance Summary',
    summary_subheading: 'Rule-based evaluation against applicable Quality Control Orders and mandatory standards.',
    attention_heading: 'What Needs Your Attention?',
    attention_subheading: 'High-priority items identified from your product facts requiring lab verification or testing action.',
    attention_all_clear: 'All identified compliance criteria are satisfied based on current product parameters. No critical laboratory flags pending.',
    why_applies_heading: 'Why Do These Standards Apply?',
    why_applies_subheading: 'Physical engineering facts that triggered specific Indian Standards without AI hallucination.',
    pathway_heading: 'Your Compliance Pathway',
    btn_view_detailed_analysis: 'View Detailed Analysis',
    btn_inspect_rule: 'Inspect Rule',
    status_completed: 'Completed',
    status_in_progress: 'In Progress',
    status_pending: 'Pending',
    analysis_strong: 'Strong',
    analysis_moderate: 'Moderate',
    analysis_abstaining: 'Abstaining',
    analysis_preliminary: 'Preliminary',
    analysis_ready: 'Ready',
    analysis_ask_copilot: 'Ask Copilot',
    analysis_standards_identified: 'Mandatory Standards Identified',
    analysis_statutory_reqs: 'Statutory Requirements',
    analysis_requiring_attention: 'Items Requiring Attention',
    analysis_action_items: 'Action Items',
    analysis_action_required: 'Action Required',
    analysis_all_clear_badge: 'All Clear',
    analysis_incomplete_params: 'Incomplete Parameters for Deterministic Standard Mapping',
    analysis_category: 'Category:',
    analysis_status: 'Status:',
    analysis_risk: 'Risk',
    analysis_mitigation: 'Mitigation:',
    analysis_modal_view: 'Full Modal View',
    analysis_physical_facts: 'Physical engineering facts that triggered specific Indian Standards without AI hallucination.',
    analysis_deterministic_badge: 'Deterministic Rule',
    analysis_product_facts: 'Product Facts',
    analysis_view_inspector: 'View Rule Inspector',
    analysis_rule_provenance: 'Rule Provenance & Engineering Rationale',
    analysis_modal_close: 'Close',
    analysis_default_eval: 'Product facts evaluated against published Bureau of Indian Standards (BIS) and mandatory Quality Control Orders (QCO).',

    // Forms & PDF Extraction
    form_product_def: 'Product Definition',
    form_product_name: 'Product Commercial Name',
    form_category: 'Product Category',
    form_intended_use: 'Intended Application / Use Case',
    form_operating_voltage: 'Operating Voltage',
    form_power_consumption: 'Power Consumption (Watts)',
    form_water_storage: 'Storage / Capacity',
    form_material_comp: 'Material / Chemical Composition',
    form_tech_specs: 'Key Technical Characteristics',
    pdf_upload_title: 'Upload Technical Datasheet',
    pdf_upload_prompt: 'Drop PDF file here or click to browse',
    pdf_verification_title: 'PDF Fact Verification',
    pdf_verification_notice: 'Please verify the technical parameters extracted from your document before continuing.',
    btn_confirm_facts: 'Confirm Verified Facts',
    btn_submit_analysis: 'Run Compliance Analysis',
    btn_save_continue: 'Save & Continue',
    btn_back: 'Back',

    // Product New Form
    product_new_step_1: 'Product Definition',
    product_new_step_2: 'Technical Details',
    product_new_step_3: 'Manufacturing',
    product_new_step_4: 'Market Info',
    product_new_step_5: 'Review',
    product_new_title: 'Product Definition',
    product_new_name_label: 'Product Commercial Name',
    product_new_cat_label: 'Product Category',
    product_new_cat_household: 'Household Electrical Appliances (Water Filters)',
    product_new_cat_electronics: 'Electronics & IT Goods',
    product_new_cat_plastic: 'Food Contact Plastic Apparatus',
    product_new_use_label: 'Intended Application / Use Case',
    product_new_mat_label: 'Material / Chemical Composition',
    product_new_tech_label: 'Key Technical Characteristics',
    product_new_docs_title: 'Supporting Documents',
    product_new_docs_optional: '(Optional)',
    product_new_docs_attached: 'attached',
    product_new_docs_file: 'file',
    product_new_docs_files: 'files',
    product_new_upload_drag: 'Upload datasheets, test reports, or brochures',
    product_new_upload_hint: 'Click to browse or drag & drop (PDF, DOC, JPG up to 10MB)',
    product_new_uploading: 'Uploading to NiyamVeda...',
    product_new_verified: 'Verified',
    product_new_remove_file: 'Remove file',
    product_new_disclaimer: 'Supporting documents provide additional product context but do not override authoritative regulatory sources.',
    product_new_pdf_verify_title: 'PDF Fact Verification',
    product_new_pdf_extracted_badge: 'Extracted from Datasheet',
    product_new_pdf_verify_notice: 'Please verify the information extracted from your document before proceeding to compliance analysis. You can adjust any parameter below.',
    product_new_voltage_label: 'Operating Voltage',
    product_new_power_label: 'Power Consumption',
    product_new_capacity_label: 'Storage / Fluid Capacity',
    product_new_material_label: 'Material Composition',
    product_new_btn_confirm_facts: 'Confirm & Save Verified Facts',
    product_new_verified_success: 'Extracted parameters verified and successfully applied to product profile.',
    product_new_btn_save_draft: 'Save Draft',
    product_new_btn_continue: 'Continue',
    product_new_file_limit_err: 'exceeds the 10MB file size limit.',
    product_new_file_fail_err: 'Failed to upload file. Please try again.',

    // Product Facts Confirmation
    confirm_step_badge: 'STEP 3: FACT VERIFICATION',
    confirm_title: 'Confirm What We Understood',
    confirm_subtitle: 'Review the extracted engineering facts before NiyamVeda evaluates applicable BIS standards. You can edit any parameter inline.',
    confirm_origin_extracted: 'Extracted from Spec',
    confirm_origin_manufacturer: 'Manufacturer Provided',
    confirm_notice: 'These parameters form the input facts to NiyamVeda’s deterministic rule engine. Changes will directly alter which Indian Standards and mandatory testing protocols are triggered.',
    confirm_btn_upload_another: 'Upload Another Document',
    confirm_btn_run_analysis: 'Confirm & Run Compliance Analysis',
    confirm_evaluating: 'Evaluating Rules...',

    // Simulation
    sim_title: 'What-If Compliance Simulation',
    sim_subtitle: 'Simulate changes in engineering parameters to inspect impacts on standards and tests.',
    sim_current_profile: 'Current Product Profile',
    sim_result_profile: 'Simulated Product Profile',
    sim_btn_run: 'Simulate Scenario',
    sim_diff_standards: 'Standard Impact Comparison',
    sim_retained: 'Retained Standards',
    sim_added: 'Newly Applicable Standards',
    sim_removed: 'Removed Standards',
    sim_provenance: 'Logical Provenance & Rationale',
    sim_header_title: 'What If You Change Your Product?',
    sim_header_desc: 'See how changes in product attributes may affect the compliance pathway.',
    sim_change_attrs: 'Change Product Attributes',
    sim_attr_material: 'Material',
    sim_attr_voltage: 'Operating Voltage',
    sim_attr_use: 'Intended Application',
    sim_btn_recalculate: 'Recalculate Compliance Pathway',
    sim_simulating: 'Simulating scenario...',
    sim_impact_summary: 'Impact Summary',
    sim_provenance_note: 'All simulation diffs are generated dynamically by NiyamVeda’s deterministic rule engine without AI hallucination.',

    // Sources Directory Page
    sources_title: 'Authoritative Source Registry',
    sources_subtitle: 'Curated repository of official Indian Standards (IS), MeitY Gazette Compulsory Registration Orders (CRO), and QCOs. Every compliance rule in NiyamVeda strictly traces to one of these records.',
    sources_search_placeholder: 'Search standards or gazettes...',
    sources_loading: 'Loading registered sources...',
    sources_scope: 'Applicable Scope',
    sources_effective: 'Effective:',
    sources_enforced: 'Enforced',
    sources_portal_link: 'Official Portal',
    sources_no_results: 'No matching regulatory sources found.',

    // Auth Page
    auth_portal_subtitle: 'Secure BIS Compliance Intelligence Portal for Indian MSMEs',
    auth_demo_badge: 'Instant Evaluation Mode',
    auth_demo_desc: 'Sign in with 1-click as Rajesh Kumar Sharma (Water Purifier MSME)',
    auth_demo_btn: '1-Click Demo Sign In',
    auth_tab_login: 'Sign In',
    auth_tab_register: 'Create Account',
    auth_full_name: 'Full Name',
    auth_full_name_placeholder: 'e.g. Rajesh Kumar Sharma',
    auth_username: 'Username',
    auth_username_placeholder: 'e.g. rishi_s',
    auth_company_name: 'MSME / Enterprise Name',
    auth_company_placeholder: 'e.g. Apex PureWater Innovations Pvt. Ltd.',
    auth_email: 'Email Address',
    auth_email_placeholder: 'name@company.com',
    auth_password: 'Password',
    auth_password_placeholder: '••••••••',
    auth_btn_login: 'Sign In to Portal',
    auth_btn_register: 'Create MSME Account',
    auth_err_email_invalid: 'Please enter a valid email address.',
    auth_err_fullname_invalid: 'Full name must contain only English letters with single spaces between words.',
    auth_err_username_invalid: 'Username must be 3–30 characters long and contain only letters, numbers, and underscores.',
    auth_err_username_taken: 'This username is already taken.',
    auth_err_generic: 'Unable to sign in right now. Please try again.',
    auth_err_demo: 'Failed to initiate demo session.',
    auth_card_role: 'Role',
    auth_card_start: 'Start Product Analysis',
    auth_card_signout: 'Sign Out',
    profile_label_username: 'Username',
    profile_label_fullname: 'Full Name',

    // Standards Page
    standards_title: 'Relevant Standards',
    standards_subtitle: 'Based on your product facts and rule evaluation.',
    standards_insufficient_title: 'Insufficient Evidence to Determine Applicable Standard',
    standards_insufficient_desc: 'No published Indian Standards (BIS) or statutory Quality Control Orders matched the supplied technical parameters.',
    standards_badge_mandatory: 'Mandatory Indian Standard',
    standards_badge_gazette: 'Gazette QCO Grounded',
    standards_view_source: 'View Standard Source',
    standards_why_applies: 'Why this standard applies:',

    // Requirements Page
    req_title: 'Requirements for Your Product',
    req_completed: 'Completed',
    req_col_req: 'Requirement',
    req_col_why: 'Why This Requirement Applies',
    req_col_source: 'Source',
    req_col_status: 'Status',
    req_no_reqs: 'No mandatory requirements found for current product parameters.',
    req_status_verified: 'Verified',
    req_status_action: 'Action Required',
    req_status_pending: 'Pending',

    // Risks Page
    risks_title: 'Potential Compliance Risks – Before You Test',
    risks_subtitle: 'Identified risks based on current product information.',
    risks_no_risks_title: 'No Compliance Risks Established',
    risks_no_risks_desc: 'No significant compliance failure risks or material vulnerabilities were established from the available evidence.',
    risks_why_matters: 'Why it matters:',
    risks_suggested_action: 'Suggested Action:',
    risks_severity_high: 'HIGH Risk',
    risks_severity_medium: 'MEDIUM Risk',
    risks_severity_low: 'LOW Risk',

    // Product Evidence Trail
    evidence_title: 'Evidence Trail',
    evidence_subtitle: 'Trace how each compliance conclusion is supported by verified Indian Standards.',
    evidence_rule_label: 'Rule:',
    evidence_clause_citations: 'Statutory & Standard Clause Citations',
    evidence_official_text: 'Official Standard Text',
    evidence_open_portal: 'Open Standard in BIS Portal',
    evidence_rule_logic: 'Deterministic Rule Logic',

    // Why Rule Applies & Rule Inspector
    why_rule_title: 'Why This Rule Applies',
    why_rule_step_fact: 'PRODUCT FACT',
    why_rule_step_rule: 'RULE EVALUATED',
    why_rule_step_evidence: 'EVIDENCE CITATION',
    why_rule_step_conclusion: 'COMPLIANCE CONCLUSION',
    why_rule_btn_inspector: 'Inspect Rule Logic',
    why_rule_btn_close: 'Close',
    inspector_title: 'Rule Inspector',
    inspector_logic: 'RULE LOGIC',
    inspector_evidence: 'EVIDENCE & CITATIONS',
    inspector_sources: 'Grounded Standards',
    inspector_close: 'Close Inspector',
    // Rule Inspector & Evidence Labels
    rule_inspector_heading: 'Rule Inspector',
    inspector_verified_badge: 'Verified',
    inspector_outcome_heading: 'Compliance Outcome',
    inspector_logic_heading: 'Rule Logic',
    inspector_authoritative_badge: 'Authoritative',
    evidence_clause_label: 'Clause Reference',
    evidence_source_label: 'Standard Source',
    evidence_excerpt_label: 'Evidence Excerpt',
    evidence_view_full_source: 'View Full Evidence Trail',

    // Safe Abstention
    abstention_title: 'More Information or Evidence Is Needed',
    abstention_desc: 'We could not find sufficient verified evidence in the currently indexed authoritative sources to provide a reliable compliance conclusion for this product characteristic.',
    abstention_badge: 'SAFE ABSTENTION ACTIVATED',
    abstention_prod_char: 'Product Characteristic',
    abstention_evidence_result: 'Evidence Search Result',
    abstention_why_safe: 'Why We Abstain',
    abstention_why_safe_desc: 'Rather than guessing or hallucinating compliance requirements, NiyamVeda’s safe abstention guardrail protects you from incorrect regulatory advice.',
    abstention_btn_back: 'Return to Dashboard',
    abstention_btn_edit: 'Edit Product Parameters',

    // Footer
    footer_disclaimer: 'NiyamVeda provides assistive regulatory intelligence and does not constitute official BIS certification. Final compliance must be validated by accredited laboratories.',
    footer_rights: 'All rights reserved.',
    footer_academic_note: 'Explainable BIS Compliance Intelligence Assistant for Indian MSMEs (SIH26107).',

    // About Page
    about_badge: 'ABOUT NIYAMVEDA',
    about_project: 'SIH26107 PROJECT INITIATIVE',
    about_title: 'Democratizing Regulatory Intelligence for Indian Hardware',
    about_intro: 'NiyamVeda (नियमवेद) is an explainable compliance intelligence platform developed to help manufacturers, hardware engineers, and Indian MSMEs understand BIS Quality Control Orders through transparent, parameter-driven evaluation.',
    about_challenge_title: 'The Regulatory Challenge',
    about_challenge_intro: 'Navigating Indian regulatory compliance presents steep hurdles for emerging product teams:',
    about_challenge_1_title: 'Dense Gazette Cross-References',
    about_challenge_1_text: 'Quality Control Orders can reference clauses across separate standards and regulatory documents.',
    about_challenge_2_title: 'Ambiguity in Applicability',
    about_challenge_2_text: 'Determining whether specific product parameters make a requirement applicable can be difficult to navigate.',
    about_challenge_3_title: 'High Barrier to Entry',
    about_challenge_3_text: 'MSMEs may face costly consulting cycles simply to understand which requirements and tests need attention.',
    about_approach_title: 'The NiyamVeda Approach',
    about_approach_intro: 'NiyamVeda transforms compliance uncertainty into structured engineering clarity:',
    about_approach_1_title: 'Parameter-Driven Logic',
    about_approach_1_text: 'Input facts such as voltage, wattage, materials, and intended use determine rule applicability.',
    about_approach_2_title: 'Grounded Traceability',
    about_approach_2_text: 'Recommendations can be connected to indexed standards and source records available in the system.',
    about_approach_3_title: 'Pre-Testing Risk Discovery',
    about_approach_3_text: 'Potential compliance risks can be surfaced before prototype testing and validation.',
    about_core_principle: 'CORE ARCHITECTURAL PRINCIPLE',
    about_parameter_title: 'Why Parameter-Driven Compliance Matters',
    about_parameter_text_1: 'Compliance is not a one-size-fits-all checklist. Different engineering parameters can lead to different applicable requirements.',
    about_parameter_text_2: 'By tying the compliance pipeline to product facts, supported parameter changes can dynamically recalculate the pathway.',
    about_architecture_title: 'Architecture: Deterministic Rules + Evidence + AI',
    about_architecture_desc: 'How the system components work together to deliver verifiable compliance clarity.',
    about_pillar_1_title: 'Deterministic Rule Engine',
    about_pillar_1_subtitle: 'No Regulatory Hallucination',
    about_pillar_1_desc: 'Applicability is decided through deterministic rule logic rather than generative guessing.',
    about_pillar_2_title: 'Authoritative Source Registry',
    about_pillar_2_subtitle: 'Clause-Level Traceability',
    about_pillar_2_desc: 'Source records provide traceability where authoritative data is indexed.',
    about_pillar_3_title: 'Safe Abstention Safeguard',
    about_pillar_3_subtitle: 'Responsible System Behavior',
    about_pillar_3_desc: 'When facts are incomplete or outside indexed scope, the system can abstain instead of fabricating conclusions.',
    about_pillar_4_title: 'AI Synthesis with Strict Grounding',
    about_pillar_4_subtitle: 'Explainable Next Steps',
    about_pillar_4_desc: 'AI can assist with summarization and explanation without changing deterministic rule outcomes.',
    about_scope_label: 'Academic & Project Scope',
    about_mission_title: "NiyamVeda's Mission",
    about_mission_text: 'NiyamVeda was created as an assistive decision-support framework to demonstrate how deterministic rule engines and source-grounded retrieval can transform regulatory information into structured, transparent software tools.',
    about_how_link: 'Explore How It Works',
    about_sources_link: 'Inspect Regulatory Sources',

    // How It Works Page
    how_badge: 'NIYAMVEDA ARCHITECTURE',
    how_project: 'END-TO-END WORKFLOW',
    how_title: 'How NiyamVeda Works',
    how_intro: 'NiyamVeda is a parameter-driven compliance intelligence system. It translates product specifications into structured regulatory pathways using deterministic logic and available source evidence.',
    how_engine_label: 'Parameter-Driven Engine',
    how_dynamic_title: 'Compliance Outcomes Change Dynamically With Product Facts',
    how_dynamic_text: 'Supported product parameters determine which rules, standards, requirements, and testing considerations are returned by the system.',
    how_test_product: 'Test With Your Product',
    how_live_demo: 'View Live Analysis Demo',
    how_dataflow: 'Compliance Engine Dataflow',
    how_pipeline_title: 'The 8-Step Compliance Analysis Pipeline',
    how_pipeline_desc: 'From technical specification sheet to structured compliance considerations.',
    how_rag_badge: 'Deterministic Logic + RAG',
    how_operates: 'How it operates:',
    how_abstention_badge: 'Regulatory Integrity Gate',
    how_abstention_title: 'Safe Abstention: Protecting You From Fabricated Advice',
    how_abstention_text: 'If critical engineering facts are missing or a product falls outside the indexed scope, NiyamVeda does not guess. It reports insufficient evidence and indicates what information is needed.',
    how_whatif_label: 'Interactive Decision Support',
    how_whatif_title: 'Try What-If Parameter Simulation',
    how_whatif_text: 'Test supported product-parameter changes and observe how the compliance pathway changes before committing to design decisions.',
    how_whatif_button: 'Launch What-If Simulator',

    // How It Works Steps
    how_step_1_title: 'Enter Product Details',
    how_step_1_cat: 'Input',
    how_step_1_desc: 'Provide basic product information.',
    how_step_1_detail: 'Product facts become the input profile.',
    how_step_2_title: 'Upload Technical Datasheet / PDF',
    how_step_2_cat: 'Ingestion',
    how_step_2_desc: 'Upload a supported technical PDF.',
    how_step_2_detail: 'The backend can parse supported PDF text.',
    how_step_3_title: 'Fact Verification & Structuring',
    how_step_3_cat: 'Verification',
    how_step_3_desc: 'Review extracted technical facts.',
    how_step_3_detail: 'Verified facts form the deterministic product profile.',
    how_step_4_title: 'Apply Deterministic BIS Rules',
    how_step_4_cat: 'Rule Engine',
    how_step_4_desc: 'Evaluate structured facts against available rules.',
    how_step_4_detail: 'Rule logic determines applicability.',
    how_step_5_title: 'Map Applicable Standards & Requirements',
    how_step_5_cat: 'Registry Mapping',
    how_step_5_desc: 'Connect matched rules to indexed sources.',
    how_step_5_detail: 'Relevant evidence can be inspected.',
    how_step_6_title: 'Generate Compliance Analysis',
    how_step_6_cat: 'Metric Synthesis',
    how_step_6_desc: 'Calculate current analysis metrics.',
    how_step_6_detail: 'Results reflect the active rule outcomes.',
    how_step_7_title: 'Review Risks, Evidence & Certification Pathway',
    how_step_7_cat: 'Risk & Audit Trail',
    how_step_7_desc: 'Review risks and evidence.',
    how_step_7_detail: 'Available source information supports the review.',
    how_step_8_title: 'Use What-If Simulation to Test Parameter Changes',
    how_step_8_cat: 'Dynamic Simulation',
    how_step_8_desc: 'Test supported parameter changes.',
    how_step_8_detail: 'The analysis is recalculated for the scenario.',

    // How It Works Flow Pills
    how_flow_1: 'Product Details',
    how_flow_2: 'PDF',
    how_flow_3: 'Fact Verification',
    how_flow_4: 'Rules',
    how_flow_5: 'Standards',
    how_flow_6: 'Requirements',
    how_flow_7: 'Analysis',
    how_flow_8: 'What-If',
  },

  hi: {
    // Navigation
    nav_how_it_works: 'कार्यप्रणाली',
    nav_sources: 'स्रोत निर्देशिका',
    nav_about_us: 'हमारे बारे में',
    nav_assistant: 'एआई सहायक',
    nav_profile: 'प्रोफाइल',
    nav_sign_in: 'साइन इन',
    nav_sign_out: 'साइन आउट',
    nav_start_analysis: 'विश्लेषण शुरू करें',
    nav_start: 'शुरू करें',
    nav_tagline: 'उत्पाद से मानक स्पष्टता तक',
    nav_profile_tooltip: 'प्रोफाइल एवं उत्पाद देखें',
    theme_toggle_dark: 'डार्क मोड पर बदलें',
    theme_toggle_light: 'लाइट मोड पर बदलें',
    theme_toggle_aria: 'थीम बदलें',
    language_selector: 'भाषा',

    // Common UI
    common_save: 'सुरक्षित करें',
    common_cancel: 'रद्द करें',
    common_close: 'बंद करें',
    common_continue: 'आगे बढ़ें',
    common_back: 'वापस',
    common_loading: 'लोड हो रहा है...',
    common_verified: 'सत्यापित',
    common_clear: 'हटाएं',
    common_status: 'स्थिति',
    common_action: 'कार्रवाई',
    common_processing: 'प्रक्रिया जारी है...',
    common_start: 'शुरू करें',
    common_home: 'होम',

    // Sidebar Tooltips
    sidebar_product: 'उत्पाद तथ्य',
    sidebar_analysis: 'अनुपालन डैशबोर्ड',
    sidebar_why_rule: 'यह नियम क्यों लागू होता है',
    sidebar_inspector: 'नियम निरीक्षक',
    sidebar_standards: 'प्रासंगिक मानक',
    sidebar_requirements: 'आवश्यकताएं चेकलिस्ट',
    sidebar_risks: 'संभावित जोखिम',
    sidebar_simulation: 'व्हाट-इफ सिमुलेशन',
    sidebar_sources: 'साक्ष्य श्रृंखला',
    sidebar_abstention: 'सुरक्षित संयम',

    // Profile & Preferences
    profile_title: 'एमएसएमई निर्माता प्रोफाइल',
    profile_desc: 'अपनी संस्था का विवरण, पंजीकृत उत्पाद और विनियामक प्राथमिकताएं प्रबंधित करें।',
    profile_account_security: 'खाता सुरक्षा',
    profile_preferences: 'इंटरफ़ेस प्राथमिकताएं',
    profile_my_products: 'आपके पंजीकृत उत्पाद',
    profile_auth_required_title: 'प्रमाणीकरण आवश्यक है',
    profile_auth_required_desc: 'अपनी संगठन प्रोफाइल और उत्पाद देखने के लिए कृपया साइन इन करें या डेमो मूल्यांकन एक्सेस का उपयोग करें।',
    profile_btn_signin: 'अपने खाते में साइन इन करें',
    profile_btn_demo: 'त्वरित मूल्यांकनकर्ता डेमो एक्सेस',
    profile_joined: 'शामिल हुए',
    profile_active_member: 'सक्रिय सदस्य',
    profile_btn_new_project: 'नई अनुपालन परियोजना',
    profile_sec_pwd_title: 'पासवर्ड प्रमाणीकरण',
    profile_sec_pwd_desc: 'सॉल्टेड पासवर्ड प्रमाणीकरण सक्रिय',
    profile_sec_pwd_badge: 'सुरक्षित',
    profile_sec_session_title: 'सत्र प्रबंधन',
    profile_sec_session_desc: 'सर्वर-साइड हैशेड सत्र टोकन',
    profile_sec_session_badge: 'सक्रिय',
    profile_sec_token_title: 'टोकन समाप्ति अवधि',
    profile_sec_token_desc: 'स्वचालित 24-घंटे समाप्ति जांच',
    profile_sec_token_badge: '24 घंटे',
    profile_pref_lang: 'सिस्टम भाषा / Language',
    profile_pref_theme: 'प्रकटन / थीम',
    profile_theme_dark: 'डार्क मोड',
    profile_theme_light: 'लाइट मोड',
    profile_copilot_title: 'विनियामक कोपायलट',
    profile_copilot_desc: 'IS 302, IS 16240, ड्राई-बॉइल आवश्यकताओं या MeitY CRS पंजीकरण पर कोई प्रश्न है?',
    profile_copilot_launch: 'संवादी सहायक खोलें',
    profile_products_sub: 'मूल्यांकित उत्पाद, नियम परिणाम और सक्रिय अनुपालन दस्तावेज।',
    profile_products_count: 'उत्पाद',
    profile_loading_products: 'आपके अनुपालन दस्तावेज लोड हो रहे हैं...',
    profile_no_products_title: 'अभी तक कोई उत्पाद पंजीकृत नहीं है',
    profile_no_products_desc: 'लागू बीआईएस मानकों का मूल्यांकन करने और सत्यापित अनुपालन मार्ग बनाने के लिए अपना उपकरण जोड़ें।',
    profile_add_first_product: 'अपना पहला उत्पाद जोड़ें',
    profile_voltage_na: 'वोल्टेज निर्दिष्ट नहीं',
    profile_btn_analysis: 'विश्लेषण',
    profile_btn_whatif: 'व्हाट-इफ',
    profile_btn_chat: 'चैट',
    profile_chat_tooltip: 'इस उत्पाद संदर्भ के साथ सहायक से चैट करें',
    profile_fact_material: 'सामग्री:',
    profile_fact_power: 'शक्ति:',
    profile_fact_origin: 'मूल:',
    profile_inspect_facts: 'सत्यापित विवरण जांचें',

    // Assistant & Drawer
    assistant_title: 'नियमवेद एआई विनियामक सहायक',
    assistant_subtitle: 'भारतीय मानकों (BIS) और गुणवत्ता नियंत्रण आदेशों (QCO) पर आधारित प्रामाणिक अनुपालन विश्लेषण।',
    assistant_placeholder: 'बीआईएस मानक, इलेक्ट्रिक केतली, आरओ प्यूरिफायर, स्टेनलेस स्टील कुकवेयर के बारे में पूछें...',
    assistant_send: 'प्रश्न भेजें',
    assistant_quick_queries: 'सुझाए गए विनियामक प्रश्न',
    assistant_select_product: 'उत्पाद संदर्भ जोड़ें',
    assistant_no_product: 'सामान्य बीआईएस प्रश्न (कोई विशिष्ट उत्पाद नहीं)',
    assistant_citations: 'प्रामाणिक मानक उद्धरण',
    assistant_abstention_badge: 'सुरक्षित संयम सक्रिय',
    assistant_disclaimer: 'नियमवेद स्रोत-आधारित मार्गदर्शन प्रदान करता है और यह आधिकारिक बीआईएस प्रमाणन नहीं है। अंतिम अनुपालन मान्यता प्राप्त प्रयोगशालाओं द्वारा सत्यापित किया जाना चाहिए।',
    assistant_grounded_badge: 'बीआईएस आधारित',
    assistant_insufficient_badge: 'अपर्याप्त साक्ष्य',
    assistant_evasion_badge: 'अनुरोध अवरुद्ध',
    assistant_context_active: 'सक्रिय संदर्भ:',
    assistant_eval_against: 'के आधार पर मूल्यांकन',
    assistant_clear_context: 'संदर्भ हटाएं',
    assistant_official_source: 'आधिकारिक मानक स्रोत',
    assistant_verified_badge: 'सत्यापित',
    assistant_loading: 'प्रामाणिक भारतीय मानक खोजे जा रहे हैं एवं संदर्भ का मूल्यांकन हो रहा है...',
    assistant_error_connect: 'अस्थायी कनेक्शन समस्या आई। कृपया अपना प्रश्न जांचें या पुनः प्रयास करें।',
    assistant_page_loading: 'विनियामक सहायक लोड हो रहा है...',
    drawer_btn_ask: 'अनुपालन कोपायलट से पूछें',
    drawer_title: 'विनियामक सहायक',
    drawer_context_label: 'संदर्भ:',
    drawer_fullscreen: 'पूर्ण स्क्रीन में खोलें',
    drawer_verified_sources: 'सत्यापित स्रोत:',
    drawer_checking: 'बीआईएस मानकों और नियमों की जांच हो रही है...',
    drawer_chip_standards: 'कौन से मानक लागू होते हैं?',
    drawer_chip_tests: 'आवश्यक परीक्षण?',
    drawer_chip_crs: 'सीआरएस पंजीकरण?',
    drawer_placeholder: 'बीआईएस अनुपालन के बारे में पूछें...',
    drawer_welcome_generic: 'नमस्ते! मैं आपका नियमवेद विनियामक कोपायलट हूं। मुझसे भारतीय मानकों (BIS), गुणवत्ता नियंत्रण आदेशों या प्रमाणन मार्गों के बारे में पूछें।',
    drawer_welcome_product: 'नमस्ते! मैं इस उत्पाद के लिए आपका विनियामक अनुपालन कोपायलट हूं। मुझसे लागू बीआईएस मानकों, परीक्षण प्रक्रियाओं या तकनीकी मापदंडों के बारे में पूछें।',

    // Hero & Landing
    hero_badge_ai: 'एआई-सहायता प्राप्त',
    hero_badge_rule: 'नियम-आधारित',
    hero_badge_source: 'स्रोत-सत्यापित',
    hero_title_prefix: 'अपने उत्पाद का',
    hero_title_middle: 'मानक अनुपालन',
    hero_title_suffix: 'मार्ग समझें',
    hero_subtext: 'संरचित उत्पाद विश्लेषण। नियम-आधारित मूल्यांकन। आधिकारिक साक्ष्य। स्पष्ट अगले कदम।',
    btn_analyse_product: 'उत्पाद विश्लेषण करें',
    btn_explore_how_it_works: 'कार्यप्रणाली देखें',
    badge_msme: 'भारतीय एमएसएमई और स्टार्टअप्स के लिए निर्मित',
    steps_heading: 'नियमवेद 4 सरल चरणों में कार्य करता है',
    step_1_title: 'उत्पाद परिभाषित करें',
    step_1_desc: 'सरल चरणों में तकनीकी विवरण दर्ज करें।',
    step_2_title: 'नियमों का मूल्यांकन',
    step_2_desc: 'इंजन लागू मानकों और नियमों की जांच करता है।',
    step_3_title: 'साक्ष्य समीक्षा',
    step_3_desc: 'आधिकारिक स्रोतों और धाराओं का मिलान।',
    step_4_title: 'अनुपालन मार्ग',
    step_4_desc: 'आवश्यकताएं, परीक्षण और कार्ययोजना प्राप्त करें।',
    badge_evidence: 'साक्ष्य-संचालित',
    badge_source_traceable: 'स्रोत-सत्यापनीय',
    badge_rule_based: 'नियम-आधारित',
    badge_msme_friendly: 'एमएसएमई अनुकूल',

    // Analysis Dashboard
    metric_relevant_standards: 'प्रासंगिक मानक',
    metric_key_requirements: 'प्रमुख आवश्यकताएं',
    metric_evidence_confidence: 'साक्ष्य विश्वसनीयता',
    metric_attention_needed: 'ध्यान देने योग्य क्षेत्र',
    metric_identified: 'चिह्नित',
    metric_criteria: 'मापदंड',
    metric_areas: 'क्षेत्र',
    summary_heading: 'कार्यकारी अनुपालन सारांश',
    summary_subheading: 'लागू गुणवत्ता नियंत्रण आदेशों (QCO) और अनिवार्य मानकों का नियम-आधारित विश्लेषण।',
    attention_heading: 'किन बातों पर ध्यान देना आवश्यक है?',
    attention_subheading: 'उच्च प्राथमिकता वाले बिंदु जिन्हें इंजीनियरिंग समीक्षा या NABL प्रयोगशाला सत्यापन की आवश्यकता है।',
    attention_all_clear: 'सभी अनुपालन मापदंड पूर्ण हैं और कोई भी लंबित चेतावनी नहीं है।',
    why_applies_heading: 'ये मानक क्यों लागू होते हैं?',
    why_applies_subheading: 'उत्पाद के विशिष्ट भौतिक और तकनीकी लक्षण जिन्होंने इन नियमों को सक्रिय किया।',
    pathway_heading: 'आपका अनुपालन मार्ग',
    btn_view_detailed_analysis: 'विस्तृत विश्लेषण देखें',
    btn_inspect_rule: 'सक्रिय नियम जांचें',
    status_completed: 'पूर्ण',
    status_in_progress: 'प्रगति में',
    status_pending: 'लंबित',
    analysis_strong: 'मजबूत',
    analysis_moderate: 'मध्यम',
    analysis_abstaining: 'संयमित',
    analysis_preliminary: 'प्रारंभिक',
    analysis_ready: 'तैयार',
    analysis_ask_copilot: 'कोपायलट से पूछें',
    analysis_standards_identified: 'अनिवार्य मानक चिह्नित',
    analysis_statutory_reqs: 'वैधानिक आवश्यकताएं',
    analysis_requiring_attention: 'ध्यान देने योग्य बिंदु',
    analysis_action_items: 'कार्रवाई बिंदु',
    analysis_action_required: 'कार्रवाई आवश्यक',
    analysis_all_clear_badge: 'सब ठीक है',
    analysis_incomplete_params: 'निश्चित मानक मैपिंग के लिए अपूर्ण मापदंड',
    analysis_category: 'श्रेणी:',
    analysis_status: 'स्थिति:',
    analysis_risk: 'जोखिम',
    analysis_mitigation: 'निवारण उपाय:',
    analysis_modal_view: 'विस्तृत मॉडल दृश्य',
    analysis_physical_facts: 'इंजीनियरिंग तथ्य जिन्होंने बिना किसी एआई भ्रांति के विशिष्ट मानकों को सक्रिय किया।',
    analysis_deterministic_badge: 'निश्चित नियम',
    analysis_product_facts: 'उत्पाद तथ्य',
    analysis_view_inspector: 'नियम निरीक्षक देखें',
    analysis_rule_provenance: 'नियम उत्पत्ति एवं इंजीनियरिंग तर्क',
    analysis_modal_close: 'बंद करें',
    analysis_default_eval: 'प्रकाशित भारतीय मानक ब्यूरो (BIS) एवं अनिवार्य गुणवत्ता नियंत्रण आदेशों (QCO) के आधार पर मूल्यांकित।',

    // Forms & PDF Extraction
    form_product_def: 'उत्पाद विवरण',
    form_product_name: 'उत्पाद का नाम',
    form_category: 'उत्पाद श्रेणी',
    form_intended_use: 'उपयोग का उद्देश्य',
    form_operating_voltage: 'ऑपरेटिंग वोल्टेज',
    form_power_consumption: 'विद्युत खपत (वाट)',
    form_water_storage: 'भंडारण / क्षमता',
    form_material_comp: 'सामग्री संरचना',
    form_tech_specs: 'तकनीकी विशिष्टताएं',
    pdf_upload_title: 'तकनीकी डेटाशीट अपलोड करें',
    pdf_upload_prompt: 'पीडीएफ फाइल यहां खींचें या चुनने के लिए क्लिक करें',
    pdf_verification_title: 'पीडीएफ डेटा सत्यापन',
    pdf_verification_notice: 'कृपया विश्लेषण शुरू करने से पहले दस्तावेज़ से निकाले गए तकनीकी विवरणों की जांच करें।',
    btn_confirm_facts: 'निकाले गए विवरण सत्यापित करें',
    btn_submit_analysis: 'अनुपालन विश्लेषण चलाएं',
    btn_save_continue: 'सुरक्षित करें और आगे बढ़ें',
    btn_back: 'वापस',

    // Product New Form
    product_new_step_1: 'उत्पाद परिभाषा',
    product_new_step_2: 'तकनीकी विवरण',
    product_new_step_3: 'विनिर्माण',
    product_new_step_4: 'बाजार जानकारी',
    product_new_step_5: 'समीक्षा',
    product_new_title: 'उत्पाद परिभाषा',
    product_new_name_label: 'उत्पाद का व्यावसायिक नाम',
    product_new_cat_label: 'उत्पाद श्रेणी',
    product_new_cat_household: 'घरेलू विद्युत उपकरण (वाटर फिल्टर)',
    product_new_cat_electronics: 'इलेक्ट्रॉनिक्स एवं आईटी उपकरण',
    product_new_cat_plastic: 'खाद्य संपर्क प्लास्टिक उपकरण',
    product_new_use_label: 'इच्छित उपयोग / अनुप्रयोग',
    product_new_mat_label: 'सामग्री / रासायनिक संरचना',
    product_new_tech_label: 'प्रमुख तकनीकी विशेषताएं',
    product_new_docs_title: 'सहायक दस्तावेज़',
    product_new_docs_optional: '(वैकल्पिक)',
    product_new_docs_attached: 'संलग्न',
    product_new_docs_file: 'फाइल',
    product_new_docs_files: 'फाइलें',
    product_new_upload_drag: 'डेटाशीट, परीक्षण रिपोर्ट या विवरणिका अपलोड करें',
    product_new_upload_hint: 'ब्राउज़ करने के लिए क्लिक करें या ड्रैग-एंड-ड्रॉप करें (PDF, DOC, JPG अधिकतम 10MB)',
    product_new_uploading: 'नियमवेद में अपलोड हो रहा है...',
    product_new_verified: 'सत्यापित',
    product_new_remove_file: 'फाइल हटाएं',
    product_new_disclaimer: 'सहायक दस्तावेज़ अतिरिक्त संदर्भ प्रदान करते हैं परंतु आधिकारिक विनियामक स्रोतों की जगह नहीं लेते।',
    product_new_pdf_verify_title: 'पीडीएफ तथ्य सत्यापन',
    product_new_pdf_extracted_badge: 'डेटाशीट से निकाला गया',
    product_new_pdf_verify_notice: 'अनुपालन विश्लेषण पर आगे बढ़ने से पहले दस्तावेज़ से निकाले गए विवरणों की पुष्टि करें। आप नीचे किसी भी मान को बदल सकते हैं।',
    product_new_voltage_label: 'ऑपरेटिंग वोल्टेज',
    product_new_power_label: 'विद्युत खपत',
    product_new_capacity_label: 'भंडारण / क्षमता',
    product_new_material_label: 'सामग्री संरचना',
    product_new_btn_confirm_facts: 'सत्यापित विवरण सहेजें',
    product_new_verified_success: 'निकाले गए तकनीकी पैरामीटर सफलतापूर्वक उत्पाद प्रोफाइल में लागू कर दिए गए हैं।',
    product_new_btn_save_draft: 'ड्राफ्ट सहेजें',
    product_new_btn_continue: 'आगे बढ़ें',
    product_new_file_limit_err: '10MB की फाइल सीमा से अधिक है।',
    product_new_file_fail_err: 'फाइल अपलोड करने में विफल। कृपया पुन: प्रयास करें।',

    // Product Facts Confirmation
    confirm_step_badge: 'चरण 3: तथ्य सत्यापन',
    confirm_title: 'पुष्टि करें कि हमने क्या समझा',
    confirm_subtitle: 'बीआईएस मानकों का मूल्यांकन करने से पहले निकाले गए तकनीकी तथ्यों की समीक्षा करें। आप किसी भी पैरामीटर को संपादित कर सकते हैं।',
    confirm_origin_extracted: 'दस्तावेज़ से निकाला गया',
    confirm_origin_manufacturer: 'निर्माता द्वारा प्रदान',
    confirm_notice: 'ये पैरामीटर नियमवेद के निश्चित नियम इंजन के लिए इनपुट तथ्य हैं। इनमें बदलाव सीधे लागू होने वाले भारतीय मानकों और परीक्षणों को प्रभावित करेगा।',
    confirm_btn_upload_another: 'अन्य दस्तावेज़ अपलोड करें',
    confirm_btn_run_analysis: 'सत्यापित करें और विश्लेषण चलाएं',
    confirm_evaluating: 'नियमों का मूल्यांकन हो रहा है...',

    // Simulation
    sim_title: 'व्हाट-इफ अनुपालन सिमुलेशन',
    sim_subtitle: 'उत्पाद मापदंडों को बदलकर देखें कि मानकों और परीक्षणों पर क्या प्रभाव पड़ता है।',
    sim_current_profile: 'वर्तमान उत्पाद प्रोफाइल',
    sim_result_profile: 'सिम्युलेटेड उत्पाद प्रोफाइल',
    sim_btn_run: 'परिदृश्य सिम्युलेट करें',
    sim_diff_standards: 'मानक प्रभाव तुलना',
    sim_retained: 'यथावत मानक',
    sim_added: 'नए जुड़े मानक',
    sim_removed: 'हटाए गए मानक',
    sim_provenance: 'तार्किक साक्ष्य एवं कारण',
    sim_header_title: 'यदि आप अपना उत्पाद बदलते हैं तो क्या होगा?',
    sim_header_desc: 'देखें कि उत्पाद विशेषताओं में बदलाव से अनुपालन मार्ग कैसे प्रभावित होता है।',
    sim_change_attrs: 'उत्पाद विशेषताएं बदलें',
    sim_attr_material: 'सामग्री',
    sim_attr_voltage: 'ऑपरेटिंग वोल्टेज',
    sim_attr_use: 'इच्छित अनुप्रयोग',
    sim_btn_recalculate: 'अनुपालन मार्ग पुनः परिकलित करें',
    sim_simulating: 'सिमुलेशन जारी है...',
    sim_impact_summary: 'प्रभाव सारांश',
    sim_provenance_note: 'सभी सिमुलेशन अंतर नियमवेद के निश्चित नियम इंजन द्वारा बिना किसी एआई भ्रांति के गतिशील रूप से उत्पन्न होते हैं।',

    // Sources Directory Page
    sources_title: 'प्रामाणिक स्रोत निर्देशिका',
    sources_subtitle: 'आधिकारिक भारतीय मानकों (IS), इलेक्ट्रॉनिक्स और सूचना प्रौद्योगिकी मंत्रालय (MeitY) राजपत्र अनिवार्य पंजीकरण आदेशों (CRO) और QCO का संकलित भंडार। नियमवेद का प्रत्येक नियम सीधे इन्हीं से जुड़ा है।',
    sources_search_placeholder: 'मानक या राजपत्र खोजें...',
    sources_loading: 'पंजीकृत स्रोत लोड हो रहे हैं...',
    sources_scope: 'लागू दायरा',
    sources_effective: 'प्रभावी तिथि:',
    sources_enforced: 'लागू',
    sources_portal_link: 'आधिकारिक पोर्टल',
    sources_no_results: 'कोई मिलान विनियामक स्रोत नहीं मिला।',

    // Auth Page
    auth_portal_subtitle: 'भारतीय एमएसएमई के लिए सुरक्षित बीआईएस अनुपालन इंटेलिजेंस पोर्टल',
    auth_demo_badge: 'त्वरित मूल्यांकन मोड',
    auth_demo_desc: 'राजेश कुमार शर्मा (वाटर प्यूरिफायर एमएसएमई) के रूप में 1-क्लिक से साइन इन करें',
    auth_demo_btn: '1-क्लिक डेमो साइन इन',
    auth_tab_login: 'साइन इन',
    auth_tab_register: 'खाता बनाएं',
    auth_full_name: 'पूरा नाम',
    auth_full_name_placeholder: 'उदा. राजेश कुमार शर्मा',
    auth_username: 'उपयोगकर्ता नाम',
    auth_username_placeholder: 'उदा. rishi_s',
    auth_company_name: 'एमएसएमई / उद्यम का नाम',
    auth_company_placeholder: 'उदा. एपेक्स प्योरवाटर इनोवेशंस प्रा. लि.',
    auth_email: 'ईमेल पता',
    auth_email_placeholder: 'name@company.com',
    auth_password: 'पासवर्ड',
    auth_password_placeholder: '••••••••',
    auth_btn_login: 'पोर्टल में साइन इन करें',
    auth_btn_register: 'एमएसएमई खाता बनाएं',
    auth_err_email_invalid: 'कृपया एक मान्य ईमेल पता दर्ज करें।',
    auth_err_fullname_invalid: 'पूरे नाम में केवल अंग्रेज़ी अक्षर और शब्दों के बीच एकल स्पेस होना चाहिए।',
    auth_err_username_invalid: 'उपयोगकर्ता नाम 3–30 वर्णों का होना चाहिए और इसमें केवल अक्षर, संख्याएं और अंडरस्कोर हो सकते हैं।',
    auth_err_username_taken: 'यह उपयोगकर्ता नाम पहले से लिया जा चुका है।',
    auth_err_generic: 'इस समय साइन इन करने में असमर्थ। कृपया पुन: प्रयास करें।',
    auth_err_demo: 'डेमो सत्र आरंभ करने में विफल।',
    auth_card_role: 'भूमिका',
    auth_card_start: 'उत्पाद विश्लेषण शुरू करें',
    auth_card_signout: 'साइन आउट',
    profile_label_username: 'उपयोगकर्ता नाम',
    profile_label_fullname: 'पूरा नाम',

    // Standards Page
    standards_title: 'प्रासंगिक मानक',
    standards_subtitle: 'आपके उत्पाद तथ्यों और नियम मूल्यांकन पर आधारित।',
    standards_insufficient_title: 'लागू मानक निर्धारित करने के लिए अपर्याप्त साक्ष्य',
    standards_insufficient_desc: 'उपलब्ध कराए गए तकनीकी मापदंडों से कोई प्रकाशित भारतीय मानक (BIS) या वैधानिक गुणवत्ता नियंत्रण आदेश मेल नहीं खाता।',
    standards_badge_mandatory: 'अनिवार्य भारतीय मानक',
    standards_badge_gazette: 'राजपत्र QCO आधारित',
    standards_view_source: 'मानक स्रोत देखें',
    standards_why_applies: 'यह मानक क्यों लागू होता है:',

    // Requirements Page
    req_title: 'आपके उत्पाद के लिए आवश्यकताएं',
    req_completed: 'पूर्ण',
    req_col_req: 'आवश्यकता',
    req_col_why: 'यह आवश्यकता क्यों लागू होती है',
    req_col_source: 'स्रोत',
    req_col_status: 'स्थिति',
    req_no_reqs: 'वर्तमान उत्पाद मापदंडों के लिए कोई अनिवार्य आवश्यकता नहीं मिली।',
    req_status_verified: 'सत्यापित',
    req_status_action: 'कार्रवाई आवश्यक',
    req_status_pending: 'लंबित',

    // Risks Page
    risks_title: 'संभावित अनुपालन जोखिम – परीक्षण से पहले',
    risks_subtitle: 'वर्तमान उत्पाद जानकारी के आधार पर पहचाने गए जोखिम।',
    risks_no_risks_title: 'कोई अनुपालन जोखिम स्थापित नहीं हुआ',
    risks_no_risks_desc: 'उपलब्ध साक्ष्यों के आधार पर कोई महत्वपूर्ण अनुपालन विफलता या सामग्री संबंधी भेद्यता नहीं पाई गई।',
    risks_why_matters: 'यह क्यों महत्वपूर्ण है:',
    risks_suggested_action: 'सुझाई गई कार्रवाई:',
    risks_severity_high: 'उच्च जोखिम',
    risks_severity_medium: 'मध्यम जोखिम',
    risks_severity_low: 'निम्न जोखिम',

    // Product Evidence Trail
    evidence_title: 'साक्ष्य श्रृंखला',
    evidence_subtitle: 'देखें कि प्रत्येक अनुपालन निष्कर्ष सत्यापित भारतीय मानकों द्वारा कैसे समर्थित है।',
    evidence_rule_label: 'नियम:',
    evidence_clause_citations: 'वैधानिक एवं मानक धारा उद्धरण',
    evidence_official_text: 'आधिकारिक मानक पाठ',
    evidence_open_portal: 'बीआईएस पोर्टल में मानक खोलें',
    evidence_rule_logic: 'निश्चित नियम तर्क',

    // Why Rule Applies & Rule Inspector
    why_rule_title: 'यह नियम क्यों लागू होता है',
    why_rule_step_fact: 'उत्पाद तथ्य',
    why_rule_step_rule: 'मूल्यांकित नियम',
    why_rule_step_evidence: 'साक्ष्य उद्धरण',
    why_rule_step_conclusion: 'अनुपालन निष्कर्ष',
    why_rule_btn_inspector: 'नियम तर्क जांचें',
    why_rule_btn_close: 'बंद करें',
    inspector_title: 'नियम निरीक्षक',
    inspector_logic: 'नियम तर्क',
    inspector_evidence: 'साक्ष्य एवं उद्धरण',
    inspector_sources: 'आधारभूत मानक',
    inspector_close: 'निरीक्षक बंद करें',
    // Rule Inspector & Evidence Labels
    rule_inspector_heading: 'नियम निरीक्षक',
    inspector_verified_badge: 'सत्यापित',
    inspector_outcome_heading: 'अनुपालन परिणाम',
    inspector_logic_heading: 'नियम तर्क',
    inspector_authoritative_badge: 'आधिकारिक',
    evidence_clause_label: 'धारा संदर्भ',
    evidence_source_label: 'मानक स्रोत',
    evidence_excerpt_label: 'साक्ष्य अंश',
    evidence_view_full_source: 'पूर्ण साक्ष्य श्रृंखला देखें',

    // Safe Abstention
    abstention_title: 'अधिक जानकारी या साक्ष्य की आवश्यकता है',
    abstention_desc: 'इस उत्पाद विशेषता के लिए विश्वसनीय निष्कर्ष प्रदान करने हेतु वर्तमान अनुक्रमित आधिकारिक स्रोतों में पर्याप्त साक्ष्य नहीं मिले।',
    abstention_badge: 'सुरक्षित संयम सक्रिय',
    abstention_prod_char: 'उत्पाद विशेषता',
    abstention_evidence_result: 'साक्ष्य खोज परिणाम',
    abstention_why_safe: 'हम संयम क्यों बरतते हैं',
    abstention_why_safe_desc: 'अनुमान लगाने या भ्रामक सलाह देने के बजाय, नियमवेद का सुरक्षित संयम आपको गलत विनियामक मार्गदर्शन से बचाता है।',
    abstention_btn_back: 'डैशबोर्ड पर वापस लौटें',
    abstention_btn_edit: 'उत्पाद पैरामीटर संपादित करें',

    // Footer
    footer_disclaimer: 'नियमवेद स्रोत-आधारित मार्गदर्शन प्रदान करता है और यह आधिकारिक बीआईएस प्रमाणन नहीं है। अंतिम अनुपालन मान्यता प्राप्त प्रयोगशालाओं द्वारा सत्यापित किया जाना चाहिए।',
    footer_rights: 'सर्वाधिकार सुरक्षित।',
    footer_academic_note: 'भारतीय एमएसएमई के लिए व्याख्यात्मक बीआईएस अनुपालन इंटेलिजेंस सहायक (SIH26107)।',

    // About Page
    about_badge: 'नियमवेद के बारे में',
    about_project: 'SIH26107 परियोजना पहल',
    about_title: 'भारतीय हार्डवेयर विनिर्माण के लिए विनियामक स्पष्टता',
    about_intro: 'नियमवेद (NiyamVeda) एक पारदर्शी एवं नियम-आधारित अनुपालन प्लेटफॉर्म है, जो निर्माताओं, हार्डवेयर इंजीनियरों और भारतीय एमएसएमई (MSME) को बीआईएस गुणवत्ता नियंत्रण आदेशों (QCO) को आसानी से समझने में सहायता करता है।',
    about_challenge_title: 'विनियामक चुनौतियां',
    about_challenge_intro: 'भारतीय विनियामक मानकों को समझना नवोदित उत्पाद टीमों के लिए कई जटिलताएं प्रस्तुत करता है:',
    about_challenge_1_title: 'राजपत्र के जटिल संदर्भ',
    about_challenge_1_text: 'गुणवत्ता नियंत्रण आदेश (QCO) अक्सर कई अलग-अलग मानकों और आधिकारिक दस्तावेजों के अनुभागों को संदर्भित करते हैं।',
    about_challenge_2_title: 'प्रयोज्यता में अस्पष्टता',
    about_challenge_2_text: 'यह तय करना कठिन हो सकता है कि उत्पाद के किन तकनीकी मापदंडों पर कौन सा मानक अनिवार्य रूप से लागू होगा।',
    about_challenge_3_title: 'परामर्श की उच्च लागत',
    about_challenge_3_text: 'एमएसएमई को केवल यह जानने के लिए महंगे परामर्श चक्रों से गुजरना पड़ता है कि किन परीक्षणों की आवश्यकता है।',
    about_approach_title: 'नियमवेद का दृष्टिकोण',
    about_approach_intro: 'नियमवेद विनियामक अनिश्चितता को स्पष्ट इंजीनियरिंग दिशा में बदलता है:',
    about_approach_1_title: 'मापदंड-संचालित तर्क',
    about_approach_1_text: 'वोल्टेज, वाटेज, सामग्री और उपयोग जैसे उत्पाद तथ्य यह तय करते हैं कि कौन सा नियम लागू होगा।',
    about_approach_2_title: 'प्रमाणित स्रोत ट्रेसेबिलिटी',
    about_approach_2_text: 'सभी सुझाव और परिणाम सीधे अनुक्रमित बीआईएस मानकों और आधिकारिक रिकॉर्ड से जुड़े होते हैं।',
    about_approach_3_title: 'परीक्षण-पूर्व जोखिम पहचान',
    about_approach_3_text: 'प्रयोगशाला परीक्षण और प्रोटोटाइप सत्यापन से पहले ही संभावित अनुपालन जोखिम सामने आ जाते हैं।',
    about_core_principle: 'मूल वास्तुशिल्प सिद्धांत',
    about_parameter_title: 'मापदंड-आधारित अनुपालन क्यों आवश्यक है',
    about_parameter_text_1: 'अनुपालन केवल एक सामान्य चेकलिस्ट नहीं है। विभिन्न इंजीनियरिंग मापदंडों से अलग-अलग वैधानिक आवश्यकताएं उत्पन्न होती हैं।',
    about_parameter_text_2: 'अनुपालन प्रक्रिया को तकनीकी तथ्यों से जोड़कर, मापदंडों में बदलाव के साथ पूरी रूपरेखा स्वचालित रूप से पुनः परिकलित होती है।',
    about_architecture_title: 'संरचना: सुदृढ़ नियम + प्रामाणिक साक्ष्य + एआई',
    about_architecture_desc: 'सत्यापनीय विनियामक स्पष्टता प्रदान करने के लिए सिस्टम के घटक कैसे मिलकर कार्य करते हैं।',
    about_pillar_1_title: 'निश्चित नियम इंजन',
    about_pillar_1_subtitle: 'शून्य विनियामक भ्रांति',
    about_pillar_1_desc: 'मानकों की प्रयोज्यता केवल निश्चित नियमों द्वारा निर्धारित होती है, न कि काल्पनिक एआई अनुमानों द्वारा।',
    about_pillar_2_title: 'प्रामाणिक स्रोत रजिस्ट्री',
    about_pillar_2_subtitle: 'धारा-स्तरीय ट्रेसेबिलिटी',
    about_pillar_2_desc: 'स्रोत रिकॉर्ड पूर्ण पारदर्शी ट्रेसेबिलिटी प्रदान करते हैं जहां आधिकारिक डेटा अनुक्रमित है।',
    about_pillar_3_title: 'सुरक्षित संयम सुरक्षा कवच',
    about_pillar_3_subtitle: 'उत्तरदायी सिस्टम व्यवहार',
    about_pillar_3_desc: 'जब तकनीकी तथ्य अपूर्ण हों या दायरे से बाहर हों, तो सिस्टम गलत सलाह देने के बजाय स्पष्ट रूप से रुक जाता है।',
    about_pillar_4_title: 'सख्त आधार पर एआई संश्लेषण',
    about_pillar_4_subtitle: 'व्याख्यात्मक अगले कदम',
    about_pillar_4_desc: 'एआई सारांश और स्पष्टीकरण में सहायता करता है, बिना किसी नियम परिणाम को बदले।',
    about_scope_label: 'अकादमिक एवं परियोजना दायरा',
    about_mission_title: 'नियमवेद का उद्देश्य',
    about_mission_text: 'नियमवेद को एक सहायक निर्णय-समर्थन ढांचे के रूप में विकसित किया गया है ताकि यह दर्शाया जा सके कि कैसे नियम इंजन और प्रामाणिक स्रोत विनियामक जानकारी को पारदर्शी सॉफ्टवेयर में बदल सकते हैं।',
    about_how_link: 'कार्यप्रणाली देखें',
    about_sources_link: 'विनियामक स्रोतों की जांच करें',

    // How It Works Page
    how_badge: 'नियमवेद वास्तुकला',
    how_project: 'एंड-टू-एंड कार्यप्रवाह',
    how_title: 'नियमवेद कैसे काम करता है',
    how_intro: 'नियमवेद एक मापदंड-संचालित अनुपालन प्रणाली है। यह उत्पाद के तकनीकी विवरणों को निश्चित नियमों और आधिकारिक साक्ष्यों द्वारा संरचित विनियामक मार्ग में बदलती है।',
    how_engine_label: 'मापदंड-संचालित इंजन',
    how_dynamic_title: 'उत्पाद तथ्यों के आधार पर अनुपालन परिणाम गतिशील रूप से बदलते हैं',
    how_dynamic_text: 'उत्पाद के विशिष्ट तकनीकी मापदंड यह निर्धारित करते हैं कि कौन से मानक, नियम, परीक्षण और आवश्यकताएं लागू होंगी।',
    how_test_product: 'अपने उत्पाद के साथ परीक्षण करें',
    how_live_demo: 'लाइव विश्लेषण डेमो देखें',
    how_dataflow: 'अनुपालन इंजन डेटा प्रवाह',
    how_pipeline_title: '8-चरणीय अनुपालन विश्लेषण पाइपलाइन',
    how_pipeline_desc: 'तकनीकी विनिर्देश शीट से संरचित अनुपालन आवश्यकताओं तक की यात्रा।',
    how_rag_badge: 'निश्चित तर्क + RAG',
    how_operates: 'यह कैसे संचालित होता है:',
    how_abstention_badge: 'विनियामक सत्यनिष्ठा द्वार',
    how_abstention_title: 'सुरक्षित संयम: काल्पनिक सलाह से आपकी सुरक्षा',
    how_abstention_text: 'यदि महत्वपूर्ण तकनीकी जानकारी अनुपलब्ध हो या उत्पाद दायरे से बाहर हो, तो नियमवेद अनुमान नहीं लगाता। यह अपर्याप्त साक्ष्य की रिपोर्ट करता है और आवश्यक जानकारी दर्शाता है।',
    how_whatif_label: 'इंटरैक्टिव निर्णय समर्थन',
    how_whatif_title: 'व्हाट-इफ मापदंड सिमुलेशन आज़माएं',
    how_whatif_text: 'डिजाइन को अंतिम रूप देने से पहले तकनीकी मापदंडों में बदलाव करके देखें कि मानकों और परीक्षणों पर क्या प्रभाव पड़ता है।',
    how_whatif_button: 'व्हाट-इफ सिम्युलेटर शुरू करें',

    // How It Works Steps
    how_step_1_title: 'उत्पाद विवरण दर्ज करें',
    how_step_1_cat: 'इनपुट',
    how_step_1_desc: 'बुनियादी उत्पाद जानकारी प्रदान करें।',
    how_step_1_detail: 'उत्पाद तथ्य इनपुट प्रोफाइल बन जाते हैं।',
    how_step_2_title: 'तकनीकी डेटाशीट / पीडीएफ अपलोड करें',
    how_step_2_cat: 'डेटा अंतर्ग्रहण',
    how_step_2_desc: 'समर्थित तकनीकी पीडीएफ अपलोड करें।',
    how_step_2_detail: 'बैकएंड समर्थित पीडीएफ पाठ का विश्लेषण कर सकता है।',
    how_step_3_title: 'तथ्य सत्यापन एवं संरचना',
    how_step_3_cat: 'सत्यापन',
    how_step_3_desc: 'निकाले गए तकनीकी तथ्यों की समीक्षा करें।',
    how_step_3_detail: 'सत्यापित तथ्य निश्चित उत्पाद प्रोफाइल बनाते हैं।',
    how_step_4_title: 'निश्चित बीआईएस नियम लागू करें',
    how_step_4_cat: 'नियम इंजन',
    how_step_4_desc: 'उपलब्ध नियमों के विरुद्ध तथ्यों का मूल्यांकन करें।',
    how_step_4_detail: 'नियम तर्क मानकों की प्रयोज्यता निर्धारित करता है।',
    how_step_5_title: 'लागू मानकों एवं आवश्यकताओं का मिलान',
    how_step_5_cat: 'रजिस्ट्री मैपिंग',
    how_step_5_desc: 'लागू नियमों को अनुक्रमित स्रोतों से जोड़ें।',
    how_step_5_detail: 'प्रासंगिक साक्ष्यों का निरीक्षण किया जा सकता है।',
    how_step_6_title: 'अनुपालन विश्लेषण उत्पन्न करें',
    how_step_6_cat: 'मीट्रिक संश्लेषण',
    how_step_6_desc: 'वर्तमान विश्लेषण मेट्रिक्स की गणना करें।',
    how_step_6_detail: 'परिणाम सक्रिय नियमों के निष्कर्ष दर्शाते हैं।',
    how_step_7_title: 'जोखिम, साक्ष्य एवं प्रमाणन मार्ग की समीक्षा',
    how_step_7_cat: 'जोखिम एवं ऑडिट ट्रेल',
    how_step_7_desc: 'जोखिमों और साक्ष्यों की समीक्षा करें।',
    how_step_7_detail: 'उपलब्ध स्रोत जानकारी समीक्षा का समर्थन करती है।',
    how_step_8_title: 'मापदंड परिवर्तन परीक्षण हेतु व्हाट-इफ सिमुलेशन',
    how_step_8_cat: 'गतिशील सिमुलेशन',
    how_step_8_desc: 'तकनीकी मापदंडों के बदलावों का परीक्षण करें।',
    how_step_8_detail: 'परिदृश्य के लिए विश्लेषण पुनः परिकलित होता है।',

    // How It Works Flow Pills
    how_flow_1: 'उत्पाद विवरण',
    how_flow_2: 'पीडीएफ',
    how_flow_3: 'तथ्य सत्यापन',
    how_flow_4: 'नियम',
    how_flow_5: 'मानक',
    how_flow_6: 'आवश्यकताएं',
    how_flow_7: 'विश्लेषण',
    how_flow_8: 'व्हाट-इफ',
  },

  bn: {
    // Navigation
    nav_how_it_works: 'কাজের পদ্ধতি',
    nav_sources: 'উৎস নির্দেশিকা',
    nav_about_us: 'আমাদের সম্পর্কে',
    nav_assistant: 'এআই সহকারী',
    nav_profile: 'প্রোফাইল',
    nav_sign_in: 'সাইন ইন',
    nav_sign_out: 'সাইন আউট',
    nav_start_analysis: 'বিশ্লেষণ শুরু করুন',
    nav_start: 'শুরু করুন',
    nav_tagline: 'পণ্য থেকে মানের স্বচ্ছতা',
    nav_profile_tooltip: 'প্রোফাইল ও পণ্য দেখুন',
    theme_toggle_dark: 'ডার্ক মোড চালু করুন',
    theme_toggle_light: 'লাইট মোড চালু করুন',
    theme_toggle_aria: 'থিম পরিবর্তন করুন',
    language_selector: 'ভাষা',

    // Common UI
    common_save: 'সংরক্ষণ করুন',
    common_cancel: 'বাতিল',
    common_close: 'বন্ধ করুন',
    common_continue: 'চালিয়ে যান',
    common_back: 'পূর্ববর্তী',
    common_loading: 'লোড হচ্ছে...',
    common_verified: 'যাচাইকৃত',
    common_clear: 'মুছুন',
    common_status: 'অবস্থা',
    common_action: 'পদক্ষেপ',
    common_processing: 'প্রক্রিয়াকরণ চলছে...',
    common_start: 'শুরু করুন',
    common_home: 'হোম',

    // Sidebar Tooltips
    sidebar_product: 'পণ্যের তথ্য',
    sidebar_analysis: 'সম্মতি ড্যাশবোর্ড',
    sidebar_why_rule: 'কেন এই নিয়ম প্রযোজ্য',
    sidebar_inspector: 'নিয়ম পরিদর্শক',
    sidebar_standards: 'প্রাসঙ্গিক মানদণ্ড',
    sidebar_requirements: 'প্রয়োজনীয়তার চেকলিস্ট',
    sidebar_risks: 'সম্ভাব্য ঝুঁকি',
    sidebar_simulation: 'হোয়াট-ইফ সিমুলেশন',
    sidebar_sources: 'প্রমাণ শৃঙ্খল',
    sidebar_abstention: 'নিরাপদ পরিহার',

    // Profile & Preferences
    profile_title: 'এমএসএমই প্রস্তুতকারক প্রোফাইল',
    profile_desc: 'আপনার সংস্থার বিবরণ, নিবন্ধিত পণ্য এবং নিয়ন্ত্রক পছন্দগুলি পরিচালনা করুন।',
    profile_account_security: 'অ্যাকাউন্ট সুরক্ষা',
    profile_preferences: 'ইন্টারফেস পছন্দসমূহ',
    profile_my_products: 'আপনার নিবন্ধিত পণ্যসমূহ',
    profile_auth_required_title: 'প্রমাণীকরণ আবশ্যক',
    profile_auth_required_desc: 'আপনার প্রতিষ্ঠানের প্রোফাইল এবং পণ্য দেখতে অনুগ্রহ করে সাইন ইন করুন অথবা ডেমো অ্যাক্সেস ব্যবহার করুন।',
    profile_btn_signin: 'আপনার অ্যাকাউন্টে সাইন ইন করুন',
    profile_btn_demo: 'তাত্ক্ষণিক পরীক্ষক ডেমো অ্যাক্সেস',
    profile_joined: 'যোগদান করেছেন',
    profile_active_member: 'সক্রিয় সদস্য',
    profile_btn_new_project: 'নতুন সম্মতি প্রকল্প',
    profile_sec_pwd_title: 'পাসওয়ার্ড প্রমাণীকরণ',
    profile_sec_pwd_desc: 'সল্টেড পাসওয়ার্ড প্রমাণীকরণ সক্রিয়',
    profile_sec_pwd_badge: 'নিরাপদ',
    profile_sec_session_title: 'সেশন পরিচালনা',
    profile_sec_session_desc: 'সার্ভার-সাইড হ্যাশ করা সেশন টোকেন',
    profile_sec_session_badge: 'সক্রিয়',
    profile_sec_token_title: 'টোকেন মেয়াদের সময়সীমা',
    profile_sec_token_desc: 'স্বয়ংক্রিয় ২৪-ঘণ্টা মেয়াদোত্তীর্ণতা পরীক্ষা',
    profile_sec_token_badge: '২৪ ঘণ্টা',
    profile_pref_lang: 'সিস্টেমের ভাষা / Language',
    profile_pref_theme: 'বাহ্যিক রূপ / থিম',
    profile_theme_dark: 'ডার্ক মোড',
    profile_theme_light: 'লাইট মোড',
    profile_copilot_title: 'নিয়ন্ত্রক কোপাইলট',
    profile_copilot_desc: 'IS 302, IS 16240, ড্রাই-বয়েল টেস্ট বা MeitY CRS নিবন্ধন সম্পর্কে কোনো প্রশ্ন আছে?',
    profile_copilot_launch: 'কথোপকথন সহকারী চালু করুন',
    profile_products_sub: 'মূল্যায়িত পণ্য, সুনির্দিষ্ট নিয়মের ফলাফল এবং সক্রিয় কমপ্লায়েন্স ডসিয়ার।',
    profile_products_count: 'পণ্য',
    profile_loading_products: 'আপনার কমপ্লায়েন্স ডসিয়ার লোড হচ্ছে...',
    profile_no_products_title: 'এখনও কোনো পণ্য নিবন্ধিত হয়নি',
    profile_no_products_desc: 'প্রযোজ্য বিআইএস মান মূল্যায়ন করতে এবং একটি যাচাইকৃত সম্মতি পথরেখা তৈরি করতে আপনার পণ্য যুক্ত করুন।',
    profile_add_first_product: 'আপনার প্রথম পণ্য যুক্ত করুন',
    profile_voltage_na: 'ভোল্টেজ উল্লেখ করা হয়নি',
    profile_btn_analysis: 'বিশ্লেষণ',
    profile_btn_whatif: 'হোয়াট-ইফ',
    profile_btn_chat: 'চ্যাট',
    profile_chat_tooltip: 'এই পণ্যের প্রেক্ষাপটে সহকারীর সাথে কথা বলুন',
    profile_fact_material: 'উপাদান:',
    profile_fact_power: 'শক্তি:',
    profile_fact_origin: 'উৎপত্তি:',
    profile_inspect_facts: 'যাচাইকৃত তথ্য পরীক্ষা করুন',

    // Assistant & Drawer
    assistant_title: 'নিয়মবেদ এআই নিয়ন্ত্রক সহকারী',
    assistant_subtitle: 'ভারতীয় মানদণ্ড (BIS) এবং গুণমান নিয়ন্ত্রণ আদেশের (QCO) ভিত্তিতে তথ্যপূর্ণ সহায়তা।',
    assistant_placeholder: 'বিআইএস মানদণ্ড, ইলেকট্রিক কেটলি, আরও ওয়াটার পিউরিফায়ার সম্পর্কে জিজ্ঞাসা করুন...',
    assistant_send: 'প্রশ্ন পাঠান',
    assistant_quick_queries: 'প্রস্তাবিত নিয়ন্ত্রক প্রশ্নাবলী',
    assistant_select_product: 'পণ্যের বিবরণ যুক্ত করুন',
    assistant_no_product: 'সাধারণ বিআইএস অনুসন্ধান (কোনো নির্দিষ্ট পণ্য ব্যতীত)',
    assistant_citations: 'অনুমোদিত মানদণ্ড উদ্ধৃতি',
    assistant_abstention_badge: 'নিরাপদ পরিহার সক্রিয়',
    assistant_disclaimer: 'নিয়মবেদ নির্ভরযোগ্য তথ্য প্রদান করে, এটি চূড়ান্ত সরকারি বিআইএস সার্টিফিকেট নয়। অনুমোদিত ল্যাবরেটরি দ্বারা যাচাই বাধ্যতামূলক।',
    assistant_grounded_badge: 'বিআইএস ভিত্তিক',
    assistant_insufficient_badge: 'অপর্যাপ্ত সাক্ষ্য',
    assistant_evasion_badge: 'অনুরোধ অবরুদ্ধ',
    assistant_context_active: 'সক্রিয় প্রেক্ষাপট:',
    assistant_eval_against: 'এর ভিত্তিতে মূল্যায়ন করা হচ্ছে',
    assistant_clear_context: 'প্রেক্ষাপট মুছুন',
    assistant_official_source: 'অফিসিয়াল স্ট্যান্ডার্ড সোর্স',
    assistant_verified_badge: 'যাচাইকৃত',
    assistant_loading: 'অনুমোদিত ভারতীয় মান অনুসন্ধান ও প্রেক্ষাপট মূল্যায়ন করা হচ্ছে...',
    assistant_error_connect: 'সংযোগের ক্ষেত্রে সাময়িক ত্রুটি দেখা দিয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।',
    assistant_page_loading: 'নিয়ন্ত্রক সহকারী লোড হচ্ছে...',
    drawer_btn_ask: 'কমপ্লায়েন্স কোপাইলটকে জিজ্ঞাসা করুন',
    drawer_title: 'নিয়ন্ত্রক সহকারী',
    drawer_context_label: 'প্রেক্ষাপট:',
    drawer_fullscreen: 'ফুলস্ক্রিনে খুলুন',
    drawer_verified_sources: 'যাচাইকৃত উৎসসমূহ:',
    drawer_checking: 'বিআইএস মান ও নিয়মাবলী পরীক্ষা করা হচ্ছে...',
    drawer_chip_standards: 'কোন কোন মান প্রযোজ্য?',
    drawer_chip_tests: 'প্রয়োজনীয় ল্যাব টেস্ট?',
    drawer_chip_crs: 'সিআরএস নিবন্ধন?',
    drawer_placeholder: 'বিআইএস সম্মতি সম্পর্কে জিজ্ঞাসা করুন...',
    drawer_welcome_generic: 'নমস্কার! আমি আপনার নিয়মবেদ নিয়ন্ত্রক কোপাইলট। আমাকে ভারতীয় মানদণ্ড (BIS), গুণমান নিয়ন্ত্রণ আদেশ বা সার্টিফিকেশন প্রক্রিয়া সম্পর্কে জিজ্ঞাসা করুন।',
    drawer_welcome_product: 'নমস্কার! আমি এই পণ্যের জন্য আপনার নিয়ন্ত্রক সম্মতি কোপাইলট। প্রযোজ্য বিআইএস মান, ল্যাব টেস্ট পদ্ধতি বা যেকোনো প্রশ্ন আমাকে করতে পারেন।',

    // Hero & Landing
    hero_badge_ai: 'এআই-সহায়তাপ্রাপ্ত',
    hero_badge_rule: 'নিয়ম-ভিত্তিক',
    hero_badge_source: 'উৎস-যাচাইকৃত',
    hero_title_prefix: 'আপনার পণ্যের',
    hero_title_middle: 'মানক সম্মতির',
    hero_title_suffix: 'পথরেখা জানুন',
    hero_subtext: 'সুনির্দিষ্ট পণ্য বিশ্লেষণ। নিয়ম-ভিত্তিক মূল্যায়ন। প্রামাণ্য তথ্য। স্পষ্ট পরবর্তী পদক্ষেপ।',
    btn_analyse_product: 'পণ্য বিশ্লেষণ করুন',
    btn_explore_how_it_works: 'কাজের পদ্ধতি দেখুন',
    badge_msme: 'ভারতীয় এমএসএমই এবং স্টার্টআপের জন্য নির্মিত',
    steps_heading: 'নিয়মবেদ ৪টি সহজ ধাপে কাজ করে',
    step_1_title: 'পণ্য সংজ্ঞায়িত করুন',
    step_1_desc: 'সহজ ধাপে পণ্যের বিবরণ প্রদান করুন।',
    step_2_title: 'নিয়ম মূল্যায়ন',
    step_2_desc: 'সিস্টেম প্রযোজ্য ভারতীয় মান ও নিয়ম পরীক্ষা করে।',
    step_3_title: 'প্রমাণ পর্যালোচনা',
    step_3_desc: 'অফিসিয়াল গেজেট ও মানের সাথে মিলসাধন।',
    step_4_title: 'সম্মতি পথরেখা',
    step_4_desc: 'প্রয়োজনীয়তা, ল্যাব টেস্ট এবং নির্দেশিকা পান।',
    badge_evidence: 'প্রমাণ-ভিত্তিক',
    badge_source_traceable: 'উৎস-অনুসন্ধানযোগ্য',
    badge_rule_based: 'নিয়ম-ভিত্তিক',
    badge_msme_friendly: 'এমএসএমই বান্ধব',

    // Analysis Dashboard
    metric_relevant_standards: 'প্রাসঙ্গিক মান',
    metric_key_requirements: 'প্রধান প্রয়োজনীয়তা',
    metric_evidence_confidence: 'প্রমাণের নির্ভরযোগ্যতা',
    metric_attention_needed: 'মনোযোগ প্রয়োজন',
    metric_identified: 'চিহ্নিত',
    metric_criteria: 'শর্তাবলী',
    metric_areas: 'বিষয়',
    summary_heading: 'সম্মতি সারাংশ',
    summary_subheading: 'প্রযোজ্য কোয়ালিটি কন্ট্রোল অর্ডার (QCO) এবং বাধ্যতামূলক মানের নিয়ম-ভিত্তিক বিশ্লেষণ।',
    attention_heading: 'কোথায় নজর দিতে হবে?',
    attention_subheading: 'যেসব বিষয় ল্যাবরেটরি পরীক্ষণ বা ইঞ্জিনিয়ারিং পর্যালোচনার দাবি রাখে।',
    attention_all_clear: 'সকল প্রয়োজনীয় মানদণ্ড সন্তোষজনক এবং কোনো জটিল সতর্কতা নেই।',
    why_applies_heading: 'কেন এই মানগুলি প্রযোজ্য?',
    why_applies_subheading: 'পণ্যের যে সমস্ত প্রযুক্তিগত বৈশিষ্ট্য এই বাধ্যতামূলক মানগুলিকে নির্ধারণ করেছে।',
    pathway_heading: 'আপনার সম্মতি পথরেখা',
    btn_view_detailed_analysis: 'বিস্তারিত বিশ্লেষণ দেখুন',
    btn_inspect_rule: 'প্রযোজ্য নিয়ম যাচাই করুন',
    status_completed: 'সম্পন্ন',
    status_in_progress: 'চলমান',
    status_pending: 'অপেক্ষমাণ',
    analysis_strong: 'দৃঢ়',
    analysis_moderate: 'মধ্যম',
    analysis_abstaining: 'পরিহারকারী',
    analysis_preliminary: 'প্রাথমিক',
    analysis_ready: 'প্রস্তুত',
    analysis_ask_copilot: 'কোপাইলটকে জিজ্ঞাসা করুন',
    analysis_standards_identified: 'বাধ্যতামূলক মান চিহ্নিত',
    analysis_statutory_reqs: 'বিধিবদ্ধ প্রয়োজনীয়তা',
    analysis_requiring_attention: 'দৃষ্টি আকর্ষণকারী বিষয়',
    analysis_action_items: 'পদক্ষেপযোগ্য বিষয়',
    analysis_action_required: 'পদক্ষেপ আবশ্যক',
    analysis_all_clear_badge: 'সব ঠিক আছে',
    analysis_incomplete_params: 'সুনির্দিষ্ট ম্যাপিংয়ের জন্য অপর্যাপ্ত প্যারামিটার',
    analysis_category: 'বিভাগ:',
    analysis_status: 'অবস্থা:',
    analysis_risk: 'ঝুঁকি',
    analysis_mitigation: 'সমাধান:',
    analysis_modal_view: 'সম্পূর্ণ মডাল দৃশ্য',
    analysis_physical_facts: 'কারিগরি বৈশিষ্ট্য যা কোনো এআই বিভ্রম ছাড়াই প্রযোজ্য মান নির্ধারণ করেছে।',
    analysis_deterministic_badge: 'সুনির্দিষ্ট নিয়ম',
    analysis_product_facts: 'পণ্যের তথ্য',
    analysis_view_inspector: 'নিয়ম পরিদর্শক দেখুন',
    analysis_rule_provenance: 'নিয়মের উৎস ও ইঞ্জিনিয়ারিং যুক্তি',
    analysis_modal_close: 'বন্ধ করুন',
    analysis_default_eval: 'প্রকাশিত ভারতীয় মানদণ্ড ব্যুরো (BIS) ও বাধ্যতামূলক কোয়ালিটি কন্ট্রোল অর্ডারের (QCO) ভিত্তিতে মূল্যায়িত।',

    // Forms & PDF Extraction
    form_product_def: 'পণ্যের বিবরণ',
    form_product_name: 'পণ্যের নাম',
    form_category: 'পণ্যের বিভাগ',
    form_intended_use: 'ব্যবহারের উদ্দেশ্য',
    form_operating_voltage: 'ভোল্টেজ রেটিং',
    form_power_consumption: 'বিদ্যুৎ খরচ (ওয়াট)',
    form_water_storage: 'ধারণক্ষমতা',
    form_material_comp: 'উপাদানের বিবরণ',
    form_tech_specs: 'প্রযুক্তিগত বৈশিষ্ট্য',
    pdf_upload_title: 'স্পেসিফিকেশন শিট আপলোড করুন',
    pdf_upload_prompt: 'পিডিএফ ফাইল ড্রপ করুন বা ব্রাউজ করতে ক্লিক করুন',
    pdf_verification_title: 'পিডিএফ তথ্যের যাচাইকরণ',
    pdf_verification_notice: 'বিশ্লেষণ শুরু করার আগে অনুগ্রহ করে নথি থেকে সংগৃহীত প্রযুক্তিগত তথ্যাবলি যাচাই করুন।',
    btn_confirm_facts: 'সংগৃহীত তথ্য নিশ্চিত করুন',
    btn_submit_analysis: 'বিশ্লেষণ শুরু করুন',
    btn_save_continue: 'সংরক্ষণ ও পরবর্তী ধাপ',
    btn_back: 'পূর্ববর্তী',

    // Product New Form
    product_new_step_1: 'পণ্যের সংজ্ঞা',
    product_new_step_2: 'প্রযুক্তিগত বিবরণ',
    product_new_step_3: 'উৎপাদন',
    product_new_step_4: 'বাজার তথ্য',
    product_new_step_5: 'পর্যালোচনা',
    product_new_title: 'পণ্যের সংজ্ঞা',
    product_new_name_label: 'পণ্যের বাণিজ্যিক নাম',
    product_new_cat_label: 'পণ্যের বিভাগ',
    product_new_cat_household: 'গৃহস্থালি বৈদ্যুতিক সরঞ্জাম (ওয়াটার ফিল্টার)',
    product_new_cat_electronics: 'ইলেকট্রনিক্স ও আইটি পণ্য',
    product_new_cat_plastic: 'খাদ্য যোগাযোগের প্লাস্টিক সামগ্রী',
    product_new_use_label: 'উদ্দেশ্যপ্রণোদিত ব্যবহার / অ্যাপ্লিকেশন',
    product_new_mat_label: 'উপাদান / রাসায়নিক গঠন',
    product_new_tech_label: 'মূল প্রযুক্তিগত বৈশিষ্ট্য',
    product_new_docs_title: 'সহায়ক নথিপত্র',
    product_new_docs_optional: '(ঐচ্ছিক)',
    product_new_docs_attached: 'যুক্ত হয়েছে',
    product_new_docs_file: 'ফাইল',
    product_new_docs_files: 'ফাইল',
    product_new_upload_drag: 'ডাটাশিট, টেস্ট রিপোর্ট বা ব্রোশার আপলোড করুন',
    product_new_upload_hint: 'ব্রাউজ করতে ক্লিক করুন অথবা টেনে এনে ছেড়ে দিন (PDF, DOC, JPG সর্বোচ্চ 10MB)',
    product_new_uploading: 'নিয়মবেদে আপলোড হচ্ছে...',
    product_new_verified: 'যাচাইকৃত',
    product_new_remove_file: 'ফাইল মুছুন',
    product_new_disclaimer: 'সহায়ক নথি অতিরিক্ত প্রেক্ষাপট প্রদান করে কিন্তু অফিসিয়াল নিয়ন্ত্রক উৎসের বিকল্প নয়।',
    product_new_pdf_verify_title: 'পিডিএফ তথ্য যাচাইকরণ',
    product_new_pdf_extracted_badge: 'নথি থেকে সংগৃহীত',
    product_new_pdf_verify_notice: 'বিশ্লেষণ শুরু করার আগে সংগৃহীত তথ্যাবলি যাচাই করুন। প্রয়োজনে নিচের মান পরিবর্তন করতে পারেন।',
    product_new_voltage_label: 'অপারেটিং ভোল্টেজ',
    product_new_power_label: 'বিদ্যুৎ খরচ',
    product_new_capacity_label: 'ধারণক্ষমতা',
    product_new_material_label: 'উপাদান গঠন',
    product_new_btn_confirm_facts: 'যাচাইকৃত তথ্য নিশ্চিত করুন',
    product_new_verified_success: 'সংগৃহীত প্যারামিটার সফলভাবে পণ্য প্রোফাইলে প্রয়োগ করা হয়েছে।',
    product_new_btn_save_draft: 'খসড়া সংরক্ষণ করুন',
    product_new_btn_continue: 'চালিয়ে যান',
    product_new_file_limit_err: '১০ মেগাবাইট ফাইল সাইজ সীমা অতিক্রম করেছে।',
    product_new_file_fail_err: 'ফাইল আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',

    // Product Facts Confirmation
    confirm_step_badge: 'ধাপ ৩: তথ্য যাচাইকরণ',
    confirm_title: 'আমরা যা বুঝলাম তা নিশ্চিত করুন',
    confirm_subtitle: 'বিআইএস মান মূল্যায়নের পূর্বে সংগৃহীত তথ্যগুলি পর্যালোচনা করুন। আপনি সরাসরি যেকোনো মান পরিবর্তন করতে পারেন।',
    confirm_origin_extracted: 'নথি থেকে সংগৃহীত',
    confirm_origin_manufacturer: 'প্রস্তুতকারক প্রদত্ত',
    confirm_notice: 'এই প্যারামিটারগুলি নিয়মবেদের নিয়ম ইঞ্জিনের মূল ইনপুট। এগুলির পরিবর্তন প্রযোজ্য ভারতীয় মান ও ল্যাব টেস্টকে সরাসরি প্রভাবিত করবে।',
    confirm_btn_upload_another: 'অন্য নথি আপলোড করুন',
    confirm_btn_run_analysis: 'নিশ্চিত করুন ও সম্মতি বিশ্লেষণ শুরু করুন',
    confirm_evaluating: 'নিয়ম মূল্যায়ন করা হচ্ছে...',

    // Simulation
    sim_title: 'হোয়াট-ইফ সম্মতি সিমুলেশন',
    sim_subtitle: 'পণ্যের উপকরণ বা ভোল্টেজ পরিবর্তন করে দেখুন কীভাবে প্রযোজ্য মান ও ল্যাব টেস্ট পরিবর্তিত হয়।',
    sim_current_profile: 'বর্তমান পণ্যের রূপরেখা',
    sim_result_profile: 'সিমুলেটেড পণ্যের রূপরেখা',
    sim_btn_run: 'সিমুলেট করুন',
    sim_diff_standards: 'মান পরিবর্তনের তুলনা',
    sim_retained: 'অপরিবর্তিত মান',
    sim_added: 'নতুন যুক্ত মান',
    sim_removed: 'বাদ পড়া মান',
    sim_provenance: 'যৌক্তিক বিশ্লেষণ ও কারণ',
    sim_header_title: 'পণ্য পরিবর্তন করলে কী ঘটবে?',
    sim_header_desc: 'দেখুন কীভাবে পণ্যের বৈশিষ্ট্য পরিবর্তন সম্মতি পথরেখাকে প্রভাবিত করে।',
    sim_change_attrs: 'পণ্যের বৈশিষ্ট্য পরিবর্তন করুন',
    sim_attr_material: 'উপাদান',
    sim_attr_voltage: 'অপারেটিং ভোল্টেজ',
    sim_attr_use: 'ব্যবহারের উদ্দেশ্য',
    sim_btn_recalculate: 'সম্মতি পথরেখা পুনরায় হিসাব করুন',
    sim_simulating: 'সিমুলেশন চলছে...',
    sim_impact_summary: 'প্রভাবের সারাংশ',
    sim_provenance_note: 'সমস্ত সিমুলেশন পার্থক্য কোনো এআই বিভ্রম ছাড়াই নিয়মবেদের সুনির্দিষ্ট ইঞ্জিন দ্বারা তৈরি হয়।',

    // Sources Directory Page
    sources_title: 'অনুমোদিত উৎস রেজিস্ট্রি',
    sources_subtitle: 'অফিসিয়াল ভারতীয় মান (IS), MeitY গেজেটভুক্ত বাধ্যতামূলক নিবন্ধন আদেশ (CRO) এবং QCO-এর সংকলন। নিয়মবেদের প্রতিটি নিয়ম সরাসরি এদের সাথে সম্পর্কিত।',
    sources_search_placeholder: 'মানদণ্ড বা গেজেট খুঁজুন...',
    sources_loading: 'নিবন্ধিত উৎসসমূহ লোড হচ্ছে...',
    sources_scope: 'প্রযোজ্য পরিধি',
    sources_effective: 'কার্যকর তারিখ:',
    sources_enforced: 'কার্যকর',
    sources_portal_link: 'অফিসিয়াল পোর্টাল',
    sources_no_results: 'কোনো মিল পাওয়া যায়নি।',

    // Auth Page
    auth_portal_subtitle: 'ভারতীয় এমএসএমই-র জন্য নিরাপদ বিআইএস সম্মতি গোয়েন্দা পোর্টাল',
    auth_demo_badge: 'তাত্ক্ষণিক মূল্যায়ন মোড',
    auth_demo_desc: 'রাজেশ কুমার শর্মা (ওয়াটার পিউরিফায়ার এমএসএমই) হিসেবে ১-ক্লিকে সাইন ইন করুন',
    auth_demo_btn: '১-ক্লিক ডেমো সাইন ইন',
    auth_tab_login: 'সাইন ইন',
    auth_tab_register: 'অ্যাকাউন্ট তৈরি করুন',
    auth_full_name: 'পুরো নাম',
    auth_full_name_placeholder: 'যেমন: রাজেশ কুমার শর্মা',
    auth_username: 'ইউজারনেম',
    auth_username_placeholder: 'যেমন: rishi_s',
    auth_company_name: 'এমএসএমই / প্রতিষ্ঠানের নাম',
    auth_company_placeholder: 'যেমন: অ্যাপেক্স পিওরওয়াটার ইনোভেশনস প্রা. লি.',
    auth_email: 'ইমেইল ঠিকানা',
    auth_email_placeholder: 'name@company.com',
    auth_password: 'পাসওয়ার্ড',
    auth_password_placeholder: '••••••••',
    auth_btn_login: 'পোর্টালে সাইন ইন করুন',
    auth_btn_register: 'এমএসএমই অ্যাকাউন্ট তৈরি করুন',
    auth_err_email_invalid: 'অনুগ্রহ করে একটি বৈধ ইমেইল ঠিকানা লিখুন।',
    auth_err_fullname_invalid: 'পুরো নামে শুধুমাত্র ইংরেজি অক্ষর এবং শব্দের মাঝে একটি স্পেস থাকতে হবে।',
    auth_err_username_invalid: 'ইউজারনেম ৩–৩০ অক্ষরের হতে হবে এবং শুধুমাত্র অক্ষর, সংখ্যা ও আন্ডারস্কোর থাকতে পারে।',
    auth_err_username_taken: 'এই ইউজারনেমটি ইতিমধ্যে নেওয়া হয়েছে।',
    auth_err_generic: 'এই মুহূর্তে সাইন ইন করা সম্ভব হচ্ছে না। অনুগ্রহ করে আবার চেষ্টা করুন।',
    auth_err_demo: 'ডেমো সেশন শুরু করা যায়নি।',
    auth_card_role: 'ভূমিকা',
    auth_card_start: 'পণ্য বিশ্লেষণ শুরু করুন',
    auth_card_signout: 'সাইন আউট',
    profile_label_username: 'ইউজারনেম',
    profile_label_fullname: 'পুরো নাম',

    // Standards Page
    standards_title: 'প্রাসঙ্গিক মান',
    standards_subtitle: 'আপনার পণ্যের তথ্য এবং নিয়ম মূল্যায়নের ওপর ভিত্তি করে।',
    standards_insufficient_title: 'প্রযোজ্য মান নির্ধারণের জন্য অপর্যাপ্ত প্রমাণ',
    standards_insufficient_desc: 'প্রদত্ত প্রযুক্তিগত প্যারামিটারের সাথে কোনো প্রকাশিত ভারতীয় মানদণ্ড (BIS) বা সরকারি গুণমান নিয়ন্ত্রণ আদেশ মেলেনি।',
    standards_badge_mandatory: 'বাধ্যতামূলক ভারতীয় মান',
    standards_badge_gazette: 'গেজেট QCO ভিত্তিক',
    standards_view_source: 'মানদণ্ডের উৎস দেখুন',
    standards_why_applies: 'কেন এই মান প্রযোজ্য:',

    // Requirements Page
    req_title: 'আপনার পণ্যের প্রয়োজনীয়তা',
    req_completed: 'সম্পন্ন',
    req_col_req: 'প্রয়োজনীয়তা',
    req_col_why: 'কেন এটি প্রযোজ্য',
    req_col_source: 'উৎস',
    req_col_status: 'অবস্থা',
    req_no_reqs: 'বর্তমান পণ্যের তথ্যের জন্য কোনো বাধ্যতামূলক শর্ত পাওয়া যায়নি।',
    req_status_verified: 'যাচাইকৃত',
    req_status_action: 'পদক্ষেপ আবশ্যক',
    req_status_pending: 'অপেক্ষমাণ',

    // Risks Page
    risks_title: 'সম্ভাব্য সম্মতি ঝুঁকি – ল্যাব টেস্টের পূর্বে',
    risks_subtitle: 'বর্তমান পণ্যের তথ্যের ভিত্তিতে চিহ্নিত সম্ভাব্য ঝুঁকি।',
    risks_no_risks_title: 'কোনো সম্মতি ঝুঁকি পাওয়া যায়নি',
    risks_no_risks_desc: 'উপলব্ধ প্রমাণের ভিত্তিতে কোনো উল্লেখযোগ্য নিয়ন্ত্রক ব্যর্থতা বা উপাদানগত ত্রুটি চিহ্নিত হয়নি।',
    risks_why_matters: 'এটি কেন গুরুত্বপূর্ণ:',
    risks_suggested_action: 'প্রস্তাবিত পদক্ষেপ:',
    risks_severity_high: 'উচ্চ ঝুঁকি',
    risks_severity_medium: 'মাঝারি ঝুঁকি',
    risks_severity_low: 'স্বল্প ঝুঁকি',

    // Product Evidence Trail
    evidence_title: 'প্রমাণ শৃঙ্খল',
    evidence_subtitle: 'প্রতিটি সিদ্ধান্ত কীভাবে যাচাইকৃত ভারতীয় মান দ্বারা সমর্থিত তা বিস্তারিতভাবে জানুন।',
    evidence_rule_label: 'নিয়ম:',
    evidence_clause_citations: 'আইনগত ও মানক ধারার উদ্ধৃতি',
    evidence_official_text: 'অফিসিয়াল স্ট্যান্ডার্ড টেক্সট',
    evidence_open_portal: 'বিআইএস পোর্টালে মান দেখুন',
    evidence_rule_logic: 'সুনির্দিষ্ট নিয়ম যুক্তি',

    // Why Rule Applies & Rule Inspector
    why_rule_title: 'কেন এই নিয়ম প্রযোজ্য',
    why_rule_step_fact: 'পণ্যের তথ্য',
    why_rule_step_rule: 'মূল্যায়িত নিয়ম',
    why_rule_step_evidence: 'প্রমাণের উদ্ধৃতি',
    why_rule_step_conclusion: 'সম্মতি উপসংহার',
    why_rule_btn_inspector: 'নিয়মের যুক্তি পরীক্ষা করুন',
    why_rule_btn_close: 'বন্ধ করুন',
    inspector_title: 'নিয়ম পরিদর্শক',
    inspector_logic: 'নিয়ম যুক্তি',
    inspector_evidence: 'প্রমাণ ও উদ্ধৃতি',
    inspector_sources: 'ভিত্তি মানদণ্ড',
    inspector_close: 'পরিদর্শক বন্ধ করুন',
    // Rule Inspector & Evidence Labels
    rule_inspector_heading: 'নিয়ম পরিদর্শক',
    inspector_verified_badge: 'যাচাইকৃত',
    inspector_outcome_heading: 'সম্মতি ফলাফল',
    inspector_logic_heading: 'নিয়ম যুক্তি',
    inspector_authoritative_badge: 'কর্তৃত্বপূর্ণ',
    evidence_clause_label: 'ধারা রেফারেন্স',
    evidence_source_label: 'মানক উৎস',
    evidence_excerpt_label: 'প্রমাণ অংশ',
    evidence_view_full_source: 'সম্পূর্ণ প্রমাণ দেখুন',

    // Safe Abstention
    abstention_title: 'আরও তথ্য বা প্রমাণের প্রয়োজন',
    abstention_desc: 'এই পণ্য বৈশিষ্ট্যের জন্য সুনির্দিষ্ট সিদ্ধান্ত প্রদানের মতো পর্যাপ্ত তথ্য বর্তমানে অনুক্রমিত উৎসগুলিতে পাওয়া যায়নি।',
    abstention_badge: 'নিরাপদ পরিহার সক্রিয়',
    abstention_prod_char: 'পণ্যের বৈশিষ্ট্য',
    abstention_evidence_result: 'প্রমাণ অনুসন্ধানের ফলাফল',
    abstention_why_safe: 'কেন আমরা পরিহার করি',
    abstention_why_safe_desc: 'অনুমান বা কাল্পনিক তথ্য দেওয়ার পরিবর্তে নিয়মবেদের নিরাপদ পরিহার ব্যবস্থা আপনাকে ভুল নিয়ন্ত্রক পরামর্শ থেকে রক্ষা করে।',
    abstention_btn_back: 'ড্যাশবোর্ডে ফিরে যান',
    abstention_btn_edit: 'প্যারামিটার পরিবর্তন করুন',

    // Footer
    footer_disclaimer: 'নিয়মবেদ নির্ভরযোগ্য সহায়তা প্রদান করে, এটি চূড়ান্ত সরকারি বিআইএস সার্টিফিকেট নয়। অফিসিয়াল মানক দ্বারা চূড়ান্ত যাচাই আবশ্যক।',
    footer_rights: 'সর্বস্বত্ব সংরক্ষিত।',
    footer_academic_note: 'ভারতীয় এমএসএমই-র জন্য ব্যাখ্যামূলক বিআইএস কমপ্লায়েন্স ইন্টেলিজেন্স সহকারী (SIH26107)।',

    // About Page
    about_badge: 'নিয়মবেদ সম্পর্কে',
    about_project: 'SIH26107 প্রকল্প উদ্যোগ',
    about_title: 'ভারতীয় হার্ডওয়্যার শিল্পের জন্য নিয়ন্ত্রক তথ্যের গণতন্ত্রীকরণ',
    about_intro: 'নিয়মবেদ (NiyamVeda) একটি ব্যাখ্যামূলক কমপ্লায়েন্স প্ল্যাটফর্ম যা প্রস্তুতকারক, হার্ডওয়্যার ইঞ্জিনিয়ার এবং ভারতীয় এমএসএমই-কে স্বচ্ছ ও প্যারামিটার-চালিত মূল্যায়নের মাধ্যমে বিআইএস গুণমান নিয়ন্ত্রণ আদেশ (QCO) বুঝতে সহায়তা করে।',
    about_challenge_title: 'নিয়ন্ত্রক চ্যালেঞ্জসমূহ',
    about_challenge_intro: 'ভারতীয় নিয়ন্ত্রক নিয়মাবলী অনুসরণ করা নতুন উদ্ভাবক দলের পক্ষে বেশ জটিল:',
    about_challenge_1_title: 'জটিল গেজেট বিজ্ঞপ্তি ও রেফারেন্স',
    about_challenge_1_text: 'কোয়ালিটি কন্ট্রোল অর্ডারগুলি প্রায়শই একাধিক মানদণ্ড ও সরকারি নথির বিভিন্ন অনুচ্ছেদের সাথে সম্পর্কিত থাকে।',
    about_challenge_2_title: 'প্রযোজ্যতার অস্পষ্টতা',
    about_challenge_2_text: 'পণ্যের কোন নির্দিষ্ট প্যারামিটারের ভিত্তিতে একটি নিয়ম প্রযোজ্য হবে তা নির্ধারণ করা কঠিন হতে পারে।',
    about_challenge_3_title: 'প্রবেশে উচ্চ খরচ ও বাধা',
    about_challenge_3_text: 'কোন প্রয়োজনীয়তা এবং পরীক্ষাগুলির প্রতি নজর দেওয়া প্রয়োজন তা বুঝতে এমএসএমই-দের ব্যয়বহুল পরামর্শ নিতে হয়।',
    about_approach_title: 'নিয়মবেদের কর্মপদ্ধতি',
    about_approach_intro: 'নিয়মবেদ নিয়ন্ত্রক অনিশ্চয়তাকে কাঠামোগত ইঞ্জিনিয়ারিং স্বচ্ছতায় রূপান্তর করে:',
    about_approach_1_title: 'প্যারামিটার-চালিত যুক্তি',
    about_approach_1_text: 'ভোল্টেজ, ওয়াটেজ, উপাদান এবং ব্যবহারের উদ্দেশ্য ইত্যাদি তথ্যের ভিত্তিতে নিয়ম প্রযোজ্য হয়।',
    about_approach_2_title: 'প্রামাণ্য তথ্যের উৎস-সন্ধান',
    about_approach_2_text: 'সমস্ত সুপারিশ সরাসরি সিস্টেমের সংরক্ষিত মানদণ্ড এবং সরকারি রেকর্ডের সাথে সংযুক্ত থাকে।',
    about_approach_3_title: 'পরীক্ষাপূর্ব ঝুঁকি আবিষ্কার',
    about_approach_3_text: 'প্রোটোটাইপ ল্যাব টেস্টিং ও যাচাইয়ের আগেই সম্ভাব্য নিয়ন্ত্রক ঝুঁকিগুলি চিহ্নিত করা যায়।',
    about_core_principle: 'মূল স্থাপত্য নীতি',
    about_parameter_title: 'কেন প্যারামিটার-চালিত সম্মতি অত্যন্ত জরুরি',
    about_parameter_text_1: 'সম্মতি শুধুমাত্র একটি সাধারণ চেকলিস্ট নয়। বিভিন্ন ইঞ্জিনিয়ারিং বৈশিষ্ট্যের ভিত্তিতে বিভিন্ন নিয়ম প্রযোজ্য হয়।',
    about_parameter_text_2: 'কমপ্লায়েন্স পাইপলাইনকে পণ্যের তথ্যের সাথে সংযুক্ত করে, প্যারামিটার পরিবর্তনের সাথে সাথে সম্মতি পথরেখা স্বয়ংক্রিয়ভাবে পরিবর্তিত হয়।',
    about_architecture_title: 'স্থাপত্য: সুনির্দিষ্ট নিয়ম + প্রামাণ্য উৎস + এআই',
    about_architecture_desc: 'যাচাইযোগ্য স্পষ্টতা নিশ্চিত করতে সিস্টেমের উপাদানগুলি যেভাবে একসাথে কাজ করে।',
    about_pillar_1_title: 'সুনির্দিষ্ট নিয়ম ইঞ্জিন',
    about_pillar_1_subtitle: 'শূন্য নিয়ন্ত্রক বিভ্রম',
    about_pillar_1_desc: 'প্রযোজ্যতা নির্ধারিত হয় সুনির্দিষ্ট নিয়মভিত্তিক যুক্তির মাধ্যমে, কোনো জেনারেটিভ অনুমানের দ্বারা নয়।',
    about_pillar_2_title: 'অনুমোদিত উৎস রেজিস্ট্রি',
    about_pillar_2_subtitle: 'ধারা-ভিত্তিক উৎস ট্র্যাকিং',
    about_pillar_2_desc: 'উৎস রেকর্ডগুলি সম্পূর্ণ স্বচ্ছতা নিশ্চিত করে যেখানে অনুমোদিত তথ্য সংরক্ষিত থাকে।',
    about_pillar_3_title: 'নিরাপদ পরিহার ব্যবস্থা',
    about_pillar_3_subtitle: 'দায়িত্বশীল সিস্টেম আচরণ',
    about_pillar_3_desc: 'তথ্য অসম্পূর্ণ হলে বা সংরক্ষিত পরিধির বাইরে থাকলে, সিস্টেম ভুল তথ্য না দিয়ে সংযম অবলম্বন করে।',
    about_pillar_4_title: 'কঠোর উৎস-ভিত্তিক এআই সারসংক্ষেপ',
    about_pillar_4_subtitle: 'ব্যাখ্যামূলক পরবর্তী পদক্ষেপ',
    about_pillar_4_desc: 'এআই সারসংক্ষেপ ও নির্দেশিকা ব্যাখ্যায় সহায়তা করে, মূল ফলাফলে কোনো হেরফের না করে।',
    about_scope_label: 'একাডেমিক ও প্রকল্প পরিধি',
    about_mission_title: 'নিয়মবেদের লক্ষ্য',
    about_mission_text: 'নিয়মবেদ তৈরি করা হয়েছে একটি সহায়ক সিদ্ধান্ত-সমর্থন কাঠামো হিসেবে, যা দেখায় কীভাবে নিয়ম ইঞ্জিন ও প্রামাণ্য তথ্য নিয়ন্ত্রক নির্দেশিকাকে সহজ সফটওয়্যার সমাধানে রূপান্তর করে।',
    about_how_link: 'কাজের পদ্ধতি দেখুন',
    about_sources_link: 'নিয়ন্ত্রক উৎসসমূহ দেখুন',

    // How It Works Page
    how_badge: 'নিয়মবেদ স্থাপত্য',
    how_project: 'সম্পূর্ণ কর্মপ্রবাহ',
    how_title: 'নিয়মবেদ কীভাবে কাজ করে',
    how_intro: 'নিয়মবেদ একটি প্যারামিটার-চালিত কমপ্লায়েন্স সিস্টেম। এটি পণ্যের প্রযুক্তিগত বৈশিষ্ট্যকে সুনির্দিষ্ট নিয়ম ও প্রামাণ্য তথ্যের মাধ্যমে কাঠামোগত রূপরেখায় রূপান্তর করে।',
    how_engine_label: 'প্যারামিটার-চালিত ইঞ্জিন',
    how_dynamic_title: 'পণ্যের তথ্যের ভিত্তিতে নিয়ন্ত্রক ফলাফল স্বয়ংক্রিয়ভাবে পরিবর্তিত হয়',
    how_dynamic_text: 'পণ্যের প্রযুক্তিগত বৈশিষ্ট্যের ভিত্তিতে নির্ধারিত হয় কোন নিয়ম, মানদণ্ড এবং পরীক্ষাগুলি প্রযোজ্য হবে।',
    how_test_product: 'আপনার পণ্য দিয়ে পরীক্ষা করুন',
    how_live_demo: 'লাইভ বিশ্লেষণ ডেমো দেখুন',
    how_dataflow: 'কমপ্লায়েন্স ইঞ্জিনের ডেটাপ্রবাহ',
    how_pipeline_title: '৮-ধাপের সম্মতি বিশ্লেষণ প্রক্রিয়া',
    how_pipeline_desc: 'প্রযুক্তিগত স্পেসিফিকেশন শিট থেকে সম্পূর্ণ কাঠামোগত কমপ্লায়েন্স গাইডলাইন।',
    how_rag_badge: 'সুনির্দিষ্ট যুক্তি + RAG',
    how_operates: 'এটি যেভাবে পরিচালিত হয়:',
    how_abstention_badge: 'নিয়ন্ত্রক সততা পরীক্ষা',
    how_abstention_title: 'নিরাপদ পরিহার: কাল্পনিক বা ভুল পরামর্শ থেকে সুরক্ষা',
    how_abstention_text: 'প্রয়োজনীয় কারিগরি তথ্য অনুপস্থিত থাকলে বা পণ্যটি পরিধির বাইরে হলে, নিয়মবেদ অনুমান করে না। এটি অপর্যাপ্ত প্রমাণ নির্দেশ করে এবং কী তথ্য প্রয়োজন তা জানায়।',
    how_whatif_label: 'ইন্টারেক্টিভ সিদ্ধান্ত সমর্থন',
    how_whatif_title: 'হোয়াট-ইফ প্যারামিটার সিমুলেশন ব্যবহার করুন',
    how_whatif_text: 'চূড়ান্ত সিদ্ধান্ত নেওয়ার আগে পণ্যের উপাদান বা ভোল্টেজ পরিবর্তন করে দেখুন কীভাবে প্রযোজ্য মান ও নির্দেশিকা পরিবর্তিত হয়।',
    how_whatif_button: 'হোয়াট-ইফ সিমুলেটর চালু করুন',

    // How It Works Steps
    how_step_1_title: 'পণ্যের বিবরণ প্রদান করুন',
    how_step_1_cat: 'ইনপুট',
    how_step_1_desc: 'প্রাথমিক পণ্যের তথ্য দিন।',
    how_step_1_detail: 'পণ্যের তথ্যগুলি ইনপুট প্রোফাইলে পরিণত হয়।',
    how_step_2_title: 'স্পেসিফিকেশন শিট / পিডিএফ আপলোড করুন',
    how_step_2_cat: 'ইনজেশন',
    how_step_2_desc: 'সমর্থিত প্রযুক্তিগত পিডিএফ আপলোড করুন।',
    how_step_2_detail: 'ব্যাকএন্ড পিডিএফ থেকে তথ্য বিশ্লেষণ করতে সক্ষম।',
    how_step_3_title: 'তথ্য যাচাইকরণ ও সংগঠন',
    how_step_3_cat: 'যাচাইকরণ',
    how_step_3_desc: 'সংগৃহীত প্রযুক্তিগত তথ্যাবলি পর্যালোচনা করুন।',
    how_step_3_detail: 'যাচাইকৃত তথ্য সুনির্দিষ্ট পণ্যের প্রোফাইল গঠন করে।',
    how_step_4_title: 'সুনির্দিষ্ট বিআইএস নিয়ম প্রয়োগ',
    how_step_4_cat: 'নিয়ম ইঞ্জিন',
    how_step_4_desc: 'উপলব্ধ নিয়মের বিপরীতে তথ্য মূল্যায়ন করুন।',
    how_step_4_detail: 'নিয়ম যুক্তি নির্ধারণ করে প্রযোজ্যতা।',
    how_step_5_title: 'প্রযোজ্য মান ও প্রয়োজনীয়তার ম্যাপিং',
    how_step_5_cat: 'রেজিস্ট্রি ম্যাপিং',
    how_step_5_desc: 'ম্যাচ করা নিয়মগুলিকে সংরক্ষিত উৎসের সাথে যুক্ত করুন।',
    how_step_5_detail: 'প্রাসঙ্গিক প্রমাণাদি পর্যবেক্ষণ করা যেতে পারে।',
    how_step_6_title: 'সম্মতি বিশ্লেষণ তৈরি',
    how_step_6_cat: 'মেট্রিক সংশ্লেষণ',
    how_step_6_desc: 'বর্তমান বিশ্লেষণ সূচক হিসাব করুন।',
    how_step_6_detail: 'ফলাফল সক্রিয় নিয়মের সমাপ্তি প্রতিফলিত করে।',
    how_step_7_title: 'ঝুঁকি, প্রমাণ এবং সার্টিফিকেশন পথ পর্যালোচনা',
    how_step_7_cat: 'ঝুঁকি ও নিরীক্ষা শৃঙ্খল',
    how_step_7_desc: 'ঝুঁকি এবং প্রমাণাদি বিস্তারিত পর্যালোচনা করুন।',
    how_step_7_detail: 'উপলব্ধ উৎস তথ্য পর্যালোচনায় সহায়তা করে।',
    how_step_8_title: 'প্যারামিটার পরিবর্তনের জন্য হোয়াট-ইফ সিমুলেশন',
    how_step_8_cat: 'গতিশীল সিমুলেশন',
    how_step_8_desc: 'প্রযুক্তিগত প্যারামিটার পরিবর্তন করে পরীক্ষা করুন।',
    how_step_8_detail: 'পরিস্থিতির জন্য বিশ্লেষণ পুনরায় গণনা করা হয়।',

    // How It Works Flow Pills
    how_flow_1: 'পণ্যের বিবরণ',
    how_flow_2: 'পিডিএফ',
    how_flow_3: 'তথ্য যাচাইকরণ',
    how_flow_4: 'নিয়মাবলী',
    how_flow_5: 'মানদণ্ড',
    how_flow_6: 'প্রয়োজনীয়তা',
    how_flow_7: 'বিশ্লেষণ',
    how_flow_8: 'হোয়াট-ইফ',
  },
};
