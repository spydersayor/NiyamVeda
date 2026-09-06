'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Sun, Moon, Globe, Sparkles, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { useTranslation } from '@/lib/i18n-context';
import type { SupportedLanguage } from '@/lib/translations';

export default function Nav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#070D1B]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-6 h-6 flex items-center justify-center text-[#FF7828]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#FF7828"/>
              <circle cx="12" cy="12" r="3" fill="#FFFFFF"/>
            </svg>
          </div>
          <div className="leading-none">
            <span className="text-sm font-bold text-white tracking-tight">
              NiyamVeda <span className="text-[#FF9933] font-normal">(नियमवेद)</span>
            </span>
            <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
              {t('nav_tagline')}
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium">
          <Link 
            href="/how-it-works" 
            className={`transition-colors ${
              pathname === '/how-it-works' 
                ? 'text-[#FF9933] font-semibold' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {t('nav_how_it_works')}
          </Link>
          <Link 
            href="/sources" 
            className={`transition-colors ${
              pathname === '/sources' 
                ? 'text-[#FF9933] font-semibold' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {t('nav_sources')}
          </Link>
          <Link 
            href="/assistant" 
            className={`transition-colors flex items-center gap-1.5 ${
              pathname === '/assistant' 
                ? 'text-[#FF9933] font-semibold' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles size={13} className="text-[#FF7828]" />
            <span>{t('nav_assistant')}</span>
          </Link>
          <Link 
            href="/about" 
            className={`transition-colors ${
              pathname === '/about' 
                ? 'text-[#FF9933] font-semibold' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {t('nav_about_us')}
          </Link>
        </div>

        {/* Right CTA, Language Switcher, Theme Toggle & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Language Selector Dropdown */}
          <div className="relative flex items-center bg-[#0B1426] border border-slate-700/80 rounded-md px-2 py-1 text-xs">
            <Globe size={13} className="text-[#FF9933] mr-1.5 flex-shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              aria-label={t('language_selector')}
              className="bg-transparent text-[11px] font-semibold text-slate-200 outline-none cursor-pointer pr-1"
            >
              <option value="en" className="bg-[#0B1426] text-white">English</option>
              <option value="hi" className="bg-[#0B1426] text-white">हिन्दी</option>
              <option value="bn" className="bg-[#0B1426] text-white">বাংলা</option>
            </select>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? t('theme_toggle_light') : t('theme_toggle_dark')}
            aria-label={t('theme_toggle_aria')}
            className="w-8 h-8 rounded-md bg-[#0B1426] border border-slate-700/80 hover:border-slate-500 flex items-center justify-center text-slate-300 hover:text-[#FF9933] transition-colors"
          >
            {theme === 'dark' ? (
              <Sun size={15} className="text-amber-400" />
            ) : (
              <Moon size={15} className="text-blue-500" />
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link 
                href="/profile" 
                className="hidden sm:flex items-center gap-1.5 bg-[#0B1426] border border-slate-700 hover:border-[#FF7828] rounded-md px-2.5 py-1.5 text-[11px] text-slate-300 transition-colors"
                title={t('nav_profile_tooltip')}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-semibold text-white max-w-[90px] truncate">{user.full_name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={async () => { await logout(); }}
                title={t('nav_sign_out')}
                className="text-[11px] text-slate-400 hover:text-red-400 px-1.5 py-1 transition-colors"
              >
                {t('nav_sign_out')}
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="text-xs font-semibold text-slate-300 hover:text-white px-2 py-1.5 rounded-md hover:bg-slate-800/60 transition-colors hidden sm:inline-block"
            >
              {t('nav_sign_in')}
            </Link>
          )}

          <Link 
            href="/product/new" 
            className="bg-[#FF7828] hover:bg-[#E05E10] text-white font-bold text-xs px-3 sm:px-4 py-2 rounded-md transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5"
          >
            <span className="hidden sm:inline">{t('nav_start_analysis')}</span>
            <span className="sm:hidden">{t('nav_start')}</span>
            <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </nav>
  );
}
