'use client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { X, ArrowRight, Check } from 'lucide-react';
import ProductSidebar from '@/components/ProductSidebar';

export default function WhyRuleAppliesPage() {
  const params = useParams();
  const router = useRouter();
  const productId = (params.id as string) || 'demo-purifier-001';

  return (
    <div className="flex flex-col lg:flex-row min-h-screen portal-bg font-sans text-slate-800">
      <ProductSidebar productId={productId} />

      <div className="flex-1 ml-0 lg:ml-14 py-6 sm:py-8 px-3 sm:px-6 md:px-8 flex items-center justify-center min-w-0">
        <div className="max-w-2xl w-full bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/60 p-4 sm:p-6 md:p-8 relative space-y-6 animate-slide-up">
          
          {/* Header (Screen 5 Exact) */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Why This Rule Applies
            </h1>
            <button
              onClick={() => router.push(`/product/${productId}/analysis`)}
              className="w-8 h-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Linear Trace Flow (Screen 5 Exact) */}
          <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-3 before:w-[1.5px] before:bg-slate-200">
            
            {/* 1. PRODUCT FACT */}
            <div className="relative">
              <div className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full border-2 border-emerald-500 bg-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                PRODUCT FACT
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5 break-words">
                Operating Voltage: 230V AC
              </p>
            </div>

            {/* 2. RULE EVALUATED */}
            <div className="relative">
              <div className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full border-2 border-slate-700 bg-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  RULE EVALUATED
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-300">
                  DETERMINISTIC RULE
                </span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5 break-words">
                RULE-BIS-014
              </p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed break-words">
                Household electrical appliance operating above the specified voltage threshold.
              </p>
            </div>

            {/* 3. RULE CONDITION */}
            <div className="relative">
              <div className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full border-2 border-slate-700 bg-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  RULE CONDITION
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-300">
                  DETERMINISTIC RULE
                </span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5 break-words">
                IS 302 (Part 1): 2008 – Clause 22.1
              </p>
              <p className="text-xs text-slate-600 mt-1 italic leading-relaxed break-words">
                Appliances shall be constructed so that their electrical insulation does not break down during normal operation.
              </p>
            </div>

            {/* 4. RESULT */}
            <div className="relative">
              <div className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full border-2 border-purple-600 bg-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  RESULT
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-200">
                  AI SYNTHESIS
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed break-words">
                This rule was triggered because the operating voltage (230V AC) falls within the condition defined in the rule.
              </p>
            </div>

          </div>

          {/* Bottom Button (Screen 5 Exact) */}
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <Link
              href={`/product/${productId}/sources`}
              className="bg-[#0B132B] hover:bg-[#1E293B] text-white text-xs font-bold px-5 py-2.5 rounded-md transition-all flex items-center gap-1.5 shadow-sm"
            >
              View Evidence Trail <ArrowRight size={13} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
