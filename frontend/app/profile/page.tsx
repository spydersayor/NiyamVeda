'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, Building, Mail, Shield, ShieldCheck, 
  Calendar, Layers, ArrowRight, Sun, Moon, 
  Globe, LogOut, PlusCircle, CheckCircle, Clock,
  FileCheck, Sparkles, ExternalLink
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { useTranslation } from '@/lib/i18n-context';
import { api, Product } from '@/lib/api';
import type { SupportedLanguage } from '@/lib/translations';

export default function ProfilePage() {
  const { user, logout, demoLogin } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    async function loadUserProducts() {
      try {
        const prods = await api.listProducts();
        setProducts(prods || []);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoadingProducts(false);
      }
    }
    loadUserProducts();
  }, []);

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-[#0B132B]/80 border border-slate-800 rounded-xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-md">
          <div className="w-14 h-14 bg-[#FF7828]/10 text-[#FF7828] border border-[#FF7828]/30 rounded-2xl flex items-center justify-center mx-auto">
            <User size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{t('profile_auth_required_title')}</h2>
            <p className="text-xs text-slate-400 mt-2">
              {t('profile_auth_required_desc')}
            </p>
          </div>
          <div className="space-y-3">
            <Link
              href="/auth"
              className="block w-full py-2.5 px-4 bg-[#FF7828] hover:bg-[#E05E10] text-white text-xs font-bold rounded-lg transition-colors shadow-md"
            >
              {t('profile_btn_signin')}
            </Link>
            <button
              onClick={demoLogin}
              className="w-full py-2.5 px-4 bg-[#070D1B] hover:bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span>{t('profile_btn_demo')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const registeredDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString(language === 'bn' ? 'bn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : t('profile_active_member');

  return (
    <div className="min-h-screen py-10 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header Profile Summary */}
      <div className="bg-[#0B132B]/85 border border-slate-800/90 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF7828] to-[#FF9933] flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-orange-500/20 flex-shrink-0">
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {user.full_name}
              </h1>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#1E355B] text-amber-300 border border-amber-500/30">
                {user.role || 'MSME_MANUFACTURER'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Building size={13} className="text-[#FF7828]" />
                {user.company_name}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail size={13} className="text-slate-400" />
                {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400" />
                {t('profile_joined')} {registeredDate}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/product/new"
            className="flex items-center gap-2 bg-[#FF7828] hover:bg-[#E05E10] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-md shadow-orange-500/20"
          >
            <PlusCircle size={15} />
            <span>{t('profile_btn_new_project')}</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 bg-[#070D1B] hover:bg-red-950/30 border border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-red-400 text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors"
            title={t('nav_sign_out')}
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">{t('nav_sign_out')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Account Security & Preferences */}
        <div className="space-y-6">
          
          {/* Account Security Card */}
          <div className="bg-[#0B132B]/75 border border-slate-800 rounded-xl p-5 space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800/80 pb-3">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>{t('profile_account_security')}</span>
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#070D1B]/70 border border-slate-800">
                <div className="space-y-0.5">
                  <div className="font-medium text-slate-200">{t('profile_sec_pwd_title')}</div>
                  <div className="text-[11px] text-slate-400">{t('profile_sec_pwd_desc')}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {t('profile_sec_pwd_badge')}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#070D1B]/70 border border-slate-800">
                <div className="space-y-0.5">
                  <div className="font-medium text-slate-200">{t('profile_sec_session_title')}</div>
                  <div className="text-[11px] text-slate-400">{t('profile_sec_session_desc')}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {t('profile_sec_session_badge')}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#070D1B]/70 border border-slate-800">
                <div className="space-y-0.5">
                  <div className="font-medium text-slate-200">{t('profile_sec_token_title')}</div>
                  <div className="text-[11px] text-slate-400">{t('profile_sec_token_desc')}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {t('profile_sec_token_badge')}
                </span>
              </div>
            </div>
          </div>

          {/* Preferences Card */}
          <div className="bg-[#0B132B]/75 border border-slate-800 rounded-xl p-5 space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800/80 pb-3">
              <Globe size={16} className="text-[#FF7828]" />
              <span>{t('profile_preferences')}</span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Language Selection */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {t('profile_pref_lang')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['en', 'hi', 'bn'] as SupportedLanguage[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                        language === lang
                          ? 'bg-[#FF7828] text-white border-[#FF7828] shadow-md shadow-orange-500/20'
                          : 'bg-[#070D1B] text-slate-300 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      {lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी' : 'বাংলা'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Selection */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {t('profile_pref_theme')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                      theme === 'dark'
                        ? 'bg-[#1E293B] text-white border-slate-600 shadow-md'
                        : 'bg-[#070D1B] text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Moon size={14} className="text-blue-400" />
                    <span>{t('profile_theme_dark')}</span>
                  </button>
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                      theme === 'light'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                        : 'bg-[#070D1B] text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Sun size={14} className="text-amber-400" />
                    <span>{t('profile_theme_light')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick AI Assistant Card */}
          <div className="bg-gradient-to-br from-[#0B132B] to-[#122040] border border-[#1E355B] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Sparkles size={16} className="text-[#FF7828]" />
              <span>{t('profile_copilot_title')}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t('profile_copilot_desc')}
            </p>
            <Link
              href="/assistant"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#FF9933] hover:text-[#FF7828] transition-colors"
            >
              <span>{t('profile_copilot_launch')}</span>
              <ArrowRight size={13} />
            </Link>
          </div>

        </div>

        {/* Right Column: Registered Products List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Layers size={18} className="text-[#FF7828]" />
                <span>{t('profile_my_products')}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('profile_products_sub')}
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {products.length} {t('profile_products_count')}
            </span>
          </div>

          {loadingProducts ? (
            <div className="p-8 text-center bg-[#0B132B]/50 border border-slate-800 rounded-xl">
              <div className="w-6 h-6 border-2 border-[#FF7828] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <div className="text-xs text-slate-400">{t('profile_loading_products')}</div>
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center bg-[#0B132B]/50 border border-slate-800 rounded-xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
                <Layers size={24} />
              </div>
              <div className="text-sm font-semibold text-white">{t('profile_no_products_title')}</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {t('profile_no_products_desc')}
              </p>
              <Link
                href="/product/new"
                className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg bg-[#FF7828] text-white hover:bg-[#E05E10] transition-colors"
              >
                <span>{t('profile_add_first_product')}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-[#0B132B]/80 hover:bg-[#0B132B] border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white hover:text-[#FF9933] transition-colors">
                          {prod.product_name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          prod.status === 'CONFIRMED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}>
                          {prod.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {prod.category} • {prod.operating_voltage || t('profile_voltage_na')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/product/${prod.id}/analysis`}
                        className="text-xs font-bold px-3 py-1.5 rounded-md bg-[#1E355B] text-sky-300 hover:bg-[#2A487B] border border-sky-500/30 transition-colors flex items-center gap-1"
                      >
                        <span>{t('profile_btn_analysis')}</span>
                        <ArrowRight size={12} />
                      </Link>
                      <Link
                        href={`/product/${prod.id}/simulation`}
                        className="text-xs font-semibold px-3 py-1.5 rounded-md bg-[#070D1B] text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition-colors"
                      >
                        {t('profile_btn_whatif')}
                      </Link>
                      <Link
                        href={`/assistant?product_id=${prod.id}`}
                        className="text-xs font-semibold px-3 py-1.5 rounded-md bg-orange-950/20 text-[#FF9933] hover:text-[#FF7828] border border-orange-500/30 transition-colors flex items-center gap-1"
                        title={t('profile_chat_tooltip')}
                      >
                        <Sparkles size={12} />
                        <span>{t('profile_btn_chat')}</span>
                      </Link>
                    </div>
                  </div>

                  {/* Fact summary pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60 text-[11px] text-slate-400">
                    <span className="bg-[#070D1B] px-2 py-0.5 rounded border border-slate-800">
                      {t('profile_fact_material')}: <strong className="text-slate-300">{prod.material_composition || 'Standard'}</strong>
                    </span>
                    <span className="bg-[#070D1B] px-2 py-0.5 rounded border border-slate-800">
                      {t('profile_fact_power')}: <strong className="text-slate-300">{prod.power_consumption || 'N/A'}</strong>
                    </span>
                    <span className="bg-[#070D1B] px-2 py-0.5 rounded border border-slate-800">
                      {t('profile_fact_origin')}: <strong className="text-slate-300">{prod.manufacturing_origin || 'India'}</strong>
                    </span>
                    <Link
                      href={`/product/${prod.id}/confirm`}
                      className="text-[11px] text-slate-400 hover:text-slate-200 underline ml-auto"
                    >
                      {t('profile_inspect_facts')} ({prod.facts?.length || 0})
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
