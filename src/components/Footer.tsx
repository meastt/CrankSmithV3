import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gray-950 py-12 text-sm text-gray-400">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="text-lg font-bold text-white">CrankSmith Pro</span>
            <p>© {new Date().getFullYear()} CrankSmith. All rights reserved.</p>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-8">
            <Link href="/terms" className="hover:text-blue-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
