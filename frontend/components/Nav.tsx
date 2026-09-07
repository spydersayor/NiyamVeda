'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ArrowRight, Sun, Moon, Globe, Sparkles, User as UserIcon,
  Menu, X, LogOut, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { useTranslation } from '@/lib/i18n-context';
import type { SupportedLanguage } from '@/lib/translations';

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#070D1B]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between gap-2">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 min-w-0 flex-shrink-0">
          <div className="w-6 h-6 flex items-center justify-center text-[#FF7828] flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#FF7828"/>
              <circle cx="12" cy="12" r="3" fill="#FFFFFF"/>
            </svg>
          </div>
          <div className="leading-none truncate">
            <span className="text-sm font-bold text-white tracking-tight">
              NiyamVeda <span className="text-[#FF9933] font-normal text-xs sm:text-sm">(नियमवेद)</span>
            </span>
            <span className="text-[10px] text-slate-400 block font-normal mt-0.5 truncate hidden xs:block">
              {t('nav_tagline')}
            </span>
          </div>
        </Link>

        {/* Center Nav Links - Desktop */}
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
          <button 
            type="button"
            onClick={() => router.push(user ? '/assistant' : '/auth?next=/assistant')}
            className={`transition-colors flex items-center gap-1.5 ${
              pathname === '/assistant' 
                ? 'text-[#FF9933] font-semibold' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles size={13} className="text-[#FF7828]" />
            <span>{t('nav_assistant')}</span>
          </button>
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
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          
          {/* Language Selector Dropdown - Desktop & Tablet */}
          <div className="hidden sm:flex relative items-center bg-[#0B1426] border border-slate-700/80 rounded-md px-2 py-1 text-xs">
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
            className="w-8 h-8 rounded-md bg-[#0B1426] border border-slate-700/80 hover:border-slate-500 flex items-center justify-center text-slate-300 hover:text-[#FF9933] transition-colors flex-shrink-0"
          >
            {theme === 'dark' ? (
              <Sun size={15} className="text-amber-400" />
            ) : (
              <Moon size={15} className="text-blue-500" />
            )}
          </button>

          {/* Desktop Auth Links */}
          {user ? (
            <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
              <Link 
                href="/profile" 
                className="flex items-center gap-1.5 bg-[#0B1426] border border-slate-700 hover:border-[#FF7828] rounded-md px-2.5 py-1.5 text-[11px] text-slate-300 transition-colors"
                title={t('nav_profile_tooltip')}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-semibold text-white max-w-[100px] truncate">{user.username || user.full_name?.split(' ')[0] || 'User'}</span>
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

          {/* CTA Button */}
          <button 
            type="button"
            onClick={() => router.push(user ? '/product/new' : '/auth?next=/product/new')}
            className="hidden xs:flex bg-[#FF7828] hover:bg-[#E05E10] text-white font-bold text-xs px-2.5 sm:px-4 py-2 rounded-md transition-all shadow-md shadow-orange-500/20 items-center gap-1.5 flex-shrink-0"
          >
            <span className="hidden sm:inline">{t('nav_start_analysis')}</span>
            <span className="sm:hidden">{t('nav_start')}</span>
            <ArrowRight size={13} />
          </button>

          {/* Mobile Hamburger Toggle Button (< md) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-md bg-[#0B1426] border border-slate-700/80 hover:border-slate-500 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu (< md) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070D1B] border-b border-slate-800 px-4 py-4 space-y-4 animate-slide-up shadow-2xl">
          
          {/* Mobile Nav Links */}
          <div className="flex flex-col space-y-1 text-sm font-medium">
            <Link 
              href="/how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                pathname === '/how-it-works' 
                  ? 'bg-[#1E293B] text-[#FF9933] font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>{t('nav_how_it_works')}</span>
              <ArrowRight size={14} className="text-slate-500" />
            </Link>

            <Link 
              href="/sources" 
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                pathname === '/sources' 
                  ? 'bg-[#1E293B] text-[#FF9933] font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>{t('nav_sources')}</span>
              <ArrowRight size={14} className="text-slate-500" />
            </Link>

            <button 
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                router.push(user ? '/assistant' : '/auth?next=/assistant');
              }}
              className={`w-full px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                pathname === '/assistant' 
                  ? 'bg-[#1E293B] text-[#FF9933] font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[#FF7828]" />
                <span>{t('nav_assistant')}</span>
              </div>
              <ArrowRight size={14} className="text-slate-500" />
            </button>

            <Link 
              href="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                pathname === '/about' 
                  ? 'bg-[#1E293B] text-[#FF9933] font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>{t('nav_about_us')}</span>
              <ArrowRight size={14} className="text-slate-500" />
            </Link>
          </div>

          {/* Mobile Language Selector & Controls Row */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center bg-[#0B1426] border border-slate-700 rounded-lg px-3 py-1.5 text-xs flex-1">
              <Globe size={14} className="text-[#FF9933] mr-2 flex-shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                aria-label={t('language_selector')}
                className="bg-transparent text-xs font-semibold text-slate-200 outline-none cursor-pointer w-full"
              >
                <option value="en" className="bg-[#0B1426] text-white">English</option>
                <option value="hi" className="bg-[#0B1426] text-white">हिन्दी</option>
                <option value="bn" className="bg-[#0B1426] text-white">বাংলা</option>
              </select>
            </div>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1426] border border-slate-700 text-xs font-semibold text-slate-300"
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={14} className="text-amber-400" />
                  <span>{t('theme_toggle_light')}</span>
                </>
              ) : (
                <>
                  <Moon size={14} className="text-blue-500" />
                  <span>{t('theme_toggle_dark')}</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Auth & CTA Buttons */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between bg-[#0B1426] border border-slate-700 hover:border-[#FF7828] rounded-lg px-3.5 py-2.5 text-xs text-slate-200"
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span className="font-bold text-white truncate">{user.username || user.full_name || 'User'}</span>
                    <span className="text-slate-400 text-[11px] truncate">({user.company_name})</span>
                  </div>
                  <span className="text-[11px] text-[#FF9933] font-semibold flex-shrink-0">{t('nav_profile_tooltip')}</span>
                </Link>

                <button
                  onClick={async () => {
                    await logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center text-xs text-slate-400 hover:text-red-400 py-2 transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogOut size={13} />
                  <span>{t('nav_sign_out')}</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block text-center py-2.5 px-4 rounded-lg bg-[#0B1426] hover:bg-[#121E36] border border-slate-700 text-slate-200 text-xs font-bold transition-colors"
              >
                {t('nav_sign_in')}
              </Link>
            )}

            <button 
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                router.push(user ? '/product/new' : '/auth?next=/product/new');
              }}
              className="w-full bg-[#FF7828] hover:bg-[#E05E10] text-white font-bold text-xs py-3 px-4 rounded-lg transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              <span>{t('nav_start_analysis')}</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      )}
    </nav>
  );
}

