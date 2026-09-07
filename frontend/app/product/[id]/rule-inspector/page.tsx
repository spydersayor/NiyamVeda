'use client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { X, ArrowRight, Info } from 'lucide-react';
import ProductSidebar from '@/components/ProductSidebar';
import { useTranslation } from '@/lib/i18n-context';

export default function RuleInspectorPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = (params.id as string) || 'demo-purifier-001';
  const ruleId = searchParams.get('rule') || 'RULE-BIS-014';
  const { t } = useTranslation();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen portal-bg font-sans text-slate-800">
      <ProductSidebar productId={productId} />

      <div className="flex-1 ml-0 lg:ml-14 py-6 sm:py-8 px-3 sm:px-6 md:px-8 flex items-center justify-center min-w-0">
        <div className="max-w-3xl w-full bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/60 p-4 sm:p-6 md:p-8 relative space-y-6 animate-slide-up">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight break-words">
              {t('rule_inspector_heading')} – {ruleId}
            </h1>
            <button
              onClick={() => router.push(`/product/${productId}/analysis`)}
              className="w-8 h-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              title={t('common_close')}
            >
              <X size={18} />
            </button>
          </div>

          {/* 2-Column Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start divide-y md:divide-y-0 md:divide-x divide-slate-200">
            
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

              {/* Pseudo Logic Box */}
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-4 font-mono text-xs text-slate-800 space-y-2.5">
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

              {/* Informational Callout */}
              <div className="flex items-start gap-2 text-[11px] text-slate-500 pt-1">
                <Info size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
                <span>{t('analysis_rule_provenance')}</span>
              </div>
            </div>

            {/* Right Column: Supporting Evidence */}
            <div className="md:pl-8 space-y-4 text-xs pt-4 md:pt-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  {t('inspector_evidence')}
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-300">
                  {t('inspector_authoritative_badge')}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {t('evidence_source_label')}
                </span>
                <p className="font-extrabold text-slate-900 text-xs mt-0.5">
                  IS 302 (Part 1): 2008
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {t('evidence_clause_label')}
                </span>
                <p className="font-semibold text-slate-800 text-xs mt-0.5">
                  Clause 22.1 – Structure &amp; Insulation
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  {t('evidence_excerpt_label')}
                </span>
                <blockquote className="bg-[#F8FAFC] border-l-2 border-l-[#FF7828] border border-slate-200 rounded-md p-3 text-xs text-slate-700 italic leading-relaxed">
                  &ldquo;Appliances shall be constructed so that their electrical insulation does not break down during normal operation.&rdquo;
                </blockquote>
              </div>
            </div>

          </div>

          {/* Bottom Button */}
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <Link
              href={`/product/${productId}/sources`}
              className="bg-[#0B132B] hover:bg-[#1E293B] text-white text-xs font-bold px-6 py-2.5 rounded-md transition-all flex items-center gap-1.5 shadow-sm"
            >
              {t('evidence_view_full_source')} <ArrowRight size={13} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
