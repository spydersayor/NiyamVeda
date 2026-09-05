'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Database, ArrowRight, ExternalLink, ShieldCheck, 
  Check, Info, AlertCircle 
} from 'lucide-react';
import { api, type AnalysisResult, type RuleEvaluationResult } from '@/lib/api';
import ProductSidebar from '@/components/ProductSidebar';

export default function VerifiedSourcesEvidenceTrailPage() {
  const params = useParams();
  const productId = (params.id as string) || 'demo-purifier-001';

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedRuleIndex, setSelectedRuleIndex] = useState(0);

  useEffect(() => {
    api.getAnalysisResult(productId)
      .then(setResult)
      .catch(() => {});
  }, [productId]);

  const rules: RuleEvaluationResult[] = result?.evaluated_rules ?? [];
  const activeRule: RuleEvaluationResult | undefined = rules[selectedRuleIndex] || rules[0];
  const isAbstaining = result?.safe_abstention?.activated || (result && rules.length === 0);

  return (
    <div className="flex min-h-screen portal-bg font-sans text-slate-800">
      <ProductSidebar productId={productId} />

      <div className="flex-1 ml-14 py-8 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* ─── Header (Screen 11 Exact) ─── */}
          <div className="animate-slide-up flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Evidence Trail
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Trace how each compliance conclusion is supported by verified Indian Standards.
              </p>
            </div>

            {rules.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300 font-semibold">Rule:</span>
                <select
                  value={selectedRuleIndex}
                  onChange={(e) => setSelectedRuleIndex(Number(e.target.value))}
                  className="bg-[#0B1426] border border-slate-700 text-white text-xs rounded px-2.5 py-1.5 focus:outline-none"
                >
                  {rules.map((r, i) => (
                    <option key={r.rule_id} value={i}>
                      {r.rule_id} – {r.rule_name.slice(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {isAbstaining ? (
            <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl p-8 text-center space-y-3 shadow-lg animate-slide-up">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertCircle size={24} />
              </div>
              <h2 className="text-base font-bold text-slate-800">
                No Verified Rules Triggered (Safe Abstention)
              </h2>
              <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                {result?.safe_abstention?.abstention_reason ||
                  "The deterministic engine evaluated available product parameters and safely abstained from formulating unverified compliance conclusions."}
              </p>
              <div className="pt-2">
                <Link
                  href={`/product/${productId}/analysis`}
                  className="text-xs text-[#FF7828] font-bold hover:underline"
                >
                  &larr; Return to Compliance Pathway
                </Link>
              </div>
            </div>
          ) : (
            /* ─── 2-Panel Layout (Screen 11 Exact) ─── */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-slide-up">
              
              {/* Left Column (7 cols): Step-by-Step Evidence Trail */}
              <div className="lg:col-span-7 bg-white/95 backdrop-blur-sm border border-white/60 rounded-xl p-6 shadow-lg card-interactive">
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-300">
                  
                  {/* 1. Product Fact */}
                  <div className="relative">
                    <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      1. Product Fact
                    </span>
                    <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                      {activeRule?.input_facts
                        ? Object.entries(activeRule.input_facts)
                            .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
                            .join(' | ')
                        : 'Operating parameters validated'}
                    </p>
                  </div>

                  {/* 2. Triggered Rule */}
                  <div className="relative">
                    <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-800 border-2 border-white" />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        2. Triggered Rule
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-200 text-slate-700 rounded border border-slate-300">
                        {activeRule?.origin_badge || 'DETERMINISTIC RULE'}
                      </span>
                    </div>
                    <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                      {activeRule?.rule_id || 'RULE-BIS-014'}
                    </p>
                    <p className="text-xs text-slate-600">
                      {activeRule?.rule_name || 'Mandatory safety rule'}
                    </p>
                  </div>

                  {/* 3. Supporting Evidence */}
                  <div className="relative">
                    <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        3. Supporting Evidence
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-300">
                        AUTHORITATIVE EVIDENCE
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">
                      {activeRule?.clause_reference || 'Clause reference'}
                    </p>
                    <blockquote className="bg-white border-l-2 border-l-[#FF7828] border border-slate-200 rounded-md p-3 text-xs text-slate-600 italic leading-relaxed mt-1.5">
                      &ldquo;{activeRule?.supporting_evidence_excerpt || activeRule?.result_explanation}&rdquo;
                    </blockquote>
                  </div>

                  {/* 4. Official Source */}
                  <div className="relative">
                    <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white" />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        4. Official Source
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                        {activeRule?.verification_status || 'VERIFIED SOURCE'}
                      </span>
                    </div>
                    <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                      {activeRule?.source_id || 'Official Standard'}
                    </p>
                    <p className="text-[11px] text-slate-500">{activeRule?.authority || 'Bureau of Indian Standards'}</p>
                  </div>

                </div>
              </div>

              {/* Right Column (5 cols): Source Details Card */}
              <div className="lg:col-span-5 bg-white/95 backdrop-blur-sm border border-white/60 rounded-xl p-6 space-y-4 shadow-lg card-interactive">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2">
                  Source Details
                </h2>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Source Identifier
                    </span>
                    <p className="font-semibold text-slate-900 mt-0.5">
                      {activeRule?.source_id || 'SRC-BIS'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Rule Clause
                    </span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {activeRule?.clause_reference || 'General Clause'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Issuing Authority
                    </span>
                    <p className="font-semibold text-slate-900 mt-0.5">
                      {activeRule?.authority || 'Bureau of Indian Standards'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Verification Status
                    </span>
                    <p className="font-bold text-emerald-600 mt-0.5">
                      {activeRule?.verification_status === 'VERIFIED_OFFICIAL' ? 'Legally Enforced / Verified' : 'Potentially Applicable'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <a
                    href="https://standardsbis.bsbedge.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold py-2.5 px-4 rounded-md transition-all flex items-center justify-center gap-1.5"
                  >
                    View Official BIS Portal <ExternalLink size={13} />
                  </a>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
