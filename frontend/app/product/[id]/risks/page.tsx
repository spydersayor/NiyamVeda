'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  AlertTriangle, AlertOctagon, ShieldAlert, ArrowRight, 
  Info, ExternalLink 
} from 'lucide-react';
import { api, type AnalysisResult, type ComplianceRisk } from '@/lib/api';
import { useTranslation } from '@/lib/i18n-context';
import ProductSidebar from '@/components/ProductSidebar';

export default function PotentialComplianceRisksPage() {
  const params = useParams();
  const { t } = useTranslation();
  const productId = (params.id as string) || 'demo-purifier-001';
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    api.getAnalysisResult(productId)
      .then(setResult)
      .catch(() => {});
  }, [productId]);

  const risks: ComplianceRisk[] = result?.risks ?? [];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen portal-bg font-sans text-slate-800">
      <ProductSidebar productId={productId} />

      <div className="flex-1 ml-0 lg:ml-14 py-6 sm:py-8 px-4 sm:px-6 md:px-12 min-w-0">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* ─── Header (Screen 9 Exact) ─── */}
          <div className="animate-slide-up">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {t('risks_title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {t('risks_subtitle')}
            </p>
          </div>

          {/* ─── Risk Cards (Screen 9 Exact) ─── */}
          <div className="space-y-4">
            {risks.length === 0 ? (
              <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl p-8 text-center space-y-2 shadow-lg">
                <h2 className="text-sm font-bold text-slate-800">
                  {t('risks_no_risks_title')}
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {t('risks_no_risks_desc')}
                </p>
              </div>
            ) : (
              risks.map((r) => (
              <div
                key={r.id}
                className="bg-white/95 backdrop-blur-sm border border-white/60 rounded-xl p-5 shadow-lg card-interactive flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Severity Pill */}
                    {r.severity === 'HIGH' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200 uppercase tracking-wide">
                        {t('risks_severity_high')}
                      </span>
                    )}
                    {r.severity === 'MEDIUM' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200 uppercase tracking-wide">
                        {t('risks_severity_medium')}
                      </span>
                    )}
                    {r.severity === 'POTENTIAL' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200 uppercase tracking-wide">
                        {t('risks_severity_low')}
                      </span>
                    )}

                    <h2 className="text-sm font-extrabold text-slate-900 break-words">
                      {r.risk}
                    </h2>
                  </div>

                  <p className="text-xs text-slate-600 break-words">
                    {r.why_it_matters}
                  </p>

                  <p className="text-xs text-slate-800 font-semibold break-words">
                    <span className="text-slate-500 font-normal">{t('risks_suggested_action')}: </span>
                    {r.suggested_action}
                  </p>
                </div>

                {/* Evidence Strength (Right Column of card) */}
                <div className="text-left sm:text-right flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t('metric_evidence_confidence')}
                  </span>
                  <span className={`text-xs font-bold ${
                    r.evidence_strength === 'High' ? 'text-red-600' : 'text-amber-600'
                  }`}>
                    {r.evidence_strength}
                  </span>
                </div>
              </div>
            )))}
          </div>

          {/* ─── Bottom Navigation Link (Screen 9 Exact) ─── */}
          <div className="flex justify-end pt-4">
            <Link
              href={`/product/${productId}/simulation`}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
            >
              {t('sim_title')} <ArrowRight size={13} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
