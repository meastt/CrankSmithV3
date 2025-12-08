/**
 * DEPRECATED: This test script used the old engine/Validator.ts which has been removed.
 *
 * The old validator used strongly-typed interfaces (Frame, Fork, etc.) with enum values.
 * The new validator (src/lib/validation.ts) uses flexible JSON-based validation.
 *
 * TODO: Rewrite these tests for the new Validator in src/lib/validation.ts
 *
 * Tests that need to be recreated:
 * - Frame & Fork steerer compatibility
 * - Wheel axle to frame compatibility
 * - Drivetrain protocol matching (cross-brand)
 * - Brake fluid safety checks (DOT vs Mineral)
 * - Chainline validation
 *
 * See: src/lib/validation.test.ts for new test examples (to be created)
 */

// Old imports - no longer valid:
// import { Validator } from '../src/engine/Validator';
// import { MOCK_FRAMES, MOCK_FORKS, MOCK_SHIFTERS, MOCK_RDS } from '../src/data/mockDb';

console.log('This test file is deprecated. See comments for migration instructions.');
