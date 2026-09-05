'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FlaskConical, ArrowRight, Info, RefreshCw, Check 
} from 'lucide-react';
import { api, type SimulationResult } from '@/lib/api';
import ProductSidebar from '@/components/ProductSidebar';

export default function WhatIfSimulationPage() {
  const params = useParams();
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
              What If You Change Your Product?
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              See how changes in product attributes may affect the compliance pathway.
            </p>
          </div>

          {/* ─── 3-Column Comparative Layout (Screen 10 Exact) ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch animate-slide-up">
            
            {/* Column 1: Change Product Attributes */}
            <div className="bg-white/95 backdrop-blur-sm border border-white/60 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-lg card-interactive">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2 mb-4">
                  Change Product Attributes
                </h2>

                <form onSubmit={handleSimulate} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Material
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
                      Operating Voltage
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
                      Application
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
                        <RefreshCw size={13} className="animate-spin" /> Evaluating...
                      </>
                    ) : (
                      <>
                        Simulate Change <ArrowRight size={13} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Column 2: Current Product Profile */}
            <div className="bg-white/95 backdrop-blur-sm border border-white/60 rounded-xl p-5 space-y-4 shadow-lg card-interactive">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2 mb-3">
                Current Product Profile
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Applicable Standards
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
                    Key Tests
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
                    Certification Route
                  </span>
                  <p className="font-bold text-slate-900">
                    {simResult?.current_profile?.certification_route || 'Scheme I (ISI Mark)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3: Simulation Result (After Change) */}
            <div className="bg-white/95 backdrop-blur-sm border-2 border-[#FF7828]/60 rounded-xl p-5 space-y-4 shadow-xl card-interactive relative">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#FF7828] border-b border-orange-200 pb-2 mb-3">
                Simulation Result <span className="text-[10px] font-normal text-slate-500">(After Change)</span>
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Applicable Standards
                  </span>
                  {/* Retained Standards */}
                  {(simResult?.standards_diff?.retained || []).map((s: string) => (
                    <p key={s} className="font-bold text-slate-800 mt-0.5">{s}</p>
                  ))}
                  {/* Added Standards */}
                  {(simResult?.standards_diff?.added || []).map((s: string) => (
                    <p key={s} className="font-extrabold text-[#FF7828] mt-0.5 flex items-center gap-1">
                      + {s}
                    </p>
                  ))}
                  {/* Removed Standards */}
                  {(simResult?.standards_diff?.removed || []).map((s: string) => (
                    <p key={s} className="text-rose-600 line-through text-[11px] mt-0.5 flex items-center gap-1">
                      - {s}
                    </p>
                  ))}
                  {(!simResult?.standards_diff?.added?.length && !simResult?.standards_diff?.retained?.length) && (
                    <p className="text-slate-500 italic">No standards applicable after change</p>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Tests Required
                  </span>
                  {(simResult?.tests_diff?.retained || []).map((t: string) => (
                    <p key={t} className="font-bold text-slate-800 mt-0.5">{t}</p>
                  ))}
                  {(simResult?.tests_diff?.added || []).map((t: string) => (
                    <p key={t} className="font-extrabold text-[#FF7828] mt-0.5">+ {t}</p>
                  ))}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Certification Route
                  </span>
                  <p className="font-extrabold text-slate-900">
                    {simResult?.certification_route || 'Scheme I (ISI Mark)'}
                  </p>
                </div>

                {simResult?.deterministic_provenance && simResult.deterministic_provenance.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Deterministic Impact
                    </span>
                    {simResult.deterministic_provenance.map((prov: string, i: number) => (
                      <p key={i} className="text-[10px] text-slate-600 leading-tight">
                        • {prov}
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
              Simulation result is for decision support only and not a legal compliance conclusion.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
