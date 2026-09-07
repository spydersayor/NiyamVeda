'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, Mail, User, Building2, AtSign,
  ArrowRight, Sparkles, CheckCircle2, AlertCircle, Loader2 
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTranslation } from '@/lib/i18n-context';

/**
 * Validate next parameter to guarantee internal navigation only (prevent open redirects).
 */
function getSafeNext(next: string | null): string {
  if (!next) return '/product/new';
  try {
    const decoded = decodeURIComponent(next);
    if (decoded.startsWith('/') && !decoded.startsWith('//') && !decoded.startsWith('/\\')) {
      return decoded;
    }
  } catch {}
  return '/product/new';
}

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get('next');
  const safeNext = getSafeNext(rawNext);
  const { user, login, register, demoLogin, logout } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (user && rawNext) {
      router.replace(safeNext);
    }
  }, [user, rawNext, safeNext, router]);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Validate full name: accept ONLY English alphabet characters A-Z / a-z
   * and single spaces between name parts.
   */
  function isValidFullName(value: string): boolean {
    return /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(value);
  }

  /**
   * Validate username: required, 3–30 characters, allow only A-Z, a-z, 0-9, underscore.
   */
  function isValidUsername(value: string): boolean {
    return /^[A-Za-z0-9_]{3,30}$/.test(value);
  }

  /**
   * Validate email format (mirrors backend rules in UserRegister).
   * Returns true if valid, false if invalid.
   */
  function isValidEmail(value: string): boolean {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return false;

    // Exactly one @
    if (normalized.split('@').length - 1 !== 1) return false;

    const atIdx = normalized.indexOf('@');
    const local = normalized.slice(0, atIdx);
    const domain = normalized.slice(atIdx + 1);

    if (!local || !domain) return false;

    // Local part rules
    if (local.startsWith('.') || local.endsWith('.')) return false;
    if (local.includes('..')) return false;

    // No spaces allowed anywhere
    if (/\s/.test(normalized)) return false;

    // Domain rules
    if (domain.startsWith('.') || domain.endsWith('.')) return false;
    if (domain.includes('..')) return false;

    const labels = domain.split('.');
    // Must have domain + TLD (at least 2 labels)
    if (labels.length < 2) return false;
    // No empty labels
    if (labels.some((l) => !l)) return false;
    // No label starting/ending with hyphen
    if (labels.some((l) => l.startsWith('-') || l.endsWith('-'))) return false;

    // TLD must be purely alphabetic and at least 2 chars
    const tld = labels[labels.length - 1];
    if (tld.length < 2 || !/^[a-z]+$/.test(tld)) return false;

    return true;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'register') {
      if (!isValidFullName(fullName)) {
        setError(t('auth_err_fullname_invalid'));
        return;
      }
      if (!isValidUsername(username)) {
        setError(t('auth_err_username_invalid'));
        return;
      }
    }

    // Frontend email format validation — reject before calling API
    if (!isValidEmail(email)) {
      setError(t('auth_err_email_invalid'));
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, fullName, username, companyName);
      }
      router.push(safeNext);
    } catch (err: any) {
      const msg: string = err?.message ?? '';
      // Network / timeout failures have no useful message from the backend.
      // Distinguish them from genuine auth errors so the user is not confused.
      if (!msg || msg.startsWith('API fetch error') || msg.startsWith('Failed to fetch') || msg.includes('abort')) {
        setError(t('auth_err_generic'));
      } else {
        // Surface the backend detail (e.g. "Invalid email or password",
        // "An account with this email already exists", "This username is already taken", etc.)
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin();
      router.push(safeNext);
    } catch (err: any) {
      setError(t('auth_err_demo'));
    } finally {
      setLoading(false);
    }
  };

  // If already logged in, show user profile card
  if (user) {
    return (
      <div className="min-h-screen portal-bg py-16 px-4 font-sans text-white flex items-center justify-center relative overflow-hidden">
        <div className="max-w-md w-full bg-[#0B1426]/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-2xl space-y-6 relative z-10 text-center animate-slide-up">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
            <CheckCircle2 size={32} />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">{t('nav_profile')}</h2>
            <p className="text-xs text-slate-400">{t('profile_desc')}</p>
          </div>

          <div className="bg-[#070D1B] border border-slate-800/80 rounded-xl p-4 text-left text-xs space-y-2.5">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t('auth_username')}</span>
              <p className="font-semibold text-[#FF9933] text-sm">@{user.username || user.full_name?.split(' ')[0]}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t('auth_full_name')}</span>
              <p className="font-semibold text-white text-sm">{user.full_name}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t('auth_email')}</span>
              <p className="font-medium text-slate-300">{user.email}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t('auth_company_name')}</span>
              <p className="font-medium text-slate-300">{user.company_name}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t('auth_card_role')}</span>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/10 text-[#FF9933] border border-orange-500/20">
                {user.role}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Link
              href={safeNext}
              className="bg-[#FF7828] hover:bg-[#E05E10] text-white text-xs font-bold py-3 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
            >
              {t('auth_card_start')} <ArrowRight size={14} />
            </Link>
            <button
              onClick={async () => { await logout(); }}
              className="border border-slate-700 hover:bg-slate-800/50 text-slate-400 hover:text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-all"
            >
              {t('auth_card_signout')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen portal-bg py-8 sm:py-12 px-3 sm:px-6 font-sans text-white flex items-center justify-center relative overflow-hidden">
      
      {/* Background Mandala & Glow Motif */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF7828]/10 rounded-full blur-3xl pointer-events-none max-w-full" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none max-w-full" />

      <div className="max-w-md w-full space-y-6 relative z-10 animate-slide-up">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7828] to-[#E05E10] flex items-center justify-center text-white mx-auto shadow-lg shadow-orange-500/30">
            <ShieldCheck size={26} />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            NiyamVeda <span className="text-[#FF9933] font-normal">(नियमवेद)</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {t('auth_portal_subtitle')}
          </p>
        </div>

        {/* 1-Click Demo Login Box (For Judges & Reviewers) */}
        <div className="bg-gradient-to-r from-orange-950/40 via-amber-950/30 to-[#0B1426] border border-orange-500/30 rounded-xl p-3.5 sm:p-4 shadow-lg text-center space-y-2 card-interactive">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#FF9933]">
            <Sparkles size={14} />
            <span>{t('auth_demo_badge')}</span>
          </div>
          <p className="text-[11px] text-slate-300">
            {t('auth_demo_desc')}
          </p>
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-[#FF7828] to-[#FF9933] hover:from-[#E05E10] hover:to-[#FF7828] text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
            <span>{t('auth_demo_btn')}</span>
          </button>
        </div>

        {/* Main Auth Form Container */}
        <div className="bg-[#0B1426]/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl space-y-6 card-interactive">
          
          {/* Mode Switch Tabs */}
          <div className="flex items-center bg-[#070D1B] p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                mode === 'login'
                  ? 'bg-[#FF7828] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('auth_tab_login')}
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                mode === 'register'
                  ? 'bg-[#FF7828] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('auth_tab_register')}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-xs text-red-400">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('auth_full_name')} <span className="text-[#FF7828]">*</span>
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t('auth_full_name_placeholder')}
                      className="w-full bg-[#070D1B] border border-slate-700 rounded-lg pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF7828]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('auth_username')} <span className="text-[#FF7828]">*</span>
                  </label>
                  <div className="relative">
                    <AtSign size={15} className="absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={t('auth_username_placeholder')}
                      className="w-full bg-[#070D1B] border border-slate-700 rounded-lg pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF7828]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('auth_company_name')}
                  </label>
                  <div className="relative">
                    <Building2 size={15} className="absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={t('auth_company_placeholder')}
                      className="w-full bg-[#070D1B] border border-slate-700 rounded-lg pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF7828]"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {t('auth_email')} <span className="text-[#FF7828]">*</span>
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth_email_placeholder')}
                  className="w-full bg-[#070D1B] border border-slate-700 rounded-lg pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF7828]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {t('auth_password')} <span className="text-[#FF7828]">*</span>
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth_password_placeholder')}
                  className="w-full bg-[#070D1B] border border-slate-700 rounded-lg pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF7828]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#070D1B] hover:bg-[#121c33] border border-slate-700 hover:border-slate-500 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? t('common_processing') : (
                <>
                  {mode === 'login' ? t('auth_btn_login') : t('auth_btn_register')}
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen portal-bg" />}>
      <AuthContent />
    </Suspense>
  );
}
