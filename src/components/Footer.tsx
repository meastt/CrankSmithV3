import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-stone-950 py-10 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-4 h-4 text-white"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </div>
              <span className="font-semibold text-stone-200">CrankSmith</span>
            </div>
            <p className="text-sm text-stone-600">
              © {new Date().getFullYear()} All rights reserved.
            </p>
            <p className="text-xs text-stone-600">
              Made by{" "}
              <a
                href="https://techridgeseo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Tech Ridge SEO
              </a>
            </p>
            <div className="mt-2 text-xs text-stone-600 flex flex-col gap-1">
              <span>St. George, UT</span>
              <a href="mailto:support@cranksmith.com" className="hover:text-primary transition-colors">support@cranksmith.com</a>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link href="/features/bike-compatibility-checker" className="text-stone-500 hover:text-primary transition-colors">
              Compatibility Checker
            </Link>
            <Link href="/guides" className="text-stone-500 hover:text-primary transition-colors">
              Guides
            </Link>
            <Link href="/terms" className="text-stone-500 hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-stone-500 hover:text-primary transition-colors">
              Privacy
            </Link>
            <a
              href="https://instagram.com/cranksmithapp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-500 hover:text-primary transition-colors"
            >
              Instagram
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
