'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Database, ArrowRight, ExternalLink, ShieldCheck, 
  Check, Info 
} from 'lucide-react';
import { api, type SourceRegistryItem } from '@/lib/api';
import ProductSidebar from '@/components/ProductSidebar';

export default function VerifiedSourcesEvidenceTrailPage() {
  const params = useParams();
  const productId = (params.id as string) || 'demo-purifier-001';

  return (
    <div className="flex min-h-screen portal-bg font-sans text-slate-800">
      <ProductSidebar productId={productId} />

      <div className="flex-1 ml-14 py-8 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* ─── Header (Screen 11 Exact) ─── */}
          <div className="animate-slide-up">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Evidence Trail
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Trace how each compliance conclusion is supported.
            </p>
          </div>

          {/* ─── 2-Panel Layout (Screen 11 Exact) ─── */}
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
                    Operating Voltage: 230V AC
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
                      DETERMINISTIC RULE
                    </span>
                  </div>
                  <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                    RULE-BIS-014
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
                    IS 302 (Part 1): 2008 – Clause 22.1
                  </p>
                  <blockquote className="bg-white border-l-2 border-l-[#FF7828] border border-slate-200 rounded-md p-3 text-xs text-slate-600 italic leading-relaxed mt-1.5">
                    &ldquo;Appliances shall be constructed so that their electrical insulation does not break down during normal operation.&rdquo;
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
                      VERIFIED SOURCE
                    </span>
                  </div>
                  <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                    IS 302 (Part 1): 2008
                  </p>
                  <p className="text-[11px] text-slate-500">Bureau of Indian Standards</p>
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
                    Source Type
                  </span>
                  <p className="font-semibold text-slate-900 mt-0.5">BIS Standard</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Document No.
                  </span>
                  <p className="font-bold text-slate-900 mt-0.5">IS 302 (Part 1): 2008</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Issuing Authority
                  </span>
                  <p className="font-semibold text-slate-900 mt-0.5">Bureau of Indian Standards</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Effective Date
                  </span>
                  <p className="font-semibold text-slate-900 mt-0.5">01 Dec 2008</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Status
                  </span>
                  <p className="font-bold text-emerald-600 mt-0.5">Legally Enforced</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <a
                  href="https://standardsbis.bsbedge.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold py-2.5 px-4 rounded-md transition-all flex items-center justify-center gap-1.5"
                >
                  View Full Document <ArrowRight size={13} />
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
