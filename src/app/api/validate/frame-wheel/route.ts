import { NextResponse } from 'next/server';
import { Validator } from '@/lib/validation';
import { Component } from '@/lib/types/compatibility';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { frame, wheel, tire } = body;

        if (!frame || !wheel) {
            return NextResponse.json({ error: 'Frame and Wheel are required' }, { status: 400 });
        }

        const buildData = {
            frame,
            wheels: [wheel],
            tires: tire ? [tire] : []
        };

        const result = Validator.validateBuild(buildData);
        // Transform back to old format if needed, OR just return new format
        // Returning new format is safer for consistency
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}
