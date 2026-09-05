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
  nav_tagline: string;
  theme_toggle_dark: string;
  theme_toggle_light: string;
  language_selector: string;

  // Profile & Preferences
  profile_title: string;
  profile_desc: string;
  profile_account_security: string;
  profile_preferences: string;
  profile_my_products: string;

  // Assistant
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

  // Footer
  footer_disclaimer: string;
}

export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    nav_how_it_works: 'How It Works',
    nav_sources: 'Sources',
    nav_about_us: 'About Us',
    nav_assistant: 'AI Assistant',
    nav_profile: 'Profile',
    nav_sign_in: 'Sign In',
    nav_sign_out: 'Sign Out',
    nav_start_analysis: 'Start Analysis',
    nav_tagline: 'From Product to Compliance Clarity',
    theme_toggle_dark: 'Switch to Dark Mode',
    theme_toggle_light: 'Switch to Light Mode',
    language_selector: 'Language',

    profile_title: 'MSME Manufacturer Profile',
    profile_desc: 'Manage your organization details, registered products, and regulatory preferences.',
    profile_account_security: 'Account Security',
    profile_preferences: 'Interface Preferences',
    profile_my_products: 'Your Registered Products',

    assistant_title: 'NiyamVeda AI Regulatory Assistant',
    assistant_subtitle: 'Source-grounded compliance intelligence based on Indian Standards (BIS) and Quality Control Orders.',
    assistant_placeholder: 'Ask about BIS standards, electric kettles, RO purifiers, stainless steel cookware...',
    assistant_send: 'Send Inquiry',
    assistant_quick_queries: 'Suggested Regulatory Queries',
    assistant_select_product: 'Link Product Context',
    assistant_no_product: 'General BIS Query (No specific product)',
    assistant_citations: 'Authoritative Standard Citations',
    assistant_abstention_badge: 'Safe Abstention Activated',
    assistant_disclaimer: 'NIYAMVEDA provides source-grounded regulatory guidance and does not constitute BIS certification or legal approval. Final compliance must be evaluated by accredited laboratories.',

    hero_badge_ai: 'AI-ASSISTED',
    hero_badge_rule: 'RULE BASED',
    hero_badge_source: 'SOURCE TRACEABLE',
    hero_title_prefix: 'Understand Your',
    hero_title_middle: "Product's",
    hero_title_suffix: 'Compliance Pathway',
    hero_subtext: 'Structured product analysis. Rule-based evaluation. Authoritative evidence. Clear next steps.',
    btn_analyse_product: 'Analyse a Product',
    btn_explore_how_it_works: 'Explore How It Works',
    badge_msme: 'Built for Indian MSMEs & Startups',
    steps_heading: 'NIYAMVEDA WORKS IN 4 SIMPLE STEPS',
    step_1_title: 'Define Product',
    step_1_desc: 'Share product details in simple steps.',
    step_2_title: 'Evaluate Rules',
    step_2_desc: 'Deterministic engine checks applicable rules.',
    step_3_title: 'Review Evidence',
    step_3_desc: 'We fetch official sources and standards.',
    step_4_title: 'Build Pathway',
    step_4_desc: 'Get requirements, tests and next actions.',
    badge_evidence: 'Evidence Driven',
    badge_source_traceable: 'Source Traceable',
    badge_rule_based: 'Rule Based',
    badge_msme_friendly: 'MSME Friendly',

    metric_relevant_standards: 'RELEVANT STANDARDS',
    metric_key_requirements: 'KEY REQUIREMENTS',
    metric_evidence_confidence: 'EVIDENCE CONFIDENCE',
    metric_attention_needed: 'ATTENTION NEEDED',
    metric_identified: 'Identified',
    metric_criteria: 'Criteria',
    metric_areas: 'Areas',
    summary_heading: 'Executive Compliance Summary',
    summary_subheading: 'Deterministic analysis of applicable Quality Control Orders and mandatory standards.',
    attention_heading: 'What Needs Your Attention?',
    attention_subheading: 'High-priority items requiring engineering review or NABL laboratory validation.',
    attention_all_clear: 'All identified compliance parameters are satisfied with no critical pending flags.',
    why_applies_heading: 'Why Do These Standards Apply?',
    why_applies_subheading: 'Exact product facts that triggered mandatory regulatory rules.',
    pathway_heading: 'Your Compliance Pathway',
    btn_view_detailed_analysis: 'View Detailed Analysis',
    btn_inspect_rule: 'Inspect Triggered Rules',
    status_completed: 'Completed',
    status_in_progress: 'In Progress',
    status_pending: 'Pending',

    form_product_def: 'Product Definition',
    form_product_name: 'Product Name',
    form_category: 'Product Category',
    form_intended_use: 'Intended Use',
    form_operating_voltage: 'Operating Voltage',
    form_power_consumption: 'Power Consumption',
    form_water_storage: 'Storage / Fluid Capacity',
    form_material_comp: 'Material Composition',
    form_tech_specs: 'Technical Specifications',
    pdf_upload_title: 'Upload Technical Datasheet',
    pdf_upload_prompt: 'Drop PDF specifications here or click to browse',
    pdf_verification_title: 'PDF Fact Verification',
    pdf_verification_notice: 'Please verify the information extracted from your document before proceeding to analysis.',
    btn_confirm_facts: 'Confirm Extracted Facts',
    btn_submit_analysis: 'Run Compliance Analysis',
    btn_save_continue: 'Save & Continue',
    btn_back: 'Back',

    sim_title: 'What-If Compliance Simulation',
    sim_subtitle: 'Modify product parameters to dynamically observe shifts in applicable standards and test matrices.',
    sim_current_profile: 'Current Product Profile',
    sim_result_profile: 'Simulated Product Profile',
    sim_btn_run: 'Simulate Scenario',
    sim_diff_standards: 'Standards Impact Matrix',
    sim_retained: 'Retained Standards',
    sim_added: 'Newly Added Standards',
    sim_removed: 'Removed Standards',
    sim_provenance: 'Deterministic Provenance & Rationale',

    footer_disclaimer: 'NIYAMVEDA provides source-grounded compliance guidance and does not constitute BIS certification or legal approval. Final compliance must be verified against official standards.'
  },

  hi: {
    nav_how_it_works: 'कार्यप्रणाली',
    nav_sources: 'स्रोत निर्देशिका',
    nav_about_us: 'हमारे बारे में',
    nav_assistant: 'एआई सहायक',
    nav_profile: 'प्रोफाइल',
    nav_sign_in: 'साइन इन',
    nav_sign_out: 'साइन आउट',
    nav_start_analysis: 'विश्लेषण शुरू करें',
    nav_tagline: 'उत्पाद से मानक स्पष्टता तक',
    theme_toggle_dark: 'डार्क मोड पर बदलें',
    theme_toggle_light: 'लाइट मोड पर बदलें',
    language_selector: 'भाषा',

    profile_title: 'एमएसएमई निर्माता प्रोफाइल',
    profile_desc: 'अपनी संस्था का विवरण, पंजीकृत उत्पाद और विनियामक प्राथमिकताएं प्रबंधित करें।',
    profile_account_security: 'खाता सुरक्षा',
    profile_preferences: 'इंटरफ़ेस प्राथमिकताएं',
    profile_my_products: 'आपके पंजीकृत उत्पाद',

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

    footer_disclaimer: 'नियमवेद स्रोत-आधारित मार्गदर्शन प्रदान करता है और यह आधिकारिक बीआईएस प्रमाणन नहीं है। अंतिम अनुपालन आधिकारिक मानकों द्वारा सत्यापित किया जाना चाहिए।'
  },

  bn: {
    nav_how_it_works: 'কাজের পদ্ধতি',
    nav_sources: 'উৎস নির্দেশিকা',
    nav_about_us: 'আমাদের সম্পর্কে',
    nav_assistant: 'এআই সহকারী',
    nav_profile: 'প্রোফাইল',
    nav_sign_in: 'সাইন ইন',
    nav_sign_out: 'সাইন আউট',
    nav_start_analysis: 'বিশ্লেষণ শুরু করুন',
    nav_tagline: 'পণ্য থেকে মানের স্বচ্ছতা',
    theme_toggle_dark: 'ডার্ক মোড চালু করুন',
    theme_toggle_light: 'লাইট মোড চালু করুন',
    language_selector: 'ভাষা',

    profile_title: 'এমএসএমই প্রস্তুতকারক প্রোফাইল',
    profile_desc: 'আপনার সংস্থার বিবরণ, নিবন্ধিত পণ্য এবং নিয়ন্ত্রক পছন্দগুলি পরিচালনা করুন।',
    profile_account_security: 'অ্যাকাউন্ট সুরক্ষা',
    profile_preferences: 'ইন্টারফেস পছন্দসমূহ',
    profile_my_products: 'আপনার নিবন্ধিত পণ্যসমূহ',

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

    footer_disclaimer: 'নিয়মবেদ নির্ভরযোগ্য সহায়তা প্রদান করে, এটি চূড়ান্ত সরকারি বিআইএস সার্টিফিকেট নয়। অফিসিয়াল মানক দ্বারা চূড়ান্ত যাচাই আবশ্যক।'
  }
};
