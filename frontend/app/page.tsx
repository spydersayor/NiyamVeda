'use client';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, ShieldCheck, Scale, FileSearch, 
  Milestone, Play, Shield, Users, Check, Box,
  FileCheck2, Gavel
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n-context';

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="landing-page min-h-screen bg-[#070D1B] text-white relative overflow-hidden font-sans">
      
      {/* Subtle Ambient Background Gradients */}
      <div className="landing-ambient-orange absolute top-0 right-0 w-[550px] h-[550px] bg-[#FF7828]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="landing-ambient-blue absolute top-40 left-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="landing-ambient-emerald absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Background Artwork */}
      <div className="landing-hero-art absolute top-0 right-0 left-0 h-[860px] pointer-events-none select-none z-0 overflow-hidden">
        <Image
          src="/images/landing_hero_bg.jpg"
          alt="NiyamVeda Indian Heritage & BIS Compliance"
          fill
          priority
          className="landing-hero-image object-cover object-right md:object-center opacity-90"
          sizes="100vw"
        />
        {/* Soft edge & readability gradients */}
        <div className="landing-hero-overlay-v absolute inset-0 bg-gradient-to-b from-[#070D1B]/50 via-[#070D1B]/20 to-[#070D1B]" />
        <div className="landing-hero-overlay-h absolute inset-0 bg-gradient-to-r from-[#070D1B] via-[#070D1B]/75 to-transparent w-full lg:w-3/5" />
      </div>

      {/* ─── Hero Section ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 md:px-10 pt-8 sm:pt-12 pb-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* Left Hero Content (7 cols) */}
          <div className="lg:col-span-7 space-y-5 animate-slide-up">
            
            {/* Top Pill Tag */}
            <div className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#0C1B36]/90 border border-[#1E355B] text-[11px] sm:text-xs font-semibold text-slate-300 shadow-sm backdrop-blur-md">
              <ShieldCheck size={14} className="text-blue-400 flex-shrink-0" />
              <span>{t('hero_badge_ai')}</span>
              <span className="text-slate-600 font-bold">•</span>
              <span>{t('hero_badge_rule')}</span>
              <span className="text-slate-600 font-bold">•</span>
              <span>{t('hero_badge_source')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold leading-[1.15] tracking-tight text-white drop-shadow-sm break-words">
              {t('hero_title_prefix')}<br className="hidden sm:inline" />{' '}
              {t('hero_title_middle')}<br className="hidden sm:inline" />{' '}
              <span className="text-[#FF7828]">BIS</span> {t('hero_title_suffix')}
            </h1>

            {/* Subtext */}
            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg font-normal drop-shadow-sm">
              {t('hero_subtext')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              <Link 
                href="/product/new"
                className="bg-[#FF7828] hover:bg-[#E05E10] text-white font-bold text-sm px-6 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{t('btn_analyse_product')}</span> <ArrowRight size={16} />
              </Link>
              
              <Link 
                href="/how-it-works"
                className="border border-[#1E355B] hover:border-slate-500 bg-[#0C172E]/90 hover:bg-[#12203F] text-slate-200 font-semibold text-sm px-5 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
              >
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[#FF9933]">
                  <Play size={10} fill="#FF9933" />
                </div>
                <span>{t('btn_explore_how_it_works')}</span>
              </Link>
            </div>

            {/* Mobile MSME Pill */}
            <div className="lg:hidden pt-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0A1224]/80 border border-emerald-500/40 text-[11px] font-bold text-emerald-400 shadow-sm backdrop-blur-md">
                <Check size={13} className="text-emerald-400 stroke-[3]" />
                <span>{t('badge_msme')}</span>
              </div>
            </div>

          </div>

          {/* Right Hero Space: Unobstructed view of India Gate from background with MSME Badge */}
          <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-end items-end h-[340px] pointer-events-none">
            <div className="pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A1224]/85 border border-emerald-500/40 text-xs font-bold text-emerald-400 shadow-xl backdrop-blur-md">
                <Check size={14} className="text-emerald-400 stroke-[3]" />
                <span>{t('badge_msme')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ─── NiyamVeda Works in 4 Simple Steps (Exact to Image 2) ─── */}
        <div className="mt-12 pt-6">
          
          {/* Section Divider Line with Dots (Image 2) */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6">
            <div className="h-[1px] bg-slate-800 w-8 sm:w-24 md:w-36 flex-1 max-w-[140px]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF7828] flex-shrink-0" />
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] sm:tracking-[0.22em] text-slate-300 text-center">
              {t('steps_heading')}
            </p>
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF7828] flex-shrink-0" />
            <div className="h-[1px] bg-slate-800 w-8 sm:w-24 md:w-36 flex-1 max-w-[140px]" />
          </div>

          {/* 4 Connected Step Cards (Image 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            
            {/* Step 1 */}
            <div className="relative group bg-[#0A1224] border border-slate-800/90 hover:border-orange-500/40 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-md flex flex-col justify-between min-h-[140px]">
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 rounded-full bg-[#102242] border border-[#1E3865] flex items-center justify-center text-blue-300 text-xs font-bold">
                  1
                </div>
                <div className="text-[#FF7828]">
                  <Box size={24} strokeWidth={1.75} />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-[#FF9933] transition-colors">
                  {t('step_1_title')}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {t('step_1_desc')}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group bg-[#0A1224] border border-slate-800/90 hover:border-orange-500/40 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-md flex flex-col justify-between min-h-[140px]">
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 rounded-full bg-[#102242] border border-[#1E3865] flex items-center justify-center text-blue-300 text-xs font-bold">
                  2
                </div>
                <div className="text-[#FF7828]">
                  <Scale size={24} strokeWidth={1.75} />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-[#FF9933] transition-colors">
                  {t('step_2_title')}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {t('step_2_desc')}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group bg-[#0A1224] border border-slate-800/90 hover:border-orange-500/40 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-md flex flex-col justify-between min-h-[140px]">
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 rounded-full bg-[#102242] border border-[#1E3865] flex items-center justify-center text-blue-300 text-xs font-bold">
                  3
                </div>
                <div className="text-[#FF7828]">
                  <FileSearch size={24} strokeWidth={1.75} />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-[#FF9933] transition-colors">
                  {t('step_3_title')}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {t('step_3_desc')}
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative group bg-[#0A1224] border border-slate-800/90 hover:border-orange-500/40 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-md flex flex-col justify-between min-h-[140px]">
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 rounded-full bg-[#102242] border border-[#1E3865] flex items-center justify-center text-blue-300 text-xs font-bold">
                  4
                </div>
                <div className="text-[#FF7828]">
                  <Milestone size={24} strokeWidth={1.75} />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-[#FF9933] transition-colors">
                  {t('step_4_title')}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {t('step_4_desc')}
                </p>
              </div>
            </div>

          </div>

          {/* Explore How It Works Button */}
          <div className="flex justify-center mt-6">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 bg-[#0C172E] hover:bg-[#12203F] border border-orange-500/30 hover:border-orange-500/60 text-[#FF9933] hover:text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-all shadow-md group"
            >
              <span>{t('btn_explore_how_it_works')}</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ─── Bottom Unified Bar: 4 Badges (Exact to Image 2) ─── */}
        <div className="mt-8">
          <div className="bg-[#0A1224] border border-slate-800/90 rounded-xl p-4 sm:px-6 sm:py-4 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:divide-x divide-slate-800/80 shadow-md">
            
            {/* Badge 1: Evidence Driven */}
            <div className="flex items-center justify-center gap-2 sm:gap-2.5">
              <div className="text-[#FF7828] flex-shrink-0">
                <ShieldCheck size={18} />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-200 text-center sm:text-left">{t('badge_evidence')}</span>
            </div>

            {/* Badge 2: Source Traceable */}
            <div className="flex items-center justify-center gap-2 sm:gap-2.5 md:pl-4">
              <div className="text-[#FF7828] flex-shrink-0">
                <FileCheck2 size={18} />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-200 text-center sm:text-left">{t('badge_source_traceable')}</span>
            </div>

            {/* Badge 3: Rule Based */}
            <div className="flex items-center justify-center gap-2 sm:gap-2.5 md:pl-4">
              <div className="text-[#FF7828] flex-shrink-0">
                <Gavel size={18} />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-200 text-center sm:text-left">{t('badge_rule_based')}</span>
            </div>

            {/* Badge 4: MSME Friendly */}
            <div className="flex items-center justify-center gap-2 sm:gap-2.5 md:pl-4">
              <div className="text-[#FF7828] flex-shrink-0">
                <Users size={18} />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-200 text-center sm:text-left">{t('badge_msme_friendly')}</span>
            </div>

          </div>
        </div>

      </section>
    </div>
  );
}
