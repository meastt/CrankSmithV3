import { NextResponse } from 'next/server';
import { Validator } from '@/lib/validation';
import { Component } from '@/lib/types/compatibility';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { frame, bb, crank } = body;

        if (!frame || !bb || !crank) {
            return NextResponse.json({ error: 'Frame, BB, and Crank are required' }, { status: 400 });
        }

        const buildData = {
            frame,
            bottomBracket: bb,
            crankset: crank,
            wheels: [],
            tires: []
        };

        const result = Validator.validateBuild(buildData);
        // Return new format
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}
