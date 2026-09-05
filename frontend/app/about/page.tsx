'use client';
import Link from 'next/link';
import { 
  ShieldCheck, Scale, FileText, Cpu, Check, 
  HelpCircle, Compass, Target, ArrowRight, BookOpen, 
  Layers, Lock, AlertCircle, Sparkles
} from 'lucide-react';

export default function AboutUsPage() {
  const corePillars = [
    {
      title: 'Deterministic Rule Engine',
      subtitle: 'No Regulatory Hallucination',
      icon: Scale,
      color: 'text-amber-400',
      description: 'Applicability is decided through verified propositional logic. A 230V electric appliance triggers IS 302-1, a heating element triggers IS 302-2-15, and a non-electrical pot does not. Rule logic is hardcoded to published gazette orders, eliminating AI guesswork.'
    },
    {
      title: 'Authoritative Source Registry',
      subtitle: 'Clause-Level Traceability',
      icon: BookOpen,
      color: 'text-blue-400',
      description: 'Every recommendation, test protocol, and requirement maps directly to an indexed Indian Standard, official Gazette Quality Control Order (QCO), or verified regulatory document with exact clause references.'
    },
    {
      title: 'Safe Abstention Safeguard',
      subtitle: 'Responsible System Behavior',
      icon: Lock,
      color: 'text-emerald-400',
      description: 'When engineering facts are incomplete or an unknown product falls outside indexed standards, NiyamVeda safely abstains rather than producing fabricated conclusions. It clearly specifies the missing engineering facts needed.'
    },
    {
      title: 'AI Synthesis with Strict Grounding',
      subtitle: 'Explainable Next Steps',
      icon: Sparkles,
      color: 'text-purple-400',
      description: 'Large language models assist solely in summarizing complex regulatory text, formatting requirements, and clarifying engineering guidance without altering the deterministic rule outcomes.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070D1B] text-white relative overflow-hidden font-sans">
      
      {/* Ambient lighting accents */}
      <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-[#FF7828]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-96 left-10 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 relative z-10 space-y-16">
        
        {/* Header Section */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0C1B36] border border-[#1E355B] text-xs font-semibold text-slate-300">
            <span className="text-[#FF7828] font-bold">ABOUT NIYAMVEDA</span>
            <span className="text-slate-600">•</span>
            <span>SIH26107 PROJECT INITIATIVE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Democratizing Regulatory Intelligence for Indian Hardware
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            NiyamVeda (<span className="text-[#FF9933] font-serif">नियमवेद</span>) is an explainable compliance intelligence platform developed to help manufacturers, hardware engineers, and Indian MSMEs understand Bureau of Indian Standards (BIS) Quality Control Orders through transparent, parameter-driven evaluation.
          </p>
        </div>

        {/* The Problem & Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* The Problem */}
          <div className="bg-[#0A1224] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertCircle size={20} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              The Regulatory Challenge
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Navigating Indian regulatory compliance presents steep hurdles for emerging product teams:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                <span><strong>Dense Gazette Cross-References:</strong> Quality Control Orders (QCOs) reference hundreds of individual clauses across separate standards.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                <span><strong>Ambiguity in Applicability:</strong> Determining whether a specific voltage rating, capacity, or material makes an appliance mandatory or exempt is often opaque.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                <span><strong>High Barrier to Entry:</strong> Small and Medium Enterprises (MSMEs) often face costly consulting cycles just to understand what lab tests are required.</span>
              </li>
            </ul>
          </div>

          {/* The Solution */}
          <div className="bg-[#0A1224] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Compass size={20} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              The NiyamVeda Approach
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              NiyamVeda transforms unstructured compliance uncertainty into deterministic engineering clarity:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                <span><strong>Parameter-Driven Logic:</strong> Input facts (voltage, wattage, materials, intended use) determine standard applicability objectively.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                <span><strong>Grounded Traceability:</strong> Every requirement quotes official standard numbers, clause sections, and verification statuses.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                <span><strong>Pre-Testing Risk Discovery:</strong> Pinpoints potential testing failure risks (e.g. glow wire flammability, dry-boil cut-out) before prototype fabrication.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Why Parameter-Driven Analysis Matters */}
        <div className="bg-gradient-to-br from-[#0C1B36] to-[#0A1428] border border-[#1E355B] rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF9933]">
            <Target size={15} />
            <span>CORE ARCHITECTURAL PRINCIPLE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Why Parameter-Driven Compliance Matters
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl font-normal">
            Compliance is never a one-size-fits-all checklist. A household water purifier with a 230V AC pump must satisfy electrical insulation rules under <strong className="text-white">IS 302-1</strong> and microbiological reduction under <strong className="text-white">IS 16240</strong>, whereas an unpowered stainless steel pot requires heavy metal leaching compliance under <strong className="text-white">IS 6911</strong> with zero electrical testing.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl font-normal">
            By tying the compliance pipeline directly to physical engineering parameters, NiyamVeda ensures that modifying any parameter dynamically recalculates the exact set of applicable standards, requirements, and test plans.
          </p>
        </div>

        {/* The 4 Architectural Pillars */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Architecture: Deterministic Rules + Evidence + AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              How the system components work together to deliver verifiable compliance clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {corePillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div 
                  key={idx}
                  className="bg-[#0A1224] border border-slate-800 hover:border-slate-700 rounded-xl p-6 space-y-3 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-[#102242] border border-[#1E3865] ${p.color}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {p.title}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {p.subtitle}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Goal & Scope Note */}
        <div className="bg-[#091122] border border-slate-800/90 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Layers size={15} className="text-[#FF7828]" />
            <span>Academic &amp; Project Scope</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            NiyamVeda&apos;s Mission
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            NiyamVeda was created as an assistive decision-support framework to demonstrate how deterministic rule engines and source-grounded vector search can transform dense regulatory corpora into structured, transparent software tools.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <Link
              href="/how-it-works"
              className="bg-[#FF7828] hover:bg-[#E05E10] text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all shadow-md flex items-center gap-2"
            >
              Explore How It Works <ArrowRight size={14} />
            </Link>
            <Link
              href="/sources"
              className="border border-slate-700 hover:border-slate-500 bg-[#0C172E] text-slate-300 hover:text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-all"
            >
              Inspect Regulatory Sources
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
