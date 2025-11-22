import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | CrankSmith Pro",
    description: "Terms and conditions for using CrankSmith Pro.",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-950 py-24 text-gray-300">
            <div className="container mx-auto max-w-3xl px-4">
                <h1 className="mb-8 text-4xl font-bold text-white">Terms of Service</h1>

                <div className="space-y-6">
                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using CrankSmith Pro, you accept and agree to be bound by the terms and provision of this agreement.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">2. Use License</h2>
                        <p>
                            Permission is granted to temporarily download one copy of the materials (information or software) on CrankSmith Pro's website for personal, non-commercial transitory viewing only.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">3. Disclaimer</h2>
                        <p>
                            The materials on CrankSmith Pro's website are provided on an 'as is' basis. CrankSmith Pro makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">4. Limitations</h2>
                        <p>
                            In no event shall CrankSmith Pro or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CrankSmith Pro's website.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
