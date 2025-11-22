import { NextResponse } from 'next/server';
import { validateFrameBBCrank, Component } from '@/lib/validation';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { frame, bb, crank } = body;

        if (!frame || !bb || !crank) {
            return NextResponse.json({ error: 'Frame, BB, and Crank are required' }, { status: 400 });
        }

        const result = validateFrameBBCrank(frame as Component, bb as Component, crank as Component);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}
