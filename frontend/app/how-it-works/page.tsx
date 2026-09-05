'use client';
import Link from 'next/link';
import { 
  ArrowRight, FileText, Cpu, CheckCircle2, ShieldAlert, 
  Layers, Sliders, ShieldCheck, Scale, FileSearch, 
  HelpCircle, AlertTriangle, Play, Sparkles, Database,
  FileSpreadsheet, ArrowUpRight
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      step: 1,
      title: 'Enter Product Details',
      category: 'Input',
      icon: FileText,
      description: 'Provide basic product information including product name, industry category, intended domestic or commercial use, operating voltage, and power ratings.',
      detail: 'Users can manually enter specifications or select from common engineering templates tailored for Indian manufacturing and MSMEs.'
    },
    {
      step: 2,
      title: 'Upload Technical Datasheet / PDF',
      category: 'Ingestion',
      icon: FileSpreadsheet,
      description: 'Upload manufacturer specification sheets, lab testing certificates, or component datasheets in standard PDF format.',
      detail: 'Our backend parses PDF text using PyMuPDF to detect rated voltages, power consumption, materials (e.g., SS304, Polycarbonate), and special safety mechanisms.'
    },
    {
      step: 3,
      title: 'Extract & Structure Product Parameters',
      category: 'Normalization',
      icon: Cpu,
      description: 'Raw product characteristics are normalized into structured engineering parameters and boolean flags.',
      detail: 'Parameters such as is_electrical, has_heating_element, food_contact, and material classifications are extracted to form a deterministic product fact profile.'
    },
    {
      step: 4,
      title: 'Apply Deterministic BIS Rules',
      category: 'Rule Engine',
      icon: Scale,
      description: 'Structured facts are evaluated against strictly codified Quality Control Orders (QCOs) and Bureau of Indian Standards (BIS) rules.',
      detail: 'No generative AI hallucination of regulatory requirements: whether a product requires mandatory certification is decided strictly by deterministic boolean logic.'
    },
    {
      step: 5,
      title: 'Map Applicable Standards & Requirements',
      category: 'Registry Mapping',
      icon: Database,
      description: 'Matched rules are linked directly to verified Indian Standards and authoritative clause citations in the Source Registry.',
      detail: 'From general electrical safety (IS 302-1) and liquid heating (IS 302-2-15) to food contact stainless steel (IS 6911) and electronics CRS (MeitY), exact standards are mapped.'
    },
    {
      step: 6,
      title: 'Generate Compliance Analysis',
      category: 'Metric Synthesis',
      icon: Layers,
      description: 'Deterministically compute dashboard summary metrics: relevant standards count, key requirements count, attention needed items, and completion %.',
      detail: 'All figures on the compliance dashboard are calculated in real time based on the active rule outcomes, rather than static mock values.'
    },
    {
      step: 7,
      title: 'Review Risks, Evidence & Certification Pathway',
      category: 'Risk & Audit Trail',
      icon: ShieldAlert,
      description: 'Inspect potential compliance risks (such as glow-wire flammability, dry-boil thermal protection, or chemical leaching) before submitting for lab tests.',
      detail: 'Every requirement and risk card links to verifiable clause excerpts from official gazette notifications and published Indian Standards.'
    },
    {
      step: 8,
      title: 'Use What-If Simulation to Test Parameter Changes',
      category: 'Dynamic Simulation',
      icon: Sliders,
      description: 'Test how modifying physical parameters dynamically alters the compliance pathway before committing to costly tooling changes.',
      detail: 'Switching materials from Polycarbonate to SS304 or modifying operating voltage instantly generates a standards diff and updated test matrix.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070D1B] text-white relative overflow-hidden font-sans">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#FF7828]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-80 left-10 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 right-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 relative z-10 space-y-12">
        
        {/* Header Breadcrumb & Title */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0C1B36] border border-[#1E355B] text-xs font-semibold text-slate-300">
            <span className="text-[#FF7828] font-bold">NIYAMVEDA ARCHITECTURE</span>
            <span className="text-slate-600">•</span>
            <span>END-TO-END WORKFLOW</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            How NiyamVeda Works
          </h1>
          
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            NiyamVeda is a <span className="text-[#FF9933] font-semibold">parameter-driven compliance intelligence system</span>.
            Instead of giving generic legal advice or hallucinating standards, it translates physical engineering specifications into deterministic regulatory pathways grounded in verified Bureau of Indian Standards (BIS) documents.
          </p>
        </div>

        {/* Highlight Banner: Truly Dynamic & Parameter-Driven */}
        <div className="bg-[#0A1428]/90 border border-blue-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                <Sparkles size={15} />
                <span>Parameter-Driven Engine</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Compliance Outcomes Change Dynamically With Product Facts
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Whether a product requires general electrical safety (IS 302-1), food-contact testing (IS 6911), RO water effluent quality (IS 10500), or MeitY CRS electronics registration is strictly determined by its voltage, material composition, and intended use.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-center md:items-end">
              <Link
                href="/product/new"
                className="bg-[#FF7828] hover:bg-[#E05E10] text-white font-bold text-xs px-5 py-3 rounded-lg transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-center"
              >
                Test With Your Product <ArrowRight size={14} />
              </Link>
              <Link
                href="/product/demo-purifier-001/analysis"
                className="bg-[#0C1B36] hover:bg-[#13274D] border border-slate-700 text-slate-300 font-semibold text-xs px-5 py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-center"
              >
                <Play size={12} fill="currentColor" /> View Live Analysis Demo
              </Link>
            </div>
          </div>
        </div>

        {/* 8-Step Step-by-Step Interactive Workflow */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                The 8-Step Compliance Analysis Pipeline
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                From technical specification sheet to audit-ready testing considerations.
              </p>
            </div>
            <span className="hidden sm:inline-flex text-xs font-semibold px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
              Deterministic Logic + RAG
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.step}
                  className="bg-[#0A1224] border border-slate-800 hover:border-orange-500/40 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#102242] border border-[#1E3865] flex items-center justify-center text-[#FF9933] font-bold text-sm">
                          {item.step}
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800/60 px-2.5 py-0.5 rounded">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-slate-500 group-hover:text-[#FF7828] transition-colors">
                        <Icon size={22} strokeWidth={1.75} />
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-[#FF9933] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 leading-relaxed">
                    <span className="text-slate-500 font-semibold">How it operates: </span>
                    {item.detail}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Special Safe Abstention Feature Card */}
        <div className="bg-[#0C152B] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <ShieldAlert size={26} />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wide">
                  Regulatory Integrity Gate
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Safe Abstention: Protecting You From Fabricated Advice
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                If an unknown product is submitted (e.g. theoretical equipment outside BIS scopes) or critical engineering facts are missing, NiyamVeda does <strong className="text-white">not</strong> guess or return generic fallbacks. The system triggers <strong className="text-amber-300">Safe Abstention</strong>, clearly reporting <em className="text-slate-200">&quot;Insufficient Evidence to determine applicable standard&quot;</em> and guiding you on the precise technical parameters required.
              </p>
            </div>
          </div>
        </div>

        {/* What-If Simulation Callout */}
        <div className="bg-gradient-to-r from-[#0C1B36] to-[#0A1224] border border-[#1E355B] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF9933]">
              <Sliders size={15} />
              <span>Interactive Decision Support</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Try What-If Parameter Simulation
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Wondering if switching your product housing from Polycarbonate to Food-Grade Stainless Steel eliminates Glow-Wire testing under IS 302-1? Test design choices in real time before building prototypes.
            </p>
          </div>
          <Link
            href="/product/demo-purifier-001/simulation"
            className="flex-shrink-0 bg-[#FF7828] hover:bg-[#E05E10] text-white font-bold text-xs px-6 py-3 rounded-lg transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
          >
            Launch What-If Simulator <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  );
}
