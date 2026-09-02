'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Check, ChevronRight, ArrowRight, X, ExternalLink, 
  Clock, AlertCircle, Info, ShieldCheck, HelpCircle 
} from 'lucide-react';
import { api, type AnalysisResult, type RuleEvaluationResult } from '@/lib/api';
import ProductSidebar from '@/components/ProductSidebar';

export default function CompliancePathwayDashboard() {
  const params = useParams();
  const router = useRouter();
  const productId = (params.id as string) || 'demo-purifier-001';

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showInspectorModal, setShowInspectorModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<RuleEvaluationResult | null>(null);

  useEffect(() => {
    api.getAnalysisResult(productId)
      .then((data) => {
        setResult(data);
        if (data.evaluated_rules?.length > 0) {
          setSelectedRule(data.evaluated_rules[0]);
        }
      })
      .catch(() => {
        // Fallback demo data handled in api
      });
  }, [productId]);

  const activeRule = selectedRule || result?.evaluated_rules?.[0];

  return (
    <div className="flex min-h-screen portal-bg font-sans text-white">
      {/* Left Icon Sidebar */}
      <ProductSidebar productId={productId} />

      {/* Main Screen 4 Content Area */}
      <div className="flex-1 ml-14 py-8 px-6 sm:px-10">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* ─── 4 Metric Cards (Screen 4 Top) ─── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-[#0B1426]/85 backdrop-blur-md border border-slate-800 rounded-xl p-4 text-center card-interactive">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                RELEVANT STANDARDS
              </span>
              <div className="text-3xl font-extrabold text-white">3</div>
              <span className="text-[11px] text-slate-400 font-medium">Identified</span>
            </div>

            <div className="bg-[#0B1426]/85 backdrop-blur-md border border-slate-800 rounded-xl p-4 text-center card-interactive">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                KEY REQUIREMENTS
              </span>
              <div className="text-3xl font-extrabold text-white">14</div>
              <span className="text-[11px] text-slate-400 font-medium">Criteria</span>
            </div>

            <div className="bg-[#0B1426]/85 backdrop-blur-md border border-slate-800 rounded-xl p-4 text-center card-interactive">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                EVIDENCE CONFIDENCE
              </span>
              <div className="text-3xl font-extrabold text-emerald-400">High</div>
              <span className="text-[11px] text-slate-400 font-medium">Strong</span>
            </div>

            <div className="bg-[#0B1426]/85 backdrop-blur-md border border-slate-800 rounded-xl p-4 text-center card-interactive">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                ATTENTION NEEDED
              </span>
              <div className="text-3xl font-extrabold text-amber-400">2</div>
              <span className="text-[11px] text-slate-400 font-medium">Areas</span>
            </div>
          </div>

          {/* ─── Your Compliance Pathway (Screen 4 Main Card) ─── */}
          <div className="bg-[#0B1426]/90 backdrop-blur-md border border-slate-800 rounded-xl p-6 sm:p-7 space-y-5 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Your Compliance Pathway
              </h2>
              <button
                onClick={() => setShowRuleModal(true)}
                className="text-xs text-[#FF9933] hover:text-[#FF7828] font-semibold flex items-center gap-1 transition-colors"
              >
                Inspect Triggered Rule (Screen 5) <ChevronRight size={14} />
              </button>
            </div>

            {/* 5 Pathway Step Cards */}
            <div className="space-y-3">
              {/* Step 1 */}
              <div className="bg-[#070D1B] border border-slate-800/90 rounded-lg p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    <Check size={14} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      Product Category Identified
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Your product falls under Household Electrical Appliance (Water Filter).
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-400 flex-shrink-0 flex items-center gap-1">
                  <Check size={12} /> Completed
                </span>
              </div>

              {/* Step 2 */}
              <div className="bg-[#070D1B] border border-slate-800/90 rounded-lg p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    <Check size={14} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      Potential BIS Requirements Identified
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Deterministic engine found applicable rules for this category.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-400 flex-shrink-0 flex items-center gap-1">
                  <Check size={12} /> Completed
                </span>
              </div>

              {/* Step 3 */}
              <div className="bg-[#070D1B] border border-slate-800/90 rounded-lg p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    <Check size={14} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      Relevant Standards Reviewed
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      3 relevant BIS standards and regulatory sources retrieved.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-400 flex-shrink-0 flex items-center gap-1">
                  <Check size={12} /> Completed
                </span>
              </div>

              {/* Step 4 */}
              <div className="bg-[#070D1B] border border-[#FF7828]/40 rounded-lg p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#FF7828] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      Testing / Certification Considerations
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Testing and certification requirements evaluated.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#FF7828] flex-shrink-0 flex items-center gap-1">
                  &rarr; In Progress
                </span>
              </div>

              {/* Step 5 */}
              <div className="bg-[#070D1B] border border-slate-800/60 rounded-lg p-4 flex items-center justify-between gap-4 opacity-70">
                <div className="flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-300 leading-tight">
                      Recommended Next Actions
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Documents, gaps and next steps for compliance.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-500 flex-shrink-0">
                  Pending
                </span>
              </div>
            </div>

            {/* Bottom Button (Screen 4 Bottom Right) */}
            <div className="flex justify-end pt-3">
              <Link
                href={`/product/${productId}/standards`}
                className="bg-[#FF7828] hover:bg-[#E05E10] text-white font-bold text-xs px-6 py-2.5 rounded-md transition-all shadow-md shadow-orange-500/20 flex items-center gap-2"
              >
                View Detailed Analysis <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ─── Screen 5: WHY THIS RULE APPLIES? (White Modal Exact to Screen 5) ─── */}
      {showRuleModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 text-slate-800 shadow-2xl relative space-y-5 animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">
                Why This Rule Applies
              </h2>
              <button 
                onClick={() => setShowRuleModal(false)}
                className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Linear Trace Flow (Screen 5 Exact) */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-300">
              
              {/* Node 1: Product Fact */}
              <div className="relative">
                <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  PRODUCT FACT
                </span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">
                  Operating Voltage: 230V AC
                </p>
              </div>

              {/* Node 2: Rule Evaluated */}
              <div className="relative">
                <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-700 border-2 border-white" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    RULE EVALUATED
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-300">
                    DETERMINISTIC RULE
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 mt-0.5">
                  RULE-BIS-014
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Household electrical appliance operating above the specified voltage threshold.
                </p>
              </div>

              {/* Node 3: Rule Condition */}
              <div className="relative">
                <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-700 border-2 border-white" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    RULE CONDITION
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-300">
                    DETERMINISTIC RULE
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 mt-0.5">
                  IS 302 (Part 1): 2008 – Clause 22.1
                </p>
                <p className="text-xs text-slate-600 mt-0.5 italic">
                  Appliances shall be constructed so that their electrical insulation does not break down during normal operation.
                </p>
              </div>

              {/* Node 4: Result */}
              <div className="relative">
                <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-purple-600 border-2 border-white" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    RESULT
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-200">
                    AI SYNTHESIS
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                  This rule was triggered because the operating voltage (230V AC) falls within the condition defined in the rule.
                </p>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                onClick={() => {
                  setShowRuleModal(false);
                  setShowInspectorModal(true);
                }}
                className="text-xs text-[#FF7828] font-bold hover:underline"
              >
                Inspect Full Rule Details
              </button>

              <Link
                href={`/product/${productId}/sources`}
                className="bg-[#0B132B] hover:bg-[#1E293B] text-white text-xs font-bold px-5 py-2.5 rounded-md transition-all flex items-center gap-1.5"
              >
                View Evidence Trail <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ─── Screen 6: RULE INSPECTOR (White Modal Exact to Screen 6) ─── */}
      {showInspectorModal && activeRule && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 text-slate-800 shadow-2xl relative space-y-5 animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">
                Rule Inspector – {activeRule.rule_id}
              </h2>
              <button 
                onClick={() => setShowInspectorModal(false)}
                className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* 2-Column Split (Screen 6 Exact) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start divide-y md:divide-y-0 md:divide-x divide-slate-200">
              
              {/* Left Column: Rule Logic */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    RULE LOGIC
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-300">
                    DETERMINISTIC RULE
                  </span>
                </div>

                <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-4 font-mono text-xs text-slate-800 space-y-2">
                  <p className="text-slate-400 font-bold">IF</p>
                  <p className="pl-3 font-semibold text-slate-900">
                    Product Category = Household Electrical Appliance
                  </p>
                  <p className="text-slate-400 font-bold">AND</p>
                  <p className="pl-3 font-semibold text-slate-900">
                    Operating Voltage &gt; Threshold
                  </p>
                  <p className="text-slate-400 font-bold">THEN</p>
                  <p className="pl-3 font-bold text-[#FF7828]">
                    Trigger Additional Safety Review
                  </p>
                </div>

                <div className="flex items-start gap-2 text-[11px] text-slate-500 pt-1">
                  <Info size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>This rule is evaluated deterministically based on structured product facts.</span>
                </div>
              </div>

              {/* Right Column: Supporting Evidence */}
              <div className="md:pl-6 space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    SUPPORTING EVIDENCE
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-300">
                    AUTHORITATIVE EVIDENCE
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Source</span>
                  <p className="font-bold text-slate-900 text-xs mt-0.5">
                    {activeRule.clause_reference.split(' - ')[0] || 'IS 302 (Part 1): 2008'}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Clause</span>
                  <p className="font-semibold text-slate-800 text-xs mt-0.5">
                    {activeRule.clause_reference}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Excerpt</span>
                  <blockquote className="bg-[#F8FAFC] border-l-2 border-l-[#FF7828] border border-slate-200 rounded-md p-3 text-xs text-slate-700 italic leading-relaxed">
                    &ldquo;{activeRule.supporting_evidence_excerpt}&rdquo;
                  </blockquote>
                </div>
              </div>

            </div>

            {/* Bottom Button */}
            <div className="flex justify-end pt-3 border-t border-slate-200">
              <Link
                href={`/product/${productId}/sources`}
                className="bg-[#0B132B] hover:bg-[#1E293B] text-white text-xs font-bold px-6 py-2.5 rounded-md transition-all flex items-center gap-1.5"
              >
                View Full Source <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
