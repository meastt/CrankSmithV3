import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GRAVEL_MOUTH_BEEHIIV;
        const pubId = process.env.BEEHIIV_API_V2;

        if (!apiKey || !pubId) {
            console.error('Missing Beehiiv configuration: GRAVEL_MOUTH_BEEHIIV or BEEHIIV_API_V2');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const beehiivRes = await fetch(
            `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    reactivate_existing: true,
                    utm_source: 'cranksmith_website',
                    utm_medium: 'homepage_widget',
                }),
            }
        );

        if (beehiivRes.ok) {
            return NextResponse.json({ success: true });
        }

        // 409 = already subscribed, treat as success
        if (beehiivRes.status === 409) {
            return NextResponse.json({ success: true });
        }

        if (beehiivRes.status === 400) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        console.error('Beehiiv API error:', beehiivRes.status, await beehiivRes.text());
        return NextResponse.json(
            { error: 'Newsletter service temporarily unavailable' },
            { status: 502 }
        );
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return NextResponse.json(
            { error: 'Failed to subscribe' },
            { status: 500 }
        );
    }
}
