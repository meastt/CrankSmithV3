import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Contact CrankSmith | Get in Touch",
    description: "Get in touch with the CrankSmith team. Have questions about features, pricing, or compatibility? We'd love to hear from you.",
    openGraph: {
        title: "Contact Us | CrankSmith",
        description: "Have questions about bike compatibility tools? Reach out to the CrankSmith team.",
        type: "website"
    }
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
