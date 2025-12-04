# ✅ Project Velocity: Master Execution Checklist

## 📦 Phase 0: Environment & Standards Definition
The bedrock. If this is wrong, everything else breaks.

- [x] ~~0.1 Initialize Repo: Set up React Native project with TypeScript (npx react-native init Velocity --template react-native-template-typescript).~~
- [x] ~~0.2 Define Enums (Global Standards):~~
    - [x] ~~Create src/constants/standards.ts.~~
    - [x] ~~Define FrameType (Road, Gravel, MTB).~~
    - [x] ~~Define AxleStandard (QR, 12x100, 15x110, 12x142, 12x148, etc.).~~
    - [x] ~~Define HeadTubeStandard (EC34, ZS44, IS42/52, etc.).~~
    - [x] ~~Define BBShellStandard (BSA, PF30, T47, BB86, etc.).~~
    - [x] ~~Define BrakeMountStandard (Flat, Post, IS, Rim).~~
    - [x] ~~Define FreehubStandard (HG, XD, XDR, MicroSpline).~~
    - [x] ~~Define PullRatioID (Shimano_Road_11, Shimano_MTB_11, SRAM_AXS, SRAM_Exact, etc.).~~
    - [x] ~~Define FluidType (DOT, Mineral).~~
- [x] ~~0.3 Create Data Interfaces:~~
    - [x] ~~Create src/types/components.ts.~~
    - [x] ~~Define Frame interface (referencing Enums).~~
    - [x] ~~Define Fork, Wheel, Tire interfaces.~~
    - [x] ~~Define Drivetrain interfaces (Crank, Cassette, Derailleur, Shifter).~~
    - [x] ~~Define Brake interfaces (Lever, Caliper, Rotor).~~
- [x] ~~0.4 Mock Data Injection:~~
    - [x] ~~Create src/data/mockDb.ts.~~
    - [x] ~~Populate with 3 distinct Build Kits (Road, Gravel, MTB) to use as test cases.~~

## 🏗️ Phase 1: The Core Validation Engine (Logic Only)
Pure TypeScript. No UI yet. TDD (Test Driven Development) approach.

- [x] ~~1.1 Setup Logic Class: Create src/engine/Validator.ts.~~
- [x] ~~1.2 Frame & Fork Logic:~~
    - [x] ~~Write function validateFrameToFork(frame, fork).~~
    - [x] ~~Check: Steerer tube diameter match?~~
    - [x] ~~Check: Wheel size intended match?~~
    - [x] ~~Check: Axle-to-Crown geometry tolerance (+/- 20mm)?~~
    - [x] ~~Test: Run Unit Test: Tapered Fork in Straight Headtube -> Expect FAIL.~~
- [x] ~~1.3 Rolling Chassis Logic (Wheels/Tires):~~
    - [x] ~~Write function validateWheelToFrame(frame, wheel, position).~~
    - [x] ~~Check: Axle Standard (Diameter & Width) match?~~
    - [x] ~~Check: Brake Mount interface match?~~
    - [x] ~~Write function validateTireToFrame(frame, tire).~~
    - [x] ~~Check: Tire Width + 4mm Buffer <= Frame Max Clearance?~~
    - [x] ~~Check: Tire Diameter == Wheel Diameter?~~
- [x] ~~1.4 Engine Aggregator:~~
    - [x] ~~Create main function validateBuild(currentPartsList) that calls the sub-functions above.~~
    - [x] ~~Return standard ValidationResult object ({ isValid: boolean, issues: [] }).~~

## ⚙️ Phase 2: Drivetrain Complexity (The "Brain")
Handling the matrix of gears, chains, and compatibility.

- [x] ~~2.1 Bottom Bracket (BB) Logic:~~
    - [x] ~~Write function validateBB(frame, bb, crank).~~
    - [x] ~~Check: Does BB fit Frame Shell?~~
    - [x] ~~Check: Does BB Inner Diameter fit Crank Spindle?~~
- [x] ~~2.2 Shifting Logic (Pull Ratios):~~
    - [x] ~~Write function validateShifting(shifter, rearDerailleur, cassette).~~
    - [x] ~~Check: PullRatioID match between Shifter and RD? (CRITICAL).~~
    - [x] ~~Check: Speed count match (11s vs 11s)?~~
- [x] ~~2.3 Capacity & Gearing Logic:~~
    - [x] ~~Calculate TotalCapacityNeeded: (BigRing - SmallRing) + (BigCog - SmallCog).~~
    - [x] ~~Check: TotalCapacityNeeded <= RD.TotalCapacity?~~
    - [x] ~~Check: Cassette.MaxCog <= RD.MaxCogLimit?~~
    - [x] ~~Check: Cassette.FreehubType == RearWheel.FreehubType?~~
- [x] ~~2.4 Chainline Logic:~~
    - [x] ~~Check: Crank.Chainline matches Frame.RearSpacing standard (e.g., Boost Crank on Boost Frame)?~~

## 🛑 Phase 3: Safety & Cockpit
Preventing dangerous builds.

- [x] ~~3.1 Braking Logic:~~
    - [x] ~~Write function validateBrakes(lever, caliper, rotor).~~
    - [x] ~~Check: Fluid Type match (DOT vs Mineral)? (CRITICAL FAIL).~~
    - [x] ~~Check: Rotor Mount (6-bolt vs Centerlock) match Hub?~~
    - [x] ~~Check: Rotor Size <= Fork/Frame Max Rotor Size?~~
- [x] ~~3.2 Cockpit Logic:~~
    - [x] ~~Check: Stem Clamp Diameter == Handlebar Clamp Diameter?~~
    - [x] ~~Check: Seatpost Diameter == Frame Seat Tube Diameter?~~

## 📱 Phase 4: State Management & UI (React Native)
Connecting the engine to the user.

- [x] 4.1 State Store:
    - [x] Set up Redux Toolkit or Context API. (Used Zustand)
    - [x] Create slice buildState to hold selected parts.
    - [x] Create slice compatibilityReport to hold the Engine's output.
- [x] 4.2 The "Smart" Part Selector:
    - [x] Create PartSelector component.
    - [x] Feature: Implement "Active Filtering". (When Frame is selected, only query DB for compatible Forks).
    - [x] Feature: "Show Incompatible" toggle (Users can see incompatible parts but they are greyed out).
- [x] 4.3 The Build Dashboard:
    - [x] Create main screen displaying the bike visualization. (PartSelector + Dashboard)
    - [x] UI: Display "Compatibility Score" (Green/Yellow/Red status bar).
    - [x] UI: Display "Issues List" (e.g., "Warning: Tire clearance is tight").

## 🧪 Phase 5: Final Verification & QA
The "Lead Architect" Review.

- [x] ~~5.1 Edge Case Stress Test:~~
    - [x] ~~Test: Try to build a "Mullet" setup (Road shifters, MTB derailleur). Does it pass ONLY with the correct adapter logic?~~
    - [x] ~~Test: Try to put a 29" wheel on a 650b frame.~~
    - [x] ~~Test: Try to mix SRAM Shifters with Shimano Derailleurs.~~
- [x] 5.2 Performance Profiling:
    - [x] Ensure validation runs in under 100ms on every state change. (Added performance logging)
- [x] 5.3 Code Review:
    - [x] Verify no "Magic Strings" are used (Everything must reference the standards.ts Enums).