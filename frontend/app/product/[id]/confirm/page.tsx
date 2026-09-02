'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Check, Info, ArrowRight, ArrowLeft } from 'lucide-react';
import { api, type Product } from '@/lib/api';

export default function ConfirmProductFactsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = (params.id as string) || 'demo-purifier-001';

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getProduct(productId)
      .then(setProduct)
      .catch(() => {
        // Fallback demo data already returns from api
      });
  }, [productId]);

  const handleConfirm = () => {
    setLoading(true);
    router.push(`/product/${productId}/analysis`);
  };

  // Facts grid (2 columns x 3 rows exactly matching Screen 3)
  const factsList = [
    {
      label: 'PRODUCT CATEGORY',
      value: product?.category || 'Electrical Household Appliance',
      badge: 'User Provided',
      badgeType: 'green',
    },
    {
      label: 'MATERIAL / STRUCTURE',
      value: product?.material_composition?.split(',')[0] || 'Polycarbonate Housing',
      badge: 'Extracted from Document',
      badgeType: 'blue',
    },
    {
      label: 'APPLICATION INTENT',
      value: product?.intended_use?.split(' ')[0] + ' Consumer Use' || 'Domestic Consumer Use',
      badge: 'User Provided',
      badgeType: 'green',
    },
    {
      label: 'OPERATING VOLTAGE',
      value: product?.operating_voltage || '230V AC, 50Hz',
      badge: 'User Provided',
      badgeType: 'green',
    },
    {
      label: 'POWER CONSUMPTION',
      value: product?.power_consumption || '40W',
      badge: 'Extracted from Document',
      badgeType: 'blue',
    },
    {
      label: 'WATER STORAGE CAPACITY',
      value: product?.water_storage_capacity || '8 Liters',
      badge: 'User Provided',
      badgeType: 'green',
    },
  ];

  return (
    <div className="min-h-screen portal-bg py-10 px-4 sm:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ─── Header (Screen 3) ─── */}
        <div className="space-y-1 animate-slide-up">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Confirm What We Understood
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Review the structured product facts before NiyamVeda evaluates applicable compliance rules.
          </p>
        </div>

        {/* ─── 6 Fact Cards (2 Columns x 3 Rows on White Cards) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {factsList.map((fact) => (
            <div 
              key={fact.label}
              className="bg-white/95 backdrop-blur-sm rounded-xl p-5 shadow-lg flex items-start justify-between gap-4 border border-slate-200 card-interactive"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 block">
                  {fact.label}
                </span>
                <p className="text-sm font-extrabold text-slate-900 leading-tight">
                  {fact.value}
                </p>
              </div>

              {/* Source Origin Pill */}
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 border ${
                fact.badgeType === 'green'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-blue-50 text-blue-700 border-blue-300'
              }`}>
                {fact.badge}
              </span>
            </div>
          ))}
        </div>

        {/* ─── Blue Info Note Box (Screen 3) ─── */}
        <div className="flex items-center gap-3 bg-[#0B152A] border border-blue-900/60 rounded-lg p-3.5 text-xs text-slate-300">
          <Info size={16} className="text-blue-400 flex-shrink-0" />
          <span>
            Some information may be inferred. Please review carefully before proceeding.
          </span>
        </div>

        {/* ─── Bottom Actions Bar (Screen 3) ─── */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <Link
            href="/product/new"
            className="bg-[#0B132B] hover:bg-[#1E293B] border border-slate-700 text-slate-300 text-xs font-semibold px-5 py-2.5 rounded-md transition-all"
          >
            Edit Information
          </Link>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-[#FF7828] hover:bg-[#E05E10] text-white text-xs font-bold px-6 py-2.5 rounded-md transition-all shadow-md shadow-orange-500/20 flex items-center gap-2"
          >
            {loading ? 'Analyzing...' : (
              <>
                Confirm &amp; Run Analysis <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
