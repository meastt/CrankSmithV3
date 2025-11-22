import { NextResponse } from 'next/server';
import { validateDrivetrain, Component } from '@/lib/validation';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { shifter, derailleur, cassette, crank } = body;

        if (!shifter || !derailleur || !cassette) {
            return NextResponse.json({ error: 'Shifter, Derailleur, and Cassette are required' }, { status: 400 });
        }

        const result = validateDrivetrain(shifter as Component, derailleur as Component, cassette as Component, crank as Component);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}
