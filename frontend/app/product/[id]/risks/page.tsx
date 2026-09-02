'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  AlertTriangle, AlertOctagon, ShieldAlert, ArrowRight, 
  Info, ExternalLink 
} from 'lucide-react';
import { api, type AnalysisResult, type ComplianceRisk } from '@/lib/api';
import ProductSidebar from '@/components/ProductSidebar';

export default function PotentialComplianceRisksPage() {
  const params = useParams();
  const productId = (params.id as string) || 'demo-purifier-001';
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    api.getAnalysisResult(productId)
      .then(setResult)
      .catch(() => {});
  }, [productId]);

  const risks: ComplianceRisk[] = result?.risks || [
    {
      id: 'RISK-01',
      risk: 'Material Test Failure',
      severity: 'HIGH',
      why_it_matters: 'Polycarbonate may fail glow-wire or flame-retardancy tests.',
      potential_impact: '',
      suggested_action: 'Consider flame-retardant grade or alternative material.',
      evidence_strength: 'High',
      risk_type: 'EVIDENCE_SUPPORTED_RISK',
    },
    {
      id: 'RISK-02',
      risk: 'Incorrect Product Classification',
      severity: 'MEDIUM',
      why_it_matters: 'Misclassification may lead to wrong standard selection.',
      potential_impact: '',
      suggested_action: 'Review technical characteristics and intended use.',
      evidence_strength: 'Medium',
      risk_type: 'INFORMATION_GAP',
    },
    {
      id: 'RISK-03',
      risk: 'Incomplete Documentation',
      severity: 'POTENTIAL',
      why_it_matters: 'Missing technical documents may delay certification.',
      potential_impact: '',
      suggested_action: 'Prepare complete technical file and test reports.',
      evidence_strength: 'Medium',
      risk_type: 'INFORMATION_GAP',
    },
  ];

  return (
    <div className="flex min-h-screen portal-bg font-sans text-slate-800">
      <ProductSidebar productId={productId} />

      <div className="flex-1 ml-14 py-8 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* ─── Header (Screen 9 Exact) ─── */}
          <div className="animate-slide-up">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Potential Compliance Risks – Before You Test
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Identified risks based on current product information.
            </p>
          </div>

          {/* ─── 3 Risk Cards (Screen 9 Exact) ─── */}
          <div className="space-y-4">
            {risks.map((r) => (
              <div
                key={r.id}
                className="bg-white/95 backdrop-blur-sm border border-white/60 rounded-xl p-5 shadow-lg card-interactive flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    {/* Severity Pill */}
                    {r.severity === 'HIGH' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200 uppercase tracking-wide">
                        HIGH RISK
                      </span>
                    )}
                    {r.severity === 'MEDIUM' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200 uppercase tracking-wide">
                        MEDIUM RISK
                      </span>
                    )}
                    {r.severity === 'POTENTIAL' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200 uppercase tracking-wide">
                        POTENTIAL RISK
                      </span>
                    )}

                    <h2 className="text-sm font-extrabold text-slate-900">
                      {r.risk}
                    </h2>
                  </div>

                  <p className="text-xs text-slate-600">
                    {r.why_it_matters}
                  </p>

                  <p className="text-xs text-slate-800 font-semibold">
                    <span className="text-slate-500 font-normal">Action: </span>
                    {r.suggested_action}
                  </p>
                </div>

                {/* Evidence Strength (Right Column of card) */}
                <div className="text-right sm:text-right flex-shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Evidence Strength
                  </span>
                  <span className={`text-xs font-bold ${
                    r.evidence_strength === 'High' ? 'text-red-600' : 'text-amber-600'
                  }`}>
                    {r.evidence_strength}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ─── Bottom Navigation Link (Screen 9 Exact) ─── */}
          <div className="flex justify-end pt-4">
            <Link
              href={`/product/${productId}/simulation`}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
            >
              View All Risks &amp; Scenarios <ArrowRight size={13} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
