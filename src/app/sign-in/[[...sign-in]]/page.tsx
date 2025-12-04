import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-stone-950 -z-10" />
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            <SignIn
                signUpUrl="/sign-up"
                appearance={{
                    baseTheme: dark,
                    variables: {
                        colorPrimary: '#06b6d4', // cyan-500
                        colorBackground: '#1c1917', // stone-900
                        colorText: '#fafaf9', // stone-50
                        colorTextSecondary: '#a8a29e', // stone-400
                        colorInputBackground: '#292524', // stone-800
                        colorInputText: '#fafaf9', // stone-50
                        borderRadius: '0.75rem',
                    },
                    elements: {
                        rootBox: "mx-auto w-full max-w-md",
                        card: "bg-stone-900/50 backdrop-blur-xl border border-white/10 shadow-2xl",
                        headerTitle: "text-white font-bold text-2xl",
                        headerSubtitle: "text-stone-400",
                        formButtonPrimary: "bg-cyan-500 hover:bg-cyan-400 text-white transition-colors shadow-lg shadow-cyan-500/20",
                        formFieldInput: "bg-stone-800/50 border-stone-700 focus:border-cyan-500 transition-colors",
                        footerActionLink: "text-cyan-400 hover:text-cyan-300",
                        identityPreviewEditButtonIcon: "text-stone-400",
                        formFieldLabel: "text-stone-300",
                        dividerLine: "bg-stone-800",
                        dividerText: "text-stone-500",
                        socialButtonsIconButton: "border-stone-700 hover:bg-stone-800 transition-colors",
                        socialButtonsBlockButton: "border-stone-700 hover:bg-stone-800 transition-colors text-stone-300",
                    }
                }}
            />
        </div>
    );
}
