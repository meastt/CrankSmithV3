import { NextResponse } from 'next/server';
import { Validator } from '@/lib/validation';
import { Component } from '@/lib/types/compatibility';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { shifter, derailleur, cassette, crank } = body;

        if (!shifter || !derailleur || !cassette) {
            return NextResponse.json({ error: 'Shifter, Derailleur, and Cassette are required' }, { status: 400 });
        }

        const buildData = {
            shifter,
            rearDerailleur: derailleur,
            cassette,
            crankset: crank,
            frame: undefined, // Need to make sure required fields are optional in Validator inputs or handle partials
            wheels: [],
            tires: []
        };

        const result = Validator.validateBuild(buildData);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}
