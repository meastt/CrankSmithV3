import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | CrankSmith Pro",
    description: "Privacy policy for CrankSmith Pro.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-950 py-24 text-gray-300">
            <div className="container mx-auto max-w-3xl px-4">
                <h1 className="mb-8 text-4xl font-bold text-white">Privacy Policy</h1>

                <div className="space-y-6">
                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">1. Information Collection</h2>
                        <p>
                            We collect information from you when you register on our site, place an order, subscribe to our newsletter, or fill out a form.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">2. Use of Information</h2>
                        <p>
                            Any of the information we collect from you may be used in one of the following ways:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>To personalize your experience</li>
                            <li>To improve our website</li>
                            <li>To improve customer service</li>
                            <li>To process transactions</li>
                            <li>To send periodic emails</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">3. Information Protection</h2>
                        <p>
                            We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">4. Cookies</h2>
                        <p>
                            We use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
