'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ClipboardList, CheckCircle2, Clock, AlertTriangle, 
  Info, Check 
} from 'lucide-react';
import { api, type AnalysisResult, type ComplianceRequirement } from '@/lib/api';
import { useTranslation } from '@/lib/i18n-context';
import ProductSidebar from '@/components/ProductSidebar';

export default function RequirementsChecklistPage() {
  const params = useParams();
  const { t } = useTranslation();
  const productId = (params.id as string) || 'demo-purifier-001';
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    api.getAnalysisResult(productId)
      .then(setResult)
      .catch(() => {});
  }, [productId]);

  const requirements: ComplianceRequirement[] = result?.requirements ?? [];
  const completionPercent = result?.checklist_completion_percent ?? 0;

  return (
    <div className="flex min-h-screen portal-bg font-sans text-slate-800">
      <ProductSidebar productId={productId} />

      <div className="flex-1 ml-14 py-8 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* ─── Header (Screen 8 Exact) ─── */}
          <div className="flex items-center justify-between animate-slide-up">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {t('req_title')}
            </h1>

            {/* Dynamic % Completed Badge */}
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center gap-1.5 shadow-sm">
              <span className="text-emerald-500 font-extrabold">+</span> {completionPercent}% {t('req_completed')}
            </span>
          </div>

          {/* ─── Requirements Table (Screen 8 Exact) ─── */}
          <div className="bg-white/95 backdrop-blur-md border border-white/60 rounded-xl overflow-hidden shadow-2xl animate-slide-up">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4 w-1/4">{t('req_col_req')}</th>
                    <th className="py-3 px-4 w-2/5">{t('req_col_why')}</th>
                    <th className="py-3 px-4 w-1/5">{t('req_col_source')}</th>
                    <th className="py-3 px-4 text-right">{t('req_col_status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {requirements.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500 font-medium">
                        {t('req_no_reqs')}
                      </td>
                    </tr>
                  ) : (
                    requirements.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {req.requirement}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 leading-relaxed">
                          {req.why_it_applies}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {req.source}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          {req.status === 'READY' && (
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {t('req_status_verified')}
                            </span>
                          )}
                          {req.status === 'NEEDS_INFORMATION' && (
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                              {t('req_status_pending')}
                            </span>
                          )}
                          {(req.status === 'REVIEW_REQUIRED' || req.status === 'REVIEW') && (
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-red-50 text-red-700 border border-red-200">
                              {t('req_status_action')}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ─── Bottom Note (Screen 8 Exact) ─── */}
          <div className="flex items-start gap-2.5 bg-[#F8FAFC] border border-slate-200 rounded-lg p-4 text-xs text-slate-500 leading-relaxed">
            <Info size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <span>
              {t('standards_insufficient_desc')}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
