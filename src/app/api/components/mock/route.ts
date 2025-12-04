import { NextResponse } from 'next/server';
import {
    MOCK_FRAMES, MOCK_FORKS, MOCK_SHIFTERS, MOCK_RDS,
    MOCK_WHEELS, MOCK_TIRES, MOCK_BBS, MOCK_CRANKS,
    MOCK_CASSETTES, MOCK_CALIPERS, MOCK_ROTORS,
    MOCK_STEMS, MOCK_BARS, MOCK_SEATPOSTS
} from '@/data/mockDb';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let data: any[] = [];

    switch (type) {
        case 'Frame':
            data = MOCK_FRAMES;
            break;
        case 'Fork':
            data = MOCK_FORKS;
            break;
        case 'Wheel':
        case 'Wheelset': // Handle both
            data = MOCK_WHEELS;
            break;
        case 'Tire':
            data = MOCK_TIRES;
            break;
        case 'BottomBracket':
            data = MOCK_BBS;
            break;
        case 'Crankset':
            data = MOCK_CRANKS;
            break;
        case 'Cassette':
            data = MOCK_CASSETTES;
            break;
        case 'RearDerailleur':
            data = MOCK_RDS;
            break;
        case 'Shifter':
            data = MOCK_SHIFTERS;
            break;
        case 'BrakeCaliper':
            data = MOCK_CALIPERS;
            break;
        case 'BrakeRotor':
            data = MOCK_ROTORS;
            break;
        case 'Stem':
            data = MOCK_STEMS;
            break;
        case 'Handlebar':
            data = MOCK_BARS;
            break;
        case 'Seatpost':
            data = MOCK_SEATPOSTS;
            break;
        default:
            // Return all?
            data = [
                ...MOCK_FRAMES,
                ...MOCK_FORKS,
                ...MOCK_SHIFTERS,
                ...MOCK_RDS,
                ...MOCK_WHEELS,
                ...MOCK_TIRES,
                ...MOCK_BBS,
                ...MOCK_CRANKS,
                ...MOCK_CASSETTES,
                ...MOCK_CALIPERS,
                ...MOCK_ROTORS,
                ...MOCK_STEMS,
                ...MOCK_BARS,
                ...MOCK_SEATPOSTS
            ];
    }

    return NextResponse.json(data);
}
