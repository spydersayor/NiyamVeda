'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FileCheck, BookOpen, ClipboardList,
  AlertTriangle, FlaskConical, Database, Shield, Home, Zap, Sparkles
} from 'lucide-react';

interface ProductSidebarProps {
  productId: string;
}

const navItems = [
  { href: '/product/{id}/confirm',       icon: Home,            label: 'Product',       tip: 'Product Facts (Screen 3)'       },
  { href: '/product/{id}/analysis',      icon: LayoutDashboard, label: 'Analysis',      tip: 'Pathway Dashboard (Screen 4)'   },
  { href: '/product/{id}/why-rule',      icon: Zap,             label: 'Why Rule',      tip: 'Why This Rule Applies (Screen 5)'},
  { href: '/product/{id}/rule-inspector',icon: FileCheck,       label: 'Inspector',     tip: 'Rule Inspector (Screen 6)'      },
  { href: '/product/{id}/standards',     icon: BookOpen,        label: 'Standards',     tip: 'Relevant Standards (Screen 7)'  },
  { href: '/product/{id}/requirements',  icon: ClipboardList,   label: 'Requirements',  tip: 'Requirements Checklist (Screen 8)'},
  { href: '/product/{id}/risks',         icon: AlertTriangle,   label: 'Risks',         tip: 'Potential Risks (Screen 9)'     },
  { href: '/product/{id}/simulation',    icon: FlaskConical,    label: 'Simulate',      tip: 'What-If Simulation (Screen 10)' },
  { href: '/product/{id}/sources',       icon: Database,        label: 'Sources',       tip: 'Evidence Trail (Screen 11)'     },
  { href: '/product/{id}/abstention',    icon: Shield,          label: 'Abstention',    tip: 'Safe Abstention (Screen 12)'    },
];

export default function ProductSidebar({ productId }: ProductSidebarProps) {
  const pathname = usePathname();

  // Screens 7 to 12 have a clean light canvas in the reference image
  const isLightPage = pathname?.includes('/standards') || 
                      pathname?.includes('/requirements') || 
                      pathname?.includes('/risks') || 
                      pathname?.includes('/simulation') || 
                      pathname?.includes('/sources') ||
                      pathname?.includes('/why-rule') ||
                      pathname?.includes('/rule-inspector') ||
                      pathname?.includes('/abstention');

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-14 flex flex-col items-center py-4 gap-1.5 z-40 bg-[#060C1A]/90 backdrop-blur-xl border-r border-slate-800/80 shadow-2xl">
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
        return (
          <Link
            key={item.href}
            href={href}
            title={item.tip}
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
              {item.tip}
            </span>
          </Link>
        );
      })}
    </aside>
  );
}
