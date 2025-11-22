import { NextResponse } from 'next/server';
import { validateFrameWheel, Component } from '@/lib/validation';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { frame, wheel, tire } = body;

        if (!frame || !wheel) {
            return NextResponse.json({ error: 'Frame and Wheel are required' }, { status: 400 });
        }

        const result = validateFrameWheel(frame as Component, wheel as Component, tire as Component);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}
