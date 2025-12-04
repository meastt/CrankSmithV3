
import { Validator } from '../src/engine/Validator';
import { MOCK_FRAMES, MOCK_FORKS, MOCK_SHIFTERS, MOCK_RDS } from '../src/data/mockDb';
import {
    Frame, Fork, Wheel, Shifter, RearDerailleur, BrakeCaliper
} from '../src/types/components';
import {
    HeadTubeStandard, SteererStandard, AxleStandard,
    PullRatioID, FluidType, BrakeMountStandard
} from '../src/constants/standards';

// Helper to print results
const printResult = (testName: string, result: any) => {
    console.log(`\n--- ${testName} ---`);
    console.log(`Valid: ${result.valid}`);
    console.log(`Status: ${result.status}`);
    console.log(`Message: ${result.message}`);
    if (result.requiredAdapter) console.log(`Adapter: ${result.requiredAdapter}`);
};

// --- TEST 1: Frame & Fork ---
// Scenario: Tapered Fork into Straight Headtube (Should FAIL)
const straightFrame = { ...MOCK_FRAMES[0], headTube: HeadTubeStandard.EC34 }; // Modifying to straight
const taperedFork = MOCK_FORKS[0]; // Tapered
printResult('Test 1: Tapered Fork in Straight Headtube', Validator.validateFrameToFork(straightFrame, taperedFork));

// --- TEST 2: Wheel & Frame ---
// Scenario: Boost Wheel (148) into Road Frame (142) (Should FAIL)
const roadFrame = MOCK_FRAMES[0]; // 142mm
const boostWheel: Wheel = {
    id: 'wheel_boost',
    brand: 'Generic',
    model: 'Boost',
    position: 'REAR',
    diameter: '29',
    axle: AxleStandard.TA_12_148,
    internalWidth: 30,
    brakeInterface: 'DISC_6BOLT',
    weightGrams: 1000,
    price: 500,
    image: ''
};
printResult('Test 2: Boost Wheel in Road Frame', Validator.validateWheelToFrame(roadFrame, boostWheel));

// --- TEST 3: Drivetrain (Cross-Brand/Type) ---
// Scenario: SRAM AXS Shifter + Shimano Mech RD (Should FAIL)
const axsShifter = MOCK_SHIFTERS[0];
const shimanoRD = MOCK_RDS[2];
printResult('Test 3: AXS Shifter + Shimano Mech RD', Validator.validateShifting(axsShifter, shimanoRD));

// --- TEST 4: Drivetrain (Compatible) ---
// Scenario: SRAM AXS Shifter + SRAM AXS RD (Should PASS)
const sramRD = MOCK_RDS[0];
printResult('Test 4: AXS Shifter + AXS RD', Validator.validateShifting(axsShifter, sramRD));

// --- TEST 5: Brakes (Safety) ---
// Scenario: DOT Lever + Mineral Caliper (Should FAIL CATASTROPHICALLY)
const dotLever: Shifter = { ...MOCK_SHIFTERS[0], brakeFluid: FluidType.DOT };
const mineralCaliper: BrakeCaliper = {
    id: 'caliper_min',
    brand: 'Shimano',
    model: 'XT',
    position: 'REAR',
    mount: BrakeMountStandard.DISC_POST,
    fluid: FluidType.MINERAL,
    weightGrams: 100,
    price: 50,
    image: ''
};
// Need a dummy rotor and frame for the signature
const dummyRotor = { id: 'r', size: 160, mount: '6BOLT' } as any;
const dummyFrame = MOCK_FRAMES[2]; // MTB
printResult('Test 5: DOT Lever + Mineral Caliper', Validator.validateBrakes(dotLever, mineralCaliper, dummyRotor, dummyFrame));

// --- TEST 6: Chainline (Boost Crank on Road Frame) ---
// Scenario: Boost Crank (52mm) on Road Frame (142mm -> Expect 43.5-47.5mm) -> Should FAIL
const roadFrameCL = MOCK_FRAMES[0]; // Road 142mm
const boostCrank = {
    id: 'crank_boost',
    brand: 'SRAM',
    model: 'GX Eagle',
    spindle: 'SP_DUB',
    speeds: 12,
    chainrings: [32],
    chainline: 52, // Boost
    powerMeter: false,
    weightGrams: 600,
    price: 150,
    image: ''
} as any; // Cast to avoid full mock setup
printResult('Test 6: Boost Crank on Road Frame', Validator.validateChainline(boostCrank, roadFrameCL));
