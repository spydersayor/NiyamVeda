import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'NiyamVeda (नियमवेद) — From Product to Compliance Clarity',
  description:
    'Explainable BIS Compliance Intelligence Assistant for Indian MSMEs. Source-grounded, rule-based evaluation. Authoritative evidence. Clear next steps. (SIH26107)',
  keywords: 'BIS compliance, MSME, Indian standards, certification, compliance pathway',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0B132B] min-h-screen text-white">
        <AuthProvider>
          <Nav />
          <main>{children}</main>
        </AuthProvider>
        {/* Disclaimer Footer */}
        <footer className="border-t border-[#1E293B] bg-[#060C1A] py-4 px-6 mt-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-[#FF7828]/20 flex items-center justify-center text-[#FF7828] font-bold text-[10px]">N</span>
              <span className="font-semibold text-slate-400">NiyamVeda</span>
              <span className="text-slate-600">·</span>
              <span>SIH26107</span>
            </div>
            <p className="text-center text-[11px] text-slate-600 max-w-2xl">
              ⚠️ NIYAMVEDA provides source-grounded compliance guidance and does not constitute BIS certification or legal approval.
              Final compliance must be verified against the applicable official standards and regulatory authorities.
            </p>
            <span className="text-slate-600">v1.0.0</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
