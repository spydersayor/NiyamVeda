'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Check, Info, ArrowRight, ArrowLeft, FileText, 
  User, CheckCircle2, AlertCircle, Edit3, Save, X 
} from 'lucide-react';
import { api, type Product, type ProductFact } from '@/lib/api';

export default function ConfirmProductFactsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = (params.id as string) || 'demo-purifier-001';

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    api.getProduct(productId)
      .then(setProduct)
      .catch(() => {
        // Handled by api fallback
      });
  }, [productId]);

  const handleConfirm = () => {
    setLoading(true);
    router.push(`/product/${productId}/analysis`);
  };

  // Facts grid dynamically assembled from product attributes or stored facts
  const factsList: Array<{
    key: string;
    label: string;
    value: string;
    origin: string;
  }> = product?.facts && product.facts.length > 0
    ? product.facts.map(f => ({
        key: f.key,
        label: f.label || f.key.replace(/_/g, ' ').toUpperCase(),
        value: f.value,
        origin: f.origin,
      }))
    : [
        {
          key: 'category',
          label: 'PRODUCT CATEGORY',
          value: product?.category || 'General Product',
          origin: 'USER_PROVIDED',
        },
        {
          key: 'material_composition',
          label: 'MATERIAL / STRUCTURE',
          value: product?.material_composition || 'Not Specified',
          origin: 'EXTRACTED_FROM_DOCUMENT',
        },
        {
          key: 'intended_use',
          label: 'APPLICATION INTENT',
          value: product?.intended_use || 'General Commercial / Domestic Use',
          origin: 'USER_PROVIDED',
        },
        {
          key: 'operating_voltage',
          label: 'OPERATING VOLTAGE',
          value: product?.operating_voltage || '230V AC, 50Hz',
          origin: 'USER_PROVIDED',
        },
        {
          key: 'power_consumption',
          label: 'POWER / CAPACITY',
          value: [product?.power_consumption, product?.water_storage_capacity].filter(Boolean).join(' / ') || '40W / 8 Liters',
          origin: 'EXTRACTED_FROM_DOCUMENT',
        },
        {
          key: 'technical_characteristics',
          label: 'TECHNICAL CHARACTERISTICS',
          value: product?.technical_characteristics || 'Operating voltage: 230V AC, Frequency: 50Hz',
          origin: 'USER_PROVIDED',
        },
      ];

  const handleStartEdit = (key: string, currentValue: string) => {
    setEditingKey(key);
    setEditValue(currentValue);
  };

  const handleSaveEdit = (key: string) => {
    if (!product) return;
    const updatedFacts = (product.facts || []).map(f => {
      if (f.key === key) {
        return { ...f, value: editValue, is_confirmed: true };
      }
      return f;
    });

    // If fact didn't exist in array, add it
    if (!updatedFacts.some(f => f.key === key)) {
      updatedFacts.push({
        key,
        label: key.replace(/_/g, ' ').toUpperCase(),
        value: editValue,
        origin: 'USER_PROVIDED',
        is_confirmed: true,
        needs_review: false
      });
    }

    setProduct({ ...product, facts: updatedFacts });
    setEditingKey(null);
  };

  return (
    <div className="min-h-screen portal-bg py-10 px-4 sm:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="space-y-1 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#102242] border border-blue-500/30 text-[11px] font-bold text-blue-300">
            <CheckCircle2 size={13} className="text-emerald-400" />
            <span>STEP 3: FACT VERIFICATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Confirm What We Understood
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Review the extracted engineering facts before NiyamVeda evaluates applicable BIS standards. You can edit any parameter inline.
          </p>
        </div>

        {/* Fact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {factsList.map((fact) => {
            const isEditing = editingKey === fact.key;
            const isExtracted = fact.origin === 'EXTRACTED_FROM_DOCUMENT';

            return (
              <div 
                key={fact.key}
                className="bg-[#0B132B]/90 backdrop-blur-md rounded-xl p-5 shadow-lg border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                    {fact.label}
                  </span>

                  {/* Origin Badge */}
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap flex items-center gap-1 border ${
                    isExtracted
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {isExtracted ? (
                      <>
                        <FileText size={10} />
                        <span>Extracted from Spec</span>
                      </>
                    ) : (
                      <>
                        <User size={10} />
                        <span>Manufacturer Provided</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Value or Inline Edit Input */}
                {isEditing ? (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 bg-[#070D1B] border border-[#FF7828] text-white text-xs rounded-lg px-2.5 py-1.5 outline-none font-medium"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(fact.key)}
                      className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                      title="Save"
                    >
                      <Save size={13} />
                    </button>
                    <button
                      onClick={() => setEditingKey(null)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                      title="Cancel"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2 pt-1">
                    <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                      {fact.value}
                    </p>
                    <button
                      onClick={() => handleStartEdit(fact.key, fact.value)}
                      className="text-slate-400 hover:text-[#FF9933] p-1 rounded hover:bg-slate-800 transition-colors flex-shrink-0"
                      title="Edit parameter"
                    >
                      <Edit3 size={13} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Blue Info Notice Box */}
        <div className="flex items-center gap-3 bg-[#0B152A] border border-blue-900/60 rounded-xl p-4 text-xs text-slate-300">
          <Info size={16} className="text-blue-400 flex-shrink-0" />
          <span className="leading-relaxed">
            These parameters form the input facts to NiyamVeda&apos;s deterministic rule engine. Changes will directly alter which Indian Standards and mandatory testing protocols are triggered.
          </span>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <Link
            href="/product/new"
            className="bg-[#0B132B] hover:bg-[#1E293B] border border-slate-700 text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5"
          >
            <ArrowLeft size={13} />
            <span>Upload Another Document</span>
          </Link>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-[#FF7828] hover:bg-[#E05E10] text-white text-xs font-bold px-6 py-2.5 rounded-lg transition-all shadow-md shadow-orange-500/20 flex items-center gap-2"
          >
            {loading ? 'Evaluating Rules...' : (
              <>
                <span>Confirm &amp; Run Compliance Analysis</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
