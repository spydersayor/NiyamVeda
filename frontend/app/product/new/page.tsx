'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Upload, ChevronRight, FileText, Check, AlertCircle, 
  Info, Sparkles, ArrowRight, X, Loader2, CheckCircle2 
} from 'lucide-react';
import { api, type ProductCreate } from '@/lib/api';
import { useTranslation } from '@/lib/i18n-context';

const STEPS = [
  { num: 1, key: 'product_new_step_1' },
  { num: 2, key: 'product_new_step_2' },
  { num: 3, key: 'product_new_step_3' },
  { num: 4, key: 'product_new_step_4' },
  { num: 5, key: 'product_new_step_5' },
] as const;

interface UploadedFileItem {
  id: string;
  filename: string;
  size_kb: number;
  uploading?: boolean;
}

export default function ProductInputPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [extractedNotice, setExtractedNotice] = useState<string | null>(null);
  const [extractedFacts, setExtractedFacts] = useState<Record<string, any> | null>(null);
  const [factVerified, setFactVerified] = useState(false);

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

        if (res.extracted_facts && Object.keys(res.extracted_facts).length > 0) {
          const ef = res.extracted_facts;
          setExtractedFacts(ef);
          setFactVerified(false);
          setForm(prev => ({
            ...prev,
            operating_voltage: ef.operating_voltage || prev.operating_voltage,
            power_consumption: ef.power_consumption || prev.power_consumption,
            water_storage_capacity: ef.water_storage_capacity || prev.water_storage_capacity,
            material_composition: ef.material_composition || prev.material_composition,
            intended_use: ef.intended_use || prev.intended_use,
            category: ef.category || prev.category,
          }));
          setExtractedNotice(`Document "${res.filename}" processed. Please verify extracted parameters below.`);
        }
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
                  {t(step.key as any)}
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
          {extractedNotice && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center justify-between gap-3 shadow-sm animate-slide-in">
              <div className="flex items-center gap-2">
                <span className="font-bold">✓ PDF Parameters Extracted:</span>
                <span>{extractedNotice}</span>
              </div>
              <button 
                type="button" 
                onClick={() => setExtractedNotice(null)}
                className="text-emerald-700 hover:text-emerald-900 font-bold text-sm"
              >
                &times;
              </button>
            </div>
          )}
          <form onSubmit={handleContinue}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Product Definition (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
                  {t('product_new_title')}
                </h2>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('product_new_name_label')} <span className="text-red-500">*</span>
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
                    {t('product_new_cat_label')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => set('category', e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-slate-300 rounded-md px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#FF7828] focus:bg-white transition-all"
                  >
                    <option value="Household Electrical Appliances (Water Filters)">
                      {t('product_new_cat_household')}
                    </option>
                    <option value="Electronics & IT Goods">{t('product_new_cat_electronics')}</option>
                    <option value="Food Contact Plastic Apparatus">{t('product_new_cat_plastic')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('product_new_use_label')} <span className="text-red-500">*</span>
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
                    {t('product_new_mat_label')}
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
                    {t('product_new_tech_label')}
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
                    {t('product_new_docs_title')} <span className="text-slate-400 font-normal">({t('product_new_docs_optional')})</span>
                  </h3>
                  {uploadedFiles.length > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300">
                      {uploadedFiles.length} {uploadedFiles.length === 1 ? t('product_new_docs_file') : t('product_new_docs_files')} {t('product_new_docs_attached')}
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
                    {t('product_new_upload_drag')}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {t('product_new_upload_hint')}
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
                              {file.uploading ? t('product_new_uploading') : `${file.size_kb} KB • ${t('product_new_verified')}`}
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
                          title={t('product_new_remove_file')}
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
                    {t('product_new_disclaimer')}
                  </span>
                </div>
              </div>

            </div>

            {/* ─── PDF Fact Verification Review Panel (UX Requirement 4) ─── */}
            {extractedFacts && (
              <div className="mt-6 bg-amber-50 border-2 border-amber-400/90 rounded-xl p-5 sm:p-6 space-y-4 animate-slide-up shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-3">
                  <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                    <CheckCircle2 size={19} className="text-amber-600 flex-shrink-0" />
                    <span>{t('product_new_pdf_verify_title')}</span>
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-amber-200/90 text-amber-900 uppercase tracking-wide w-fit">
                    {t('product_new_pdf_extracted_badge')}
                  </span>
                </div>

                <div className="p-3 bg-white/90 border border-amber-300 rounded-lg text-xs font-semibold text-amber-950 leading-relaxed">
                  {t('product_new_pdf_verify_notice')}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">{t('product_new_voltage_label')}</label>
                    <input
                      type="text"
                      value={form.operating_voltage || ''}
                      onChange={(e) => set('operating_voltage', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">{t('product_new_power_label')}</label>
                    <input
                      type="text"
                      value={form.power_consumption || ''}
                      onChange={(e) => set('power_consumption', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">{t('product_new_capacity_label')}</label>
                    <input
                      type="text"
                      value={form.water_storage_capacity || ''}
                      onChange={(e) => set('water_storage_capacity', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="font-bold text-slate-800 block mb-1">{t('product_new_material_label')}</label>
                    <input
                      type="text"
                      value={form.material_composition || ''}
                      onChange={(e) => set('material_composition', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="font-bold text-slate-800 block mb-1">{t('product_new_use_label')}</label>
                    <input
                      type="text"
                      value={form.intended_use || ''}
                      onChange={(e) => set('intended_use', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFactVerified(true);
                      setExtractedFacts(null);
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-2.5 rounded-md shadow-md flex items-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    <Check size={15} /> {t('product_new_btn_confirm_facts')}
                  </button>
                </div>
              </div>
            )}

            {factVerified && (
              <div className="mt-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl p-4 text-xs flex items-center gap-3 animate-fade-in shadow-sm">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                <span className="font-semibold">
                  {t('product_new_verified_success')}
                </span>
              </div>
            )}

            {/* ─── Bottom Actions Bar (Screen 2 Bottom) ─── */}
            <div className="flex items-center justify-between border-t border-slate-200 mt-8 pt-5">
              <button
                type="button"
                onClick={() => router.push('/product/demo-purifier-001/confirm')}
                className="bg-[#0B132B] hover:bg-[#1E293B] text-slate-200 text-xs font-semibold px-5 py-2.5 rounded-md transition-all"
              >
                {t('product_new_btn_save_draft')}
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-[#FF7828] hover:bg-[#E05E10] text-white text-xs font-bold px-6 py-2.5 rounded-md transition-all shadow-md shadow-orange-500/20 flex items-center gap-2"
              >
                {loading ? 'Processing...' : (
                  <>
                    {t('product_new_btn_continue')} <ArrowRight size={14} />
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
