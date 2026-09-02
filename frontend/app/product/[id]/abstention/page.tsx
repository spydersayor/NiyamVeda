'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  AlertTriangle, Shield, ArrowRight, ArrowLeft, 
  FileText, Search, Edit3, HelpCircle 
} from 'lucide-react';
import ProductSidebar from '@/components/ProductSidebar';

export default function SafeAbstentionStatePage() {
  const params = useParams();
  const productId = (params.id as string) || 'demo-purifier-001';

  return (
    <div className="flex min-h-screen portal-bg font-sans text-slate-800">
      <ProductSidebar productId={productId} />

      <div className="flex-1 ml-14 py-10 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto space-y-7">

          {/* ─── Header (Screen 12 Exact) ─── */}
          <div className="text-center max-w-2xl mx-auto space-y-2 animate-slide-up">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              More Information or Evidence Is Needed
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We could not find sufficient verified evidence in the currently indexed authoritative sources to provide a reliable compliance conclusion for this product characteristic.
            </p>
          </div>

          {/* ─── Gold / Saffron Alert Banner (Screen 12 Center) ─── */}
          <div className="bg-[#FFF8E6]/95 backdrop-blur-sm border border-amber-300 rounded-2xl p-6 shadow-2xl space-y-5 animate-slide-up">
            {/* Banner Header */}
            <div className="flex items-center justify-center gap-2 bg-[#F6A609] text-white py-1.5 px-4 rounded-md w-fit mx-auto shadow-sm">
              <Shield size={16} fill="white" />
              <span className="text-xs font-black tracking-wider uppercase">
                SAFE ABSTENTION ACTIVATED
              </span>
            </div>

            {/* 3 Detail Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
              <div className="bg-white/80 border border-amber-200/80 rounded-lg p-3.5 space-y-1">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide block">
                  Product Characteristic
                </span>
                <p className="font-extrabold text-slate-900">
                  UV-LED Sanitization Chamber
                </p>
              </div>

              <div className="bg-white/80 border border-amber-200/80 rounded-lg p-3.5 space-y-1">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide block">
                  Evidence Search Result
                </span>
                <p className="text-slate-700 leading-snug">
                  No sufficiently verified applicable regulatory evidence found.
                </p>
              </div>

              <div className="bg-white/80 border border-amber-200/80 rounded-lg p-3.5 space-y-1">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide block">
                  System Action
                </span>
                <p className="text-slate-700 leading-snug">
                  AI-generated conclusion blocked for this characteristic.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Recommended Next Actions (Screen 12) ─── */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 text-center">
              Recommended Next Actions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-4 space-y-1 hover:border-slate-300 transition-all">
                <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                  <Edit3 size={14} className="text-[#FF7828]" />
                  <span>Add Product Information</span>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  Provide additional technical specifications and test lab reports for the module.
                </p>
              </div>

              <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-4 space-y-1 hover:border-slate-300 transition-all">
                <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                  <Search size={14} className="text-[#FF7828]" />
                  <span>Review Available Sources</span>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  Inspect authoritative sources in the system to verify current scope under IS 16240: 2015.
                </p>
              </div>

              <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-4 space-y-1 hover:border-slate-300 transition-all">
                <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                  <FileText size={14} className="text-[#FF7828]" />
                  <span>Refine Product Description</span>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  Provide more precise technical details regarding standalone vs integrated UV operation.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Navy Action Button (Screen 12 Center) ─── */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => alert('Expert review request logged for this product specification.')}
              className="bg-[#0B132B] hover:bg-[#1E293B] text-white text-xs font-bold px-7 py-3 rounded-md shadow-md transition-all flex items-center gap-2"
            >
              Request Expert Review (Optional) <ArrowRight size={14} />
            </button>
          </div>

          {/* ─── Bottom Note (Screen 12 Exact) ─── */}
          <p className="text-[11px] text-slate-400 text-center italic pt-2">
            When evidence is insufficient, NiyamVeda highlights the gap instead of generating an unsupported conclusion.
          </p>

        </div>
      </div>
    </div>
  );
}
