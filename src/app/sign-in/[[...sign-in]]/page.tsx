import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <SignIn
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "bg-gray-900 border border-white/10"
                    }
                }}
            />
        </div>
    );
}
