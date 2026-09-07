'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FileCheck, BookOpen, ClipboardList,
  AlertTriangle, FlaskConical, Database, Shield, Home, Zap, Sparkles
} from 'lucide-react';

import { useTranslation } from '@/lib/i18n-context';
import type { Translations } from '@/lib/translations';

interface ProductSidebarProps {
  productId: string;
}

const navItems: Array<{
  href: string;
  icon: any;
  key: keyof Translations;
}> = [
  { href: '/product/{id}/confirm',       icon: Home,            key: 'sidebar_product' },
  { href: '/product/{id}/analysis',      icon: LayoutDashboard, key: 'sidebar_analysis' },
  { href: '/product/{id}/why-rule',      icon: Zap,             key: 'sidebar_why_rule' },
  { href: '/product/{id}/rule-inspector',icon: FileCheck,       key: 'sidebar_inspector' },
  { href: '/product/{id}/standards',     icon: BookOpen,        key: 'sidebar_standards' },
  { href: '/product/{id}/requirements',  icon: ClipboardList,   key: 'sidebar_requirements' },
  { href: '/product/{id}/risks',         icon: AlertTriangle,   key: 'sidebar_risks' },
  { href: '/product/{id}/simulation',    icon: FlaskConical,    key: 'sidebar_simulation' },
  { href: '/product/{id}/sources',       icon: Database,        key: 'sidebar_sources' },
  { href: '/product/{id}/abstention',    icon: Shield,          key: 'sidebar_abstention' },
];

export default function ProductSidebar({ productId }: ProductSidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <>
      {/* ─── Mobile / Tablet Sub-Navigation (< lg) ─── */}
      <nav 
        aria-label="Product Navigation"
        className="lg:hidden sticky top-14 z-30 bg-[#060C1A]/95 backdrop-blur-xl border-b border-slate-800/80 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full flex-shrink-0"
      >
        {navItems.map((item) => {
          const href = item.href.replace('{id}', productId);
          const isActive = pathname === href;
          const Icon = item.icon;
          const tipText = t(item.key);
          return (
            <Link
              key={item.href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
                isActive
                  ? 'bg-[#FF7828]/25 text-[#FF7828] border border-[#FF7828]/40 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon size={14} strokeWidth={isActive ? 2.5 : 1.75} />
              <span>{tipText}</span>
            </Link>
          );
        })}
      </nav>

      {/* ─── Desktop Fixed Sidebar (lg:) ─── */}
      <aside className="hidden lg:flex fixed left-0 top-14 bottom-0 w-14 flex-col items-center py-4 gap-1.5 z-40 bg-[#060C1A]/90 backdrop-blur-xl border-r border-slate-800/80 shadow-2xl">
        {/* Top Emblem (Matching the orange emblem in reference) */}
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#FF7828] mb-2 animate-pulse-glow">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#FF7828"/>
          </svg>
        </div>

        {navItems.map((item) => {
          const href = item.href.replace('{id}', productId);
          const isActive = pathname === href;
          const Icon = item.icon;
          const tipText = t(item.key);
          return (
            <Link
              key={item.href}
              href={href}
              title={tipText}
              className={`relative group w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? 'bg-[#FF7828]/25 text-[#FF7828] font-bold shadow-md shadow-orange-500/20 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.75} />
              {/* Active indicator */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-[#FF7828] rounded-full shadow-sm shadow-orange-500" />
              )}
              {/* Tooltip */}
              <span className="absolute left-14 text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-200 bg-slate-900/95 backdrop-blur-md text-white border border-slate-700 shadow-xl z-50">
                {tipText}
              </span>
            </Link>
          );
        })}
      </aside>
    </>
  );
}
