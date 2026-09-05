'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, ExternalLink, ShieldCheck, AlertCircle, 
  HelpCircle, ChevronRight, X, Info, Check 
} from 'lucide-react';
import { api, type AnalysisResult, type ApplicableStandard } from '@/lib/api';
import ProductSidebar from '@/components/ProductSidebar';

export default function RelevantStandardsPage() {
  const params = useParams();
  const productId = (params.id as string) || 'demo-purifier-001';
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<ApplicableStandard | null>(null);

  useEffect(() => {
    api.getAnalysisResult(productId)
      .then(setResult)
      .catch(() => {});
  }, [productId]);

  const standards = result?.standards ?? [];
  const isAbstaining = result?.safe_abstention?.activated || (result && standards.length === 0);

  return (
    <div className="flex min-h-screen portal-bg font-sans text-slate-800">
      <ProductSidebar productId={productId} />

      <div className="flex-1 ml-14 py-8 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* ─── Header (Screen 7 Exact) ─── */}
          <div className="animate-slide-up">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Relevant Standards
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Based on your product facts and rule evaluation.
            </p>
          </div>

          {/* ─── Standards Cards (Screen 7 Exact) ─── */}
          <div className="space-y-4">
            {isAbstaining && (
              <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl p-8 text-center space-y-3 shadow-lg">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertCircle size={24} />
                </div>
                <h2 className="text-base font-bold text-slate-800">
                  Insufficient Evidence to Determine Applicable Standard
                </h2>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  {result?.safe_abstention?.abstention_reason || 
                    "No published Indian Standards (BIS) or statutory Quality Control Orders matched the supplied technical parameters."}
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
            )}

            {standards.map((std) => (
              <div 
                key={std.standard_identifier}
                className="bg-white/95 backdrop-blur-sm border border-white/60 rounded-xl p-5 shadow-lg card-interactive flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                      {std.standard_identifier}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700">
                    {std.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {std.relevance_summary}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 self-start md:self-center flex-shrink-0">
                  {/* Verified Badge */}
                  {std.verification_status === 'VERIFIED_OFFICIAL' && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center gap-1">
                      <Check size={12} /> Verified Official Source
                    </span>
                  )}
                  {std.verification_status === 'NEEDS_REVIEW' && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-300 flex items-center gap-1">
                      <AlertCircle size={12} /> Version/Needs Review
                    </span>
                  )}
                  {std.verification_status === 'POTENTIALLY_APPLICABLE' && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-orange-50 text-[#FF7828] border border-orange-200 flex items-center gap-1">
                      <HelpCircle size={12} /> Needs Confirmation
                    </span>
                  )}

                  {/* View Evidence Button */}
                  <button
                    onClick={() => setSelectedStandard(std)}
                    className="border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold px-4 py-2 rounded-md transition-all whitespace-nowrap"
                  >
                    View Evidence
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ─── Bottom Note (Screen 7 Exact) ─── */}
          <div className="flex items-start gap-2.5 bg-[#F8FAFC] border border-slate-200 rounded-lg p-4 text-xs text-slate-500 leading-relaxed mt-6">
            <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <span>
              These standards are potentially applicable. Final applicability may depend on detailed evaluation.
            </span>
          </div>

        </div>
      </div>

      {/* Evidence Drawer/Modal */}
      {selectedStandard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 text-slate-800 shadow-2xl relative space-y-4 animate-slide-in">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                  AUTHORITATIVE EVIDENCE
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedStandard.standard_identifier}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedStandard(null)}
                className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-4 border-l-2 border-l-[#FF7828]">
                <span className="text-[10px] font-bold text-slate-500 block mb-1">
                  {selectedStandard.clause_reference}
                </span>
                <blockquote className="italic text-slate-700 leading-relaxed">
                  &ldquo;{selectedStandard.evidence_excerpt}&rdquo;
                </blockquote>
              </div>

              <div className="text-slate-500 pt-1">
                Authority: <strong className="text-slate-800">{selectedStandard.document_source}</strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <a
                href={selectedStandard.official_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#FF7828] font-bold hover:underline flex items-center gap-1"
              >
                Open BIS Portal <ExternalLink size={12} />
              </a>
              <button
                onClick={() => setSelectedStandard(null)}
                className="bg-[#0B132B] text-white text-xs font-bold px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
