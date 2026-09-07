'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Check, ChevronRight, ArrowRight, X, ExternalLink, 
  Clock, AlertCircle, Info, ShieldCheck, HelpCircle, Sparkles 
} from 'lucide-react';
import { api, type AnalysisResult, type RuleEvaluationResult } from '@/lib/api';
import { useTranslation } from '@/lib/i18n-context';
import ProductSidebar from '@/components/ProductSidebar';
import AssistantDrawer from '@/components/AssistantDrawer';

export default function CompliancePathwayDashboard() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
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
    <div className="flex flex-col lg:flex-row min-h-screen portal-bg font-sans text-white">
      {/* Left Icon Sidebar / Mobile Subnav */}
      <ProductSidebar productId={productId} />

      {/* Main Screen 4 Content Area */}
      <div className="flex-1 ml-0 lg:ml-14 py-6 sm:py-8 px-4 sm:px-6 md:px-10 min-w-0">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* ─── 4 Metric Cards (Screen 4 Top) ─── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
            <div className="bg-[#0B1426]/85 backdrop-blur-md border border-slate-800 rounded-xl p-4 text-center card-interactive">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {t('metric_relevant_standards')}
              </span>
              <div className="text-3xl font-extrabold text-white">
                {result?.relevant_standards_count ?? result?.standards?.length ?? 0}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">{t('metric_identified')}</span>
            </div>

            <div className="bg-[#0B1426]/85 backdrop-blur-md border border-slate-800 rounded-xl p-4 text-center card-interactive">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {t('metric_key_requirements')}
              </span>
              <div className="text-3xl font-extrabold text-white">
                {result?.key_requirements_count ?? result?.requirements?.length ?? 0}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">{t('metric_criteria')}</span>
            </div>

            <div className="bg-[#0B1426]/85 backdrop-blur-md border border-slate-800 rounded-xl p-4 text-center card-interactive">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {t('metric_evidence_confidence')}
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
                  ? t('analysis_strong')
                  : result?.evidence_confidence === 'Medium'
                  ? t('analysis_moderate')
                  : result?.evidence_confidence === 'Insufficient Evidence'
                  ? t('analysis_abstaining')
                  : t('analysis_preliminary')}
              </span>
            </div>

            <div className="bg-[#0B1426]/85 backdrop-blur-md border border-slate-800 rounded-xl p-4 text-center card-interactive">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {t('metric_attention_needed')}
              </span>
              <div className="text-3xl font-extrabold text-amber-400">
                {result?.attention_needed_count ?? 0}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">{t('metric_areas')}</span>
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

          {/* ─── 1. Analysis Summary Section (UX Improvement 5) ─── */}
          <div className="bg-[#0B1426]/90 backdrop-blur-md border border-slate-800 rounded-xl p-6 space-y-3 shadow-xl animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#FF9933] uppercase tracking-wider">
                <ShieldCheck size={16} />
                <span>{t('summary_heading')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/assistant?product_id=${productId}`}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FF7828]/15 hover:bg-[#FF7828]/25 border border-[#FF7828]/40 text-[#FF9933] text-[11px] font-bold transition-colors"
                  title={t('profile_chat_tooltip')}
                >
                  <Sparkles size={11} />
                  <span>{t('analysis_ask_copilot')}</span>
                </Link>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {result?.checklist_completion_percent ?? 0}% {t('analysis_ready')}
                </span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              {result?.ai_synthesis_summary || t('analysis_default_eval')}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <span className="px-2.5 py-1 rounded bg-[#102242] border border-[#1E3865] text-blue-300 font-semibold">
                {result?.relevant_standards_count ?? result?.standards?.length ?? 0} {t('analysis_standards_identified')}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#102242] border border-[#1E3865] text-blue-300 font-semibold">
                {result?.key_requirements_count ?? result?.requirements?.length ?? 0} {t('analysis_statutory_reqs')}
              </span>
              {result?.attention_needed_count !== undefined && result.attention_needed_count > 0 && (
                <span className="px-2.5 py-1 rounded bg-amber-950/60 border border-amber-800/80 text-amber-300 font-semibold">
                  {result.attention_needed_count} {t('analysis_requiring_attention')}
                </span>
              )}
            </div>
          </div>

          {/* ─── 2. What Needs Your Attention? Section (UX Improvement 5) ─── */}
          <div className="bg-[#0B1426]/90 backdrop-blur-md border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <AlertCircle size={17} className="text-amber-400 flex-shrink-0" />
                  <span>{t('attention_heading')}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t('attention_subheading')}
                </p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                (result?.attention_needed_count ?? 0) > 0
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {(result?.attention_needed_count ?? 0) > 0 ? `${result?.attention_needed_count} ${t('analysis_action_items')}` : t('attention_all_clear')}
              </span>
            </div>

            {/* List Attention Items or Show All Clear */}
            {(() => {
              const pendingReqs = (result?.requirements || []).filter(
                r => r.status === 'REVIEW_REQUIRED' || r.status === 'REVIEW' || r.status === 'NEEDS_INFORMATION'
              );
              const severeRisks = (result?.risks || []).filter(
                rk => rk.severity === 'HIGH' || rk.severity === 'MEDIUM'
              );
              const hasItems = pendingReqs.length > 0 || severeRisks.length > 0 || result?.safe_abstention?.activated;

              if (!hasItems) {
                return (
                  <div className="bg-[#070D1B] border border-slate-800 rounded-lg p-4 text-xs text-slate-300 flex items-center gap-3">
                    <Check size={18} className="text-emerald-400 flex-shrink-0" />
                    <span>
                      {t('analysis_all_clear_badge')}
                    </span>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {/* Safe Abstention Warning if Active */}
                  {result?.safe_abstention?.activated && (
                    <div className="bg-rose-950/40 border border-rose-800/70 rounded-lg p-3.5 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                        <span>{t('analysis_incomplete_params')}</span>
                      </div>
                      <p className="text-[11px] text-rose-200/90 leading-relaxed">
                        {result.safe_abstention.abstention_reason}
                      </p>
                    </div>
                  )}

                  {/* Pending Lab / Engineering Requirements */}
                  {pendingReqs.map(req => (
                    <div key={req.id} className="bg-[#070D1B] border border-amber-900/40 rounded-lg p-3.5 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white">
                          {req.source}: {req.requirement}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/80 uppercase">
                          {t('analysis_action_required')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {req.why_it_applies}
                      </p>
                      <p className="text-[11px] text-[#FF9933] font-semibold pt-0.5">
                        {t('analysis_category')}: {req.category} • {t('analysis_status')}: {req.status}
                      </p>
                    </div>
                  ))}

                  {/* Significant Compliance Risks */}
                  {severeRisks.map(rk => (
                    <div key={rk.id} className="bg-[#070D1B] border border-red-950/60 rounded-lg p-3.5 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white">
                          {rk.risk}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          rk.severity === 'HIGH' 
                            ? 'bg-red-950 text-red-300 border border-red-800' 
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {rk.severity} {t('analysis_risk')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {rk.why_it_matters}
                      </p>
                      <p className="text-[11px] text-emerald-400 font-semibold pt-0.5">
                        {t('analysis_mitigation')}: {rk.suggested_action}
                      </p>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* ─── 3. Why Does This Apply? Section (UX Improvement 5) ─── */}
          {result?.evaluated_rules && result.evaluated_rules.length > 0 && (
            <div className="bg-[#0B1426]/90 backdrop-blur-md border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <Info size={17} className="text-blue-400 flex-shrink-0" />
                    <span>{t('why_applies_heading')}</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t('why_applies_subheading')}
                  </p>
                </div>
                <button
                  onClick={() => setShowRuleModal(true)}
                  className="text-xs text-[#FF9933] hover:text-[#FF7828] font-semibold flex items-center gap-1 transition-colors"
                >
                  {t('analysis_modal_view')} <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.evaluated_rules.slice(0, 4).map((rule) => (
                  <div
                    key={rule.rule_id}
                    onClick={() => {
                      setSelectedRule(rule);
                      setShowRuleModal(true);
                    }}
                    className="bg-[#070D1B] border border-slate-800 hover:border-[#FF7828]/50 rounded-lg p-3.5 space-y-2 cursor-pointer transition-all hover:-translate-y-0.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60 font-mono">
                        {rule.rule_id}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#FF9933] transition-colors flex items-center gap-1">
                        {t('btn_inspect_rule')} <ChevronRight size={12} />
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-white group-hover:text-[#FF9933] transition-colors leading-snug">
                      {rule.rule_name}
                    </h3>

                    <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/60 pt-1.5">
                      <span className="text-slate-500 font-semibold">{t('evidence_clause_label')}: </span>
                      <span className="text-slate-300 font-mono">{rule.clause_reference}</span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {rule.supporting_evidence_excerpt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── 4. Your Compliance Pathway (Existing Screen 4 Main Card) ─── */}
          <div className="bg-[#0B1426]/90 backdrop-blur-md border border-slate-800 rounded-xl p-6 sm:p-7 space-y-5 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {t('pathway_heading')}
              </h2>
              {result?.evaluated_rules && result.evaluated_rules.length > 0 && (
                <button
                  onClick={() => setShowRuleModal(true)}
                  className="text-xs text-[#FF9933] hover:text-[#FF7828] font-semibold flex items-center gap-1 transition-colors"
                >
                  {t('btn_inspect_rule')} <ChevronRight size={14} />
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
                      {isCompleted ? t('status_completed') : isInProgress ? t('status_in_progress') : t('status_pending')}
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
                {t('btn_view_detailed_analysis')} <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ─── Screen 5: WHY THIS RULE APPLIES? (White Modal Exact to Screen 5) ─── */}
      {showRuleModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-xl w-full p-4 sm:p-6 text-slate-800 shadow-2xl relative space-y-5 animate-slide-in max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">
                {t('why_applies_heading')}
              </h2>
              <button 
                onClick={() => setShowRuleModal(false)}
                className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                title={t('analysis_modal_close')}
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
                  {t('analysis_physical_facts')}
                </span>
                <p className="text-xs font-bold text-slate-900 mt-0.5 break-words">
                  {activeRule?.input_facts
                    ? Object.entries(activeRule.input_facts)
                        .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
                        .join(' | ')
                    : t('analysis_product_facts')}
                </p>
              </div>

              {/* Node 2: Rule Evaluated */}
              <div className="relative">
                <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-700 border-2 border-white" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t('rule_inspector_heading')}
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-300">
                    {activeRule?.origin_badge || t('analysis_deterministic_badge')}
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
                    {t('evidence_clause_label')}
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-300">
                    {activeRule?.verification_status || t('inspector_verified_badge')}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 mt-0.5 break-words">
                  {activeRule?.clause_reference || 'Clause reference from Indian Standard'}
                </p>
                <p className="text-xs text-slate-600 mt-0.5 italic break-words">
                  {activeRule?.supporting_evidence_excerpt || activeRule?.rule_logic}
                </p>
              </div>

              {/* Node 4: Result */}
              <div className="relative">
                <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-purple-600 border-2 border-white" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t('inspector_outcome_heading')}
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-200">
                    {t('analysis_deterministic_badge')}
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-0.5 leading-relaxed break-words">
                  {activeRule?.result_explanation || 'Rule condition satisfied based on structured product facts.'}
                </p>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 gap-2">
              <button
                onClick={() => {
                  setShowRuleModal(false);
                  setShowInspectorModal(true);
                }}
                className="text-xs text-[#FF7828] font-bold hover:underline"
              >
                {t('analysis_view_inspector')}
              </button>

              <Link
                href={`/product/${productId}/sources`}
                className="bg-[#0B132B] hover:bg-[#1E293B] text-white text-xs font-bold px-5 py-2.5 rounded-md transition-all flex items-center gap-1.5"
              >
                {t('evidence_title')} <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ─── Screen 6: RULE INSPECTOR (White Modal Exact to Screen 6) ─── */}
      {showInspectorModal && activeRule && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-4 sm:p-6 text-slate-800 shadow-2xl relative space-y-5 animate-slide-in max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 break-words">
                {t('rule_inspector_heading')} – {activeRule.rule_id}
              </h2>
              <button 
                onClick={() => setShowInspectorModal(false)}
                className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0"
                title={t('analysis_modal_close')}
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
                    {t('inspector_logic_heading')}
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-300">
                    {t('analysis_deterministic_badge')}
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
                  <span>{t('analysis_rule_provenance')}</span>
                </div>
              </div>

              {/* Right Column: Supporting Evidence */}
              <div className="pt-4 md:pt-0 md:pl-6 space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    {t('evidence_title')}
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-300">
                    {t('inspector_authoritative_badge')}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('evidence_source_label')}</span>
                  <p className="font-bold text-slate-900 text-xs mt-0.5 break-words">
                    {activeRule.clause_reference.split(' - ')[0] || 'IS 302 (Part 1): 2008'}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('evidence_clause_label')}</span>
                  <p className="font-semibold text-slate-800 text-xs mt-0.5 break-words">
                    {activeRule.clause_reference}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{t('evidence_excerpt_label')}</span>
                  <blockquote className="bg-[#F8FAFC] border-l-2 border-l-[#FF7828] border border-slate-200 rounded-md p-3 text-xs text-slate-700 italic leading-relaxed break-words">
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
                {t('evidence_view_full_source')} <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Floating Regulatory Assistant Copilot Drawer */}
      <AssistantDrawer productId={productId} productName={result?.product_name} />

    </div>
  );
}
