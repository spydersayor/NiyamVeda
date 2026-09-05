import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';
import { I18nProvider } from '@/lib/i18n-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NiyamVeda (नियमवेद) — From Product to Compliance Clarity',
  description:
    'Explainable BIS Compliance Intelligence Assistant for Indian MSMEs. Source-grounded, rule-based evaluation. Authoritative evidence. Clear next steps. (SIH26107)',
  keywords: 'BIS compliance, MSME, Indian standards, certification, compliance pathway',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('niyamveda_theme');
                if (storedTheme === 'light') {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                } else if (storedTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen transition-colors duration-200`}>
        <ThemeProvider>
          <I18nProvider>
            <AuthProvider>
              <Nav />
              <main>{children}</main>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
        {/* Disclaimer Footer */}
        <footer className="border-t border-[#1E293B] bg-[#060C1A] py-6 px-6 mt-8">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/60 pb-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#FF7828]/20 flex items-center justify-center text-[#FF7828] font-bold text-[10px]">N</span>
                <span className="font-semibold text-slate-300">NiyamVeda (नियमवेद)</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-500">SIH26107</span>
              </div>
              <div className="flex items-center gap-6 text-slate-400 font-medium">
                <a href="/how-it-works" className="hover:text-[#FF9933] transition-colors">How It Works</a>
                <a href="/sources" className="hover:text-[#FF9933] transition-colors">Sources</a>
                <a href="/about" className="hover:text-[#FF9933] transition-colors">About Us</a>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
              <p className="text-center md:text-left text-slate-500 max-w-2xl leading-relaxed">
                ⚠️ NIYAMVEDA provides source-grounded compliance guidance and does not constitute BIS certification or legal approval.
                Final compliance must be verified against the applicable official standards and regulatory authorities.
              </p>
              <span className="text-slate-600 font-mono">v1.0.0</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
