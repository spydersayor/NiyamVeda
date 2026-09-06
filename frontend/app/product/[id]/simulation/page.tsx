'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FlaskConical, ArrowRight, Info, RefreshCw, Check 
} from 'lucide-react';
import { api, type SimulationResult } from '@/lib/api';
import { useTranslation } from '@/lib/i18n-context';
import ProductSidebar from '@/components/ProductSidebar';

export default function WhatIfSimulationPage() {
  const params = useParams();
  const { t } = useTranslation();
  const productId = (params.id as string) || 'demo-purifier-001';

  const [material, setMaterial] = useState('Flame-Retardant ABS');
  const [voltage, setVoltage] = useState('110V AC');
  const [intendedUse, setIntendedUse] = useState('Commercial Use');

  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [simulating, setSimulating] = useState(false);

  const runSimulation = useCallback(async (mat: string, volt: string, app: string) => {
    setSimulating(true);
    try {
      const res = await api.simulate({
        product_id: productId,
        material: mat,
        operating_voltage: volt,
        intended_use: app,
      });
      setSimResult(res);
    } catch {
      // Fallback handled in lib/api
    } finally {
      setSimulating(false);
    }
  }, [productId]);

  useEffect(() => {
    runSimulation(material, voltage, intendedUse);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, runSimulation]);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    runSimulation(material, voltage, intendedUse);
  };

  return (
    <div className="flex min-h-screen portal-bg font-sans text-slate-800">
      <ProductSidebar productId={productId} />

      <div className="flex-1 ml-14 py-8 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* ─── Header (Screen 10 Exact) ─── */}
          <div className="animate-slide-up">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {t('sim_header_title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {t('sim_header_desc')}
            </p>
          </div>

          {/* ─── 3-Column Comparative Layout (Screen 10 Exact) ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch animate-slide-up">
            
            {/* Column 1: Change Product Attributes */}
            <div className="bg-white/95 backdrop-blur-sm border border-white/60 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-lg card-interactive">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2 mb-4">
                  {t('sim_change_attrs')}
                </h2>

                <form onSubmit={handleSimulate} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {t('sim_attr_material')}
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px] line-through">Polycarbonate</span>
                      <span className="text-slate-400">&rarr;</span>
                      <select
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        className="bg-white border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 text-xs flex-1"
                      >
                        <option value="Flame-Retardant ABS">Flame-Retardant ABS</option>
                        <option value="Polycarbonate">Polycarbonate (Standard)</option>
                        <option value="Stainless Steel 304">Stainless Steel 304</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {t('sim_attr_voltage')}
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px] line-through">230V AC</span>
                      <span className="text-slate-400">&rarr;</span>
                      <select
                        value={voltage}
                        onChange={(e) => setVoltage(e.target.value)}
                        className="bg-white border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 text-xs flex-1"
                      >
                        <option value="110V AC">110V AC</option>
                        <option value="230V AC">230V AC</option>
                        <option value="24V DC">24V DC</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {t('sim_attr_use')}
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px] line-through">Domestic Use</span>
                      <span className="text-slate-400">&rarr;</span>
                      <select
                        value={intendedUse}
                        onChange={(e) => setIntendedUse(e.target.value)}
                        className="bg-white border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 text-xs flex-1"
                      >
                        <option value="Commercial Use">Commercial Use</option>
                        <option value="Domestic Consumer Use">Domestic Use</option>
                        <option value="Industrial Process">Industrial Process</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={simulating}
                    className="w-full bg-[#FF7828] hover:bg-[#E05E10] text-white font-bold text-xs py-2.5 rounded-md transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 mt-4"
                  >
                    {simulating ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" /> {t('sim_simulating')}
                      </>
                    ) : (
                      <>
                        {t('sim_btn_recalculate')} <ArrowRight size={13} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Column 2: Current Product Profile */}
            <div className="bg-white/95 backdrop-blur-sm border border-white/60 rounded-xl p-5 space-y-4 shadow-lg card-interactive">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2 mb-3">
                {t('sim_current_profile')}
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {t('standards_title')}
                  </span>
                  {(simResult?.current_profile?.standards && simResult.current_profile.standards.length > 0) ? (
                    simResult.current_profile.standards.map((s: string) => (
                      <p key={s} className="font-bold text-slate-800 mt-0.5">{s}</p>
                    ))
                  ) : (
                    <p className="text-slate-500 italic">No standards currently triggered</p>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {t('drawer_chip_tests')}
                  </span>
                  {(simResult?.current_profile?.tests && simResult.current_profile.tests.length > 0) ? (
                    simResult.current_profile.tests.map((t: string) => (
                      <p key={t} className="text-slate-700 font-medium mt-0.5">{t}</p>
                    ))
                  ) : (
                    <p className="text-slate-500 italic">Standard inspection</p>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {t('drawer_chip_crs')}
                  </span>
                  <p className="font-bold text-slate-900">
                    {simResult?.current_profile?.certification_route || 'Scheme I (ISI Mark)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3: Simulation Result (After Change) */}
            <div className="bg-white/95 backdrop-blur-sm border-2 border-[#FF7828] rounded-xl p-5 space-y-4 shadow-xl card-interactive relative">
              <div className="flex items-center justify-between border-b border-orange-200 pb-2 mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#FF7828]">
                  {t('sim_result_profile')}
                </h2>
                {simResult?.standards_diff && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold">
                    {(simResult.standards_diff.added?.length ?? 0) > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        +{simResult.standards_diff.added.length}
                      </span>
                    )}
                    {(simResult.standards_diff.removed?.length ?? 0) > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                        -{simResult.standards_diff.removed.length}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    {t('sim_diff_standards')}
                  </span>
                  
                  {/* Added Standards */}
                  {(simResult?.standards_diff?.added || []).map((s: string) => (
                    <div key={s} className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded p-1.5 text-xs font-bold mb-1.5 flex items-center justify-between">
                      <span className="truncate">{s}</span>
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 flex-shrink-0 ml-1">
                        + {t('sim_added')}
                      </span>
                    </div>
                  ))}

                  {/* Retained Standards */}
                  {(simResult?.standards_diff?.retained || []).map((s: string) => (
                    <div key={s} className="bg-slate-50 border border-slate-200 text-slate-800 rounded p-1.5 text-xs font-semibold mb-1.5 flex items-center justify-between">
                      <span className="truncate">{s}</span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 flex-shrink-0 ml-1">
                        {t('sim_retained')}
                      </span>
                    </div>
                  ))}

                  {/* Removed Standards */}
                  {(simResult?.standards_diff?.removed || []).map((s: string) => (
                    <div key={s} className="bg-rose-50 border border-rose-200 text-rose-700 rounded p-1.5 text-[11px] mb-1.5 flex items-center justify-between line-through opacity-75">
                      <span className="truncate">{s}</span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-rose-200 text-rose-800 no-underline flex-shrink-0 ml-1">
                        - {t('sim_removed')}
                      </span>
                    </div>
                  ))}

                  {(!simResult?.standards_diff?.added?.length && !simResult?.standards_diff?.retained?.length) && (
                    <p className="text-slate-500 italic">No standards applicable after change</p>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {t('drawer_chip_tests')}
                  </span>
                  {(simResult?.tests_diff?.retained || []).map((t: string) => (
                    <p key={t} className="font-semibold text-slate-800 mt-0.5">• {t}</p>
                  ))}
                  {(simResult?.tests_diff?.added || []).map((t: string) => (
                    <p key={t} className="font-bold text-[#FF7828] mt-0.5 flex items-center gap-1">
                      <span className="text-emerald-600 font-extrabold">+</span> {t}
                    </p>
                  ))}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {t('drawer_chip_crs')}
                  </span>
                  <div className="p-2 rounded bg-slate-100 border border-slate-200 font-extrabold text-slate-900 text-xs">
                    {simResult?.certification_route || 'Scheme I (ISI Mark)'}
                  </div>
                </div>

                {simResult?.deterministic_provenance && simResult.deterministic_provenance.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 space-y-1.5 bg-orange-50/50 p-2.5 rounded-lg border border-orange-100">
                    <span className="text-[10px] font-bold text-orange-900 uppercase tracking-wider block">
                      {t('sim_impact_summary')}
                    </span>
                    {simResult.deterministic_provenance.map((prov: string, i: number) => (
                      <p key={i} className="text-[11px] text-slate-700 leading-snug">
                        {prov}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ─── Bottom Note (Screen 10 Exact) ─── */}
          <div className="flex items-start gap-2.5 bg-[#F8FAFC] border border-slate-200 rounded-lg p-4 text-xs text-slate-500 leading-relaxed mt-6">
            <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <span>
              {t('sim_provenance_note')}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
