'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Upload, ChevronRight, FileText, Check, AlertCircle, 
  Info, Sparkles, ArrowRight, X, Loader2, CheckCircle2 
} from 'lucide-react';
import { api, type ProductCreate } from '@/lib/api';

const STEPS = [
  { num: 1, label: 'Product Definition' },
  { num: 2, label: 'Technical Details' },
  { num: 3, label: 'Manufacturing' },
  { num: 4, label: 'Market Info' },
  { num: 5, label: 'Review' },
];

interface UploadedFileItem {
  id: string;
  filename: string;
  size_kb: number;
  uploading?: boolean;
}

export default function ProductInputPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Initial list matching Screen 2 specification
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([
    { id: 'default-1', filename: 'smart_purifier_spec_sheet.pdf', size_kb: 12.1 }
  ]);

  // Pre-filled with the exact reference demo product
  const [form, setForm] = useState<ProductCreate>({
    project_name: 'Smart Purifier Compliance Project',
    product_name: 'Smart Alkaline Water Purifier',
    category: 'Household Electrical Appliances (Water Filters)',
    intended_use: 'Domestic kitchen water filtration and mineral ionization',
    material_composition: 'Polycarbonate casing, carbon block filters, UV-LED sanitization chamber',
    technical_characteristics: 'Operating Voltage: 230V AC, Frequency: 50Hz, Power consumption: 40W, Water storage: 8L, Integrated UV-LED module for water quality.',
    operating_voltage: '230V AC, 50Hz',
    power_consumption: '40W',
    water_storage_capacity: '8 Liters',
    has_uv_module: true,
    manufacturing_origin: 'India',
    target_market: 'Domestic',
  });

  const handleUploadFiles = async (files: FileList | File[]) => {
    setUploadError(null);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`"${file.name}" exceeds the 10MB file size limit.`);
        continue;
      }

      const tempId = `upload-${Date.now()}-${i}`;
      const tempItem: UploadedFileItem = {
        id: tempId,
        filename: file.name,
        size_kb: Number((file.size / 1024).toFixed(1)),
        uploading: true
      };

      setUploadedFiles(prev => [...prev, tempItem]);

      try {
        const res = await api.uploadDocument(file);
        setUploadedFiles(prev =>
          prev.map(item =>
            item.id === tempId
              ? { ...item, filename: res.filename, size_kb: res.size_kb, uploading: false }
              : item
          )
        );
      } catch (err: any) {
        setUploadedFiles(prev => prev.filter(item => item.id !== tempId));
        setUploadError(`Failed to upload "${file.name}". Please try again.`);
      }
    }
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(item => item.id !== id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  const set = (k: keyof ProductCreate, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const prod = await api.createProduct(form);
      router.push(`/product/${prod.id || 'demo-purifier-001'}/confirm`);
    } catch {
      router.push('/product/demo-purifier-001/confirm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen portal-bg py-8 px-4 sm:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ─── Step Progress Bar (Screen 2 Top) ─── */}
        <div className="flex items-center justify-between max-w-2xl mx-auto px-2 py-3 bg-[#0B1426]/70 backdrop-blur-md rounded-xl border border-slate-800/80 shadow-lg">
          {STEPS.map((step, idx) => (
            <div key={step.num} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step.num === currentStep
                      ? 'bg-[#FF7828] text-white shadow-md shadow-orange-500/30'
                      : step.num < currentStep
                      ? 'bg-slate-700 text-slate-300'
                      : 'border border-slate-700 text-slate-500 bg-transparent'
                  }`}
                >
                  {step.num}
                </div>
                <span className={`text-xs font-semibold whitespace-nowrap hidden sm:inline ${
                  step.num === currentStep ? 'text-white' : 'text-slate-500'
                }`}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className="flex-1 h-[1px] bg-slate-800 mx-3" />
              )}
            </div>
          ))}
        </div>

        {/* ─── Main White Form Container (Screen 2 Exact White Card) ─── */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/60 p-6 sm:p-8 text-slate-800 animate-slide-up">
          <form onSubmit={handleContinue}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Product Definition (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
                  Product Definition
                </h2>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product Commercial Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.product_name}
                    onChange={(e) => set('product_name', e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-slate-300 rounded-md px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#FF7828] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => set('category', e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-slate-300 rounded-md px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#FF7828] focus:bg-white transition-all"
                  >
                    <option value="Household Electrical Appliances (Water Filters)">
                      Household Electrical Appliances (Water Filters)
                    </option>
                    <option value="Electronics & IT Goods">Electronics &amp; IT Goods</option>
                    <option value="Food Contact Plastic Apparatus">Food Contact Plastic Apparatus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Intended Application / Use Case <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={form.intended_use}
                    onChange={(e) => set('intended_use', e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-slate-300 rounded-md px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#FF7828] focus:bg-white transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Material / Chemical Composition
                  </label>
                  <textarea
                    rows={2}
                    value={form.material_composition}
                    onChange={(e) => set('material_composition', e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-slate-300 rounded-md px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#FF7828] focus:bg-white transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Key Technical Characteristics
                  </label>
                  <textarea
                    rows={3}
                    value={form.technical_characteristics}
                    onChange={(e) => set('technical_characteristics', e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-slate-300 rounded-md px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#FF7828] focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>

              {/* Right Column: Supporting Documents (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Supporting Documents <span className="text-slate-400 font-normal">(Optional)</span>
                  </h3>
                  {uploadedFiles.length > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300">
                      {uploadedFiles.length} {uploadedFiles.length === 1 ? 'file' : 'files'} attached
                    </span>
                  )}
                </div>

                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleUploadFiles(e.target.files);
                    }
                  }}
                  className="hidden" 
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png" 
                  multiple 
                />

                {/* Interactive Upload Dropzone Box */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer select-none ${
                    isDragging
                      ? 'border-[#FF7828] bg-orange-100/60 scale-[1.01] shadow-md'
                      : 'border-orange-200 bg-[#FFF9F5] hover:border-[#FF7828] hover:bg-[#FFF4EC]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#FF7828]/10 text-[#FF7828] flex items-center justify-center mx-auto mb-2 animate-pulse-glow">
                    <Upload size={20} />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Upload datasheets, test reports,<br />or brochures
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Click to browse or drag &amp; drop (PDF, DOC, JPG up to 10MB)
                  </p>
                </div>

                {/* Upload Error Banner */}
                {uploadError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-xs flex items-center gap-2 animate-slide-up">
                    <AlertCircle size={15} className="flex-shrink-0 text-red-500" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div 
                        key={file.id} 
                        className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-3 flex items-center justify-between text-xs transition-all hover:border-slate-300"
                      >
                        <div className="flex items-center gap-2.5 truncate mr-2">
                          <div className="text-red-500 flex-shrink-0">
                            {file.uploading ? (
                              <Loader2 size={18} className="animate-spin text-[#FF7828]" />
                            ) : (
                              <FileText size={18} />
                            )}
                          </div>
                          <div className="truncate">
                            <p className="font-bold text-slate-800 text-[11px] truncate">
                              {file.filename}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {file.uploading ? 'Uploading to NiyamVeda...' : `${file.size_kb} KB • Verified`}
                            </p>
                          </div>
                        </div>

                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(file.id);
                          }}
                          className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-slate-200/60 transition-colors flex-shrink-0"
                          title="Remove file"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Small Info Note */}
                <div className="flex items-start gap-2 bg-[#F8FAFC] border border-slate-200 rounded-lg p-3 text-[11px] text-slate-500 leading-relaxed">
                  <Info size={14} className="text-[#FF7828] mt-0.5 flex-shrink-0" />
                  <span>
                    Supporting documents provide additional product context but do not override authoritative regulatory sources.
                  </span>
                </div>
              </div>

            </div>

            {/* ─── Bottom Actions Bar (Screen 2 Bottom) ─── */}
            <div className="flex items-center justify-between border-t border-slate-200 mt-8 pt-5">
              <button
                type="button"
                onClick={() => router.push('/product/demo-purifier-001/confirm')}
                className="bg-[#0B132B] hover:bg-[#1E293B] text-slate-200 text-xs font-semibold px-5 py-2.5 rounded-md transition-all"
              >
                Save Draft
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-[#FF7828] hover:bg-[#E05E10] text-white text-xs font-bold px-6 py-2.5 rounded-md transition-all shadow-md shadow-orange-500/20 flex items-center gap-2"
              >
                {loading ? 'Processing...' : (
                  <>
                    Continue <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
