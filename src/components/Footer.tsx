'use client';

import Link from "next/link";
import { useCallback } from "react";

function ExternalLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const handleClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const { Capacitor } = await import('@capacitor/core');
      if (Capacitor.isNativePlatform()) {
        const { Browser } = await import('@capacitor/browser');
        await Browser.open({ url: href });
        return;
      }
    } catch {
      // Not on native platform, fall through
    }
    window.open(href, '_blank', 'noopener,noreferrer');
  }, [href]);

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-stone-950 px-4 py-8 md:py-12 pb-32 md:pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Brand & Mission */}
          <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-dark p-1.5 flex items-center justify-center shadow-lg shadow-primary/20">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-full h-full text-white"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </div>
              <span className="font-bold text-stone-100 tracking-tight text-lg">CrankSmith</span>
            </div>
            
            <p className="text-xs font-medium text-stone-500 uppercase tracking-widest mt-1">
              Precision cycling engineering
            </p>
            
            <div className="flex flex-col gap-1.5 mt-2">
              <p className="text-[11px] text-stone-600 leading-relaxed font-medium">
                © {new Date().getFullYear()} CrankSmith <span className="mx-1">•</span> St. George, UT
              </p>
              <p className="text-[10px] text-stone-700">
                Build v3.4.1 <span className="mx-1">•</span> All Rights Reserved
              </p>
            </div>
          </div>

          {/* Desktop Navigation Link Wall (Hidden on Mobile) */}
          <nav className="hidden md:flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
            <Link href="/features/bike-compatibility-checker" className="hover:text-primary transition-colors">
              Compatibility
            </Link>
            <Link href="/guides" className="hover:text-primary transition-colors">
              Guides
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <ExternalLink
              href="https://instagram.com/cranksmithapp"
              className="hover:text-primary transition-colors"
            >
              Instagram
            </ExternalLink>
          </nav>

          {/* Mobile-only Legal/Meta Links (Cleaner app-style list) */}
          <div className="flex md:hidden flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-bold text-stone-400 uppercase tracking-widest">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <a href="mailto:support@cranksmith.com">Support</a>
          </div>

          {/* Maker Attribution */}
          <div className="flex flex-col items-center md:items-end gap-1.5">
            <span className="text-[10px] text-stone-700 font-bold uppercase tracking-widest">Powered By</span>
            <ExternalLink
              href="https://techridgeseo.com"
              className="px-3 py-1 rounded-lg bg-stone-900 border border-white/5 text-[10px] font-bold text-cyan-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
            >
              TECH RIDGE SEO
            </ExternalLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
