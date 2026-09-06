'use client';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n-context';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-slate-800 bg-[#070D1B] px-6 sm:px-10 py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-lg font-extrabold text-white">
              Niyam<span className="text-[#FF7828]">Veda</span> <span className="text-[#FF9933] font-normal text-sm">(नियमवेद)</span>
            </Link>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60">
              SIH26107 • v1.0.0
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{t('nav_tagline')}</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
          <Link href="/how-it-works" className="hover:text-white transition-colors">{t('nav_how_it_works')}</Link>
          <Link href="/sources" className="hover:text-white transition-colors">{t('nav_sources')}</Link>
          <Link href="/about" className="hover:text-white transition-colors">{t('nav_about_us')}</Link>
          <Link href="/assistant" className="hover:text-white transition-colors">{t('nav_assistant')}</Link>
        </nav>
      </div>
      <div className="max-w-7xl mx-auto mt-6 pt-5 border-t border-slate-800/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-500">
        <p className="text-[11px] leading-relaxed max-w-3xl">{t('footer_disclaimer')}</p>
        <p className="text-[10px] whitespace-nowrap">© {new Date().getFullYear()} NiyamVeda. {t('footer_rights')}</p>
      </div>
    </footer>
  );
}
