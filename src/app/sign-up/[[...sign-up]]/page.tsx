import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <SignUp
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
