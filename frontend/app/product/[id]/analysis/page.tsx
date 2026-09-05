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
              <div className="text-3xl font-extrabold text-white">
                {result?.relevant_standards_count ?? result?.standards?.length ?? 0}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Identified</span>
            </div>

            <div className="bg-[#0B1426]/85 backdrop-blur-md border border-slate-800 rounded-xl p-4 text-center card-interactive">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                KEY REQUIREMENTS
              </span>
              <div className="text-3xl font-extrabold text-white">
                {result?.key_requirements_count ?? result?.requirements?.length ?? 0}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Criteria</span>
            </div>

            <div className="bg-[#0B1426]/85 backdrop-blur-md border border-slate-800 rounded-xl p-4 text-center card-interactive">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                EVIDENCE CONFIDENCE
              </span>
              <div className={`text-3xl font-extrabold ${
                result?.evidence_confidence === 'High'
                  ? 'text-emerald-400'
                  : result?.evidence_confidence === 'Medium'
                  ? 'text-blue-400'
                  : result?.evidence_confidence === 'Insufficient Evidence'
                  ? 'text-rose-400 text-2xl'
                  : 'text-amber-400'
              }`}>
                {result?.evidence_confidence ?? 'Low'}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {result?.evidence_confidence === 'High'
                  ? 'Strong'
                  : result?.evidence_confidence === 'Medium'
                  ? 'Moderate'
                  : result?.evidence_confidence === 'Insufficient Evidence'
                  ? 'Abstaining'
                  : 'Preliminary'}
              </span>
            </div>

            <div className="bg-[#0B1426]/85 backdrop-blur-md border border-slate-800 rounded-xl p-4 text-center card-interactive">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                ATTENTION NEEDED
              </span>
              <div className="text-3xl font-extrabold text-amber-400">
                {result?.attention_needed_count ?? 0}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Areas</span>
            </div>
          </div>

          {/* ─── Safe Abstention Alert Banner if Activated ─── */}
          {result?.safe_abstention?.activated && (
            <div className="bg-rose-950/40 border border-rose-800/80 rounded-xl p-5 text-rose-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-rose-300">
                <span>Safe Abstention Activated:</span>
                <span>{result.safe_abstention.product_characteristic || 'Unsupported Product Domain'}</span>
              </div>
              <p className="text-xs text-rose-300/90 leading-relaxed">
                {result.safe_abstention.abstention_reason}
              </p>
              {result.safe_abstention.missing_information && result.safe_abstention.missing_information.length > 0 && (
                <div className="text-xs text-rose-400 pt-1">
                  <span className="font-semibold">Missing parameters: </span>
                  {result.safe_abstention.missing_information.join(', ')}
                </div>
              )}
            </div>
          )}

          {/* ─── Your Compliance Pathway (Screen 4 Main Card) ─── */}
          <div className="bg-[#0B1426]/90 backdrop-blur-md border border-slate-800 rounded-xl p-6 sm:p-7 space-y-5 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Your Compliance Pathway
              </h2>
              {result?.evaluated_rules && result.evaluated_rules.length > 0 && (
                <button
                  onClick={() => setShowRuleModal(true)}
                  className="text-xs text-[#FF9933] hover:text-[#FF7828] font-semibold flex items-center gap-1 transition-colors"
                >
                  Inspect Triggered Rule (Screen 5) <ChevronRight size={14} />
                </button>
              )}
            </div>

            {/* Dynamic Pathway Step Cards */}
            <div className="space-y-3">
              {(result?.pathway_stages || [
                {
                  step: 1,
                  title: 'Product Category Identified',
                  description: 'Evaluating category specifications against Indian Standards.',
                  status: 'COMPLETED' as const
                },
                {
                  step: 2,
                  title: 'Potential BIS Requirements Identified',
                  description: 'Deterministic rule evaluation in progress.',
                  status: 'IN_PROGRESS' as const
                },
                {
                  step: 3,
                  title: 'Relevant Standards Reviewed',
                  description: 'Mapping published QCO and gazette mandates.',
                  status: 'PENDING' as const
                },
                {
                  step: 4,
                  title: 'Testing / Certification Considerations',
                  description: 'Determining mandatory testing routes and NABL requirements.',
                  status: 'PENDING' as const
                },
                {
                  step: 5,
                  title: 'Recommended Next Actions',
                  description: 'Actionable steps for compliance readiness.',
                  status: 'PENDING' as const
                }
              ]).map((stage) => {
                const isCompleted = stage.status === 'COMPLETED';
                const isInProgress = stage.status === 'IN_PROGRESS';
                return (
                  <div
                    key={stage.step}
                    className={`bg-[#070D1B] border rounded-lg p-4 flex items-center justify-between gap-4 ${
                      isInProgress ? 'border-[#FF7828]/40' : 'border-slate-800/90'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : isInProgress
                            ? 'bg-[#FF7828] text-white shadow-md shadow-orange-500/30'
                            : 'border border-slate-700 text-slate-500 bg-transparent'
                        }`}
                      >
                        {isCompleted ? <Check size={14} /> : stage.step}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white leading-tight">
                          {stage.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {stage.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold flex-shrink-0 flex items-center gap-1 ${
                        isCompleted
                          ? 'text-emerald-400'
                          : isInProgress
                          ? 'text-[#FF7828]'
                          : 'text-slate-500'
                      }`}
                    >
                      {isCompleted && <Check size={12} />}
                      {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Pending'}
                    </span>
                  </div>
                );
              })}
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
                  {activeRule?.input_facts
                    ? Object.entries(activeRule.input_facts)
                        .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
                        .join(' | ')
                    : 'Validated engineering characteristics'}
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
                    {activeRule?.origin_badge || 'DETERMINISTIC RULE'}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 mt-0.5">
                  {activeRule?.rule_id || 'RULE-BIS-EVALUATED'}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {activeRule?.rule_name || 'Applicable regulatory compliance rule'}
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
                    {activeRule?.verification_status || 'VERIFIED OFFICIAL'}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 mt-0.5">
                  {activeRule?.clause_reference || 'Clause reference from Indian Standard'}
                </p>
                <p className="text-xs text-slate-600 mt-0.5 italic">
                  {activeRule?.supporting_evidence_excerpt || activeRule?.rule_logic}
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
                    DETERMINISTIC ENGINE
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                  {activeRule?.result_explanation || 'Rule condition satisfied based on structured product facts.'}
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
