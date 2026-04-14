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

const footerLinks = {
  tools: [
    { href: '/builder?new=true', label: 'Builder' },
    { href: '/performance', label: 'Drivetrain Lab' },
    { href: '/tire-pressure', label: 'Tire Pressure' },
    { href: '/weight', label: 'Weight Calculator' },
  ],
  resources: [
    { href: '/features/bike-compatibility-checker', label: 'Compatibility' },
    { href: '/blog', label: 'Blog' },
    { href: '/guides', label: 'Guides' },
    { href: '/standards/bottom-bracket', label: 'Standards' },
  ],
  legal: [
    { href: '/terms', label: 'Terms' },
    { href: '/privacy', label: 'Privacy' },
    { href: 'mailto:mike@cranksmith.com', label: 'Support' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-stone-950 px-4 pt-12 pb-32 md:pt-16 md:pb-16">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 p-1.5 flex items-center justify-center">
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
              <span className="font-bold text-white tracking-tight">
                Crank<span className="text-cyan-400">Smith</span>
              </span>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed mb-4">
              Precision cycling engineering. Build smarter, ride better.
            </p>
            <div className="flex items-center gap-3">
              <ExternalLink
                href="https://instagram.com/cranksmithapp"
                className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-stone-500 hover:text-white hover:border-white/15 transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </ExternalLink>
              <ExternalLink
                href="https://x.com/cranksmithapp"
                className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-stone-500 hover:text-white hover:border-white/15 transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </ExternalLink>
            </div>
          </div>

          {/* Tools Column */}
          <div>
            <h4 className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider mb-4">
              Tools
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.tools.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith('mailto:') ? (
                    <a
                      href={link.href}
                      className="text-sm text-stone-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-stone-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-stone-600">
            <p>&copy; {new Date().getFullYear()} CrankSmith &middot; St. George, UT</p>
            <span className="hidden sm:inline">&middot;</span>
            <p>Build v3.4.1</p>
          </div>

          <ExternalLink
            href="https://techridgeseo.com"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[10px] font-bold text-stone-600 hover:text-cyan-400 hover:border-cyan-400/20 transition-all uppercase tracking-widest"
          >
            Powered by Tech Ridge SEO
          </ExternalLink>
        </div>
      </div>
    </footer>
  );
}
