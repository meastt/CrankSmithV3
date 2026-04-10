import { SignInButton } from '@/lib/clerk-stub';

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Sign Up</h1>
                <p className="text-stone-400 mb-6">Sign-up is not yet configured. Contact support for access.</p>
                <a href="/" className="text-cyan-400 hover:text-cyan-300">← Back to Home</a>
            </div>
        </div>
    );
}
