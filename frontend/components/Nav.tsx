'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function Nav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#070D1B]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
        
        {/* Logo (Exact to Screen 1, 2, 3 Header) */}
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
              From Product to Compliance Clarity
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-300">
          <Link href="/#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </Link>
          <Link href="/sources" className="hover:text-white transition-colors">
            Sources
          </Link>
          <Link href="/#about" className="hover:text-white transition-colors">
            About Us
          </Link>
        </div>

        {/* Right CTA & Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link 
                href="/auth" 
                className="hidden sm:flex items-center gap-1.5 bg-[#0B1426] border border-slate-700 hover:border-slate-500 rounded-md px-2.5 py-1.5 text-[11px] text-slate-300 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-semibold text-white max-w-[100px] truncate">{user.full_name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={logout}
                title="Sign Out"
                className="text-[11px] text-slate-400 hover:text-red-400 px-2 py-1 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-slate-800/60 transition-colors"
            >
              Sign In
            </Link>
          )}

          <Link 
            href="/product/new" 
            className="bg-[#FF7828] hover:bg-[#E05E10] text-white font-bold text-xs px-4 py-2 rounded-md transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5"
          >
            Start Analysis <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </nav>
  );
}
