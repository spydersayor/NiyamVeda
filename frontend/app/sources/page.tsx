'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Database, ShieldCheck, ExternalLink, ArrowLeft, 
  Search, BookOpen, AlertCircle 
} from 'lucide-react';
import { api, type SourceRegistryItem } from '@/lib/api';

import { useTranslation } from '@/lib/i18n-context';

export default function GlobalSourcesDirectoryPage() {
  const { t } = useTranslation();
  const [sources, setSources] = useState<SourceRegistryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listSources()
      .then(setSources)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredSources = sources.filter(s => 
    s.document_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.source_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.authority.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.applicable_domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen portal-bg py-8 sm:py-10 px-4 sm:px-6 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-slide-up">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 flex items-center gap-1">
            <ArrowLeft size={12} /> {t('common_home')}
          </Link>
          <span>/</span>
          <span className="text-[#FF9933]">{t('sources_title')}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#FF7828]/20 flex items-center justify-center text-[#FF7828]">
                <Database size={20} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white break-words">{t('sources_title')}</h1>
            </div>
            <p className="text-slate-400 text-sm max-w-2xl">
              {t('sources_subtitle')}
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder={t('sources_search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 text-xs py-2.5"
            />
          </div>
        </div>

        {loading ? (
          <div className="card py-16 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-[#FF7828]/30 border-t-[#FF7828] rounded-full animate-spin mx-auto mb-3" />
            {t('sources_loading')}
          </div>
        ) : filteredSources.length === 0 ? (
          <div className="card py-16 text-center text-slate-400">
            {t('sources_no_results')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredSources.map((source) => (
              <div
                key={source.source_id}
                className="card hover:border-[#2A3F5F] transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold text-[#FF9933] bg-[#FF7828]/10 px-2.5 py-1 rounded-md border border-[#FF7828]/20">
                      {source.source_id}
                    </span>
                    <span className="badge-verified text-[10px]">
                      <ShieldCheck size={11} /> {source.verification_status.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight break-words">
                      {source.document_name}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 break-words">
                      {source.authority} · <span className="text-slate-300 font-semibold">{source.document_type}</span>
                    </p>
                  </div>

                  <div className="bg-[#060C1A] border border-[#1E293B] rounded-lg p-3 text-xs text-slate-300 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block">
                      {t('sources_scope')}
                    </span>
                    <p className="break-words">{source.applicable_domain}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#1E293B] text-xs">
                  <span className="text-slate-500 text-[11px]">
                    {t('sources_effective')} <strong className="text-slate-400">{source.effective_date || t('sources_enforced')}</strong>
                  </span>
                  <a
                    href={source.official_url || 'https://standardsbis.bsbedge.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#FF7828] hover:text-[#FF9933] font-semibold flex items-center gap-1 flex-shrink-0"
                  >
                    {t('sources_portal_link')} <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
