This document is designed to live in the root of your source control repository (GitHub/GitLab). It serves as the "Source of Truth" for the development team. As features are built, the checkboxes in the Roadmap section should be ticked off.

🚴 VeloForge: Master Project Brief & Documentation

Status: Pre-Alpha | Version: 0.0.1
Target Platform: Web (Responsive) -> PWA (Mobile)
Core Philosophy: "Not a toy. A mechanic’s logic engine."

1. The Mission

To build the definitive bicycle configuration tool for performance cyclists (Road, Gravel, MTB). Unlike manufacturer configurators, VeloForge is brand-agnostic and focuses on technical interoperability.

Key Capabilities:

Deep Compatibility: Validating mix-and-match builds (e.g., "Mullet" drivetrains, Road shifters with MTB derailleurs).

Physics & Metrics: Real-time calculation of weight, gear ratios (gear inches), and speed-at-cadence.

Strict Validation: If it doesn't work in the workshop, it doesn't work in the app.

2. Technical Stack
Frontend (The Client)

Framework: Next.js (React) - Chosen for SEO and seamless PWA transition.

State Management: Zustand or Redux Toolkit - Required to manage the complex "Current Build" object.

Styling: Tailwind CSS - Clean, data-heavy UI.

Visualization: Recharts (for Gearing/Speed graphs).

Backend (The Brain)

Runtime: Node.js with TypeScript.

API: REST + GraphQL (for complex nested queries).

Logic Engine: Custom Middleware focusing on "Handshake Protocols" (see Section 4).

Database (The Truth)

Core DB: PostgreSQL.

ORM: Prisma (for type-safe database access).

Caching: Redis (essential for fast parts filtering).

3. Database Schema Strategy (The "Standards Dictionary")

Before parts are added, the Standards must be defined. These are the Enums that drive compatibility logic.

Key Entities & Attributes

Frame (Root Object):

axle_standard (e.g., 12x142, 12x148 Boost, 12x157)

bb_interface (e.g., BSA, T47_internal, PF30)

brake_mount (e.g., Flat Mount, Post Mount 160)

max_tire_width (mm)

seatpost_diameter (mm)

udh_compatible (boolean)

cable_routing_type (External, Internal, Integrated_ACR)

Drivetrain (The Matrix):

speeds (11, 12, 13)

actuation_ratio (e.g., Shimano_Road_11, SRAM_Exact_Actuation, SRAM_AXS)

cassette_mount (HG, XD, XDR, MicroSpline)

chainline_min / chainline_max

4. The "Handshake" Logic Protocols

The dev team must implement these logic gates.

A. The Axle Gate

IF Frame.axle != Wheel.axle THEN Incompatible
(Exception logic: Check for Endcap Adapters table)

B. The Drivetrain Gate (The "Mullet" Rule)

To allow SRAM AXS mixing:
IF Shifter.protocol == "SRAM_AXS" AND Derailleur.protocol == "SRAM_AXS" THEN Compatible = TRUE
(Even if Shifter is "Road" and RD is "MTB")

C. The Capacity Gate

RD.max_tooth MUST BE >= Cassette.largest_cog
RD.capacity MUST BE >= (Cassette.diff + Chainring.diff)

5. Development Roadmap (Living Document)
Phase 0: Architecture & Data Ingestion

0.1 Initialize Next.js Repo with TypeScript.

0.2 Setup PostgreSQL instance and Prisma Schema.

0.3 CRITICAL: Populate the Standards tables (The list of all BBs, Axles, Mounts).

0.4 Build script to ingest dummy data (Seed 10 frames, 20 wheels, 5 groupsets).

Phase 1: The Core Logic API (Backend)

1.1 Create Endpoint: POST /validate/frame-wheel (Checks Axle & Tire Clearance).

1.2 Create Endpoint: POST /validate/frame-bb-crank (The triangular check of Shell vs. BB vs. Spindle).

1.3 Create Endpoint: POST /validate/drivetrain (Shifter -> RD -> Cassette compatibility).

1.4 Unit Tests: Write Jest tests for "Known Bad" combos (e.g., Boost wheel on Road frame).

Phase 2: The Builder UI (MVP)

2.1 Build Layout: Sidebar (Current Build) + Main Area (Part Selector).

2.2 State Management: Implement addToBuild action with automatic API validation call.

2.3 Filtering: If Frame is selected, GET /parts/wheels should only return compatible wheels.

2.4 Weight Tally: Real-time summation of part.weight_g.

Phase 3: Performance Metrics (The "Serious Cyclist" Features)

3.1 Implement "Cadence Slider" UI Component (60-120 RPM).

3.2 Build Math Engine:

calcSpeed(gearRatio, wheelCircumference, cadence)

calcClimbingIndex(lowestGearRatio)

3.3 Visualization: Render Gear Ratio Chart (Chainring vs Cassette Cogs).

Phase 4: Export & PWA

4.1 Config manifest.json for PWA installability.

4.2 Service Workers: Cache parts DB for offline tinkering.

4.3 Export Feature: Generate "Mechanic's Build Sheet" (PDF/CSV).

4.4 Small Parts Logic: Auto-suggest Valves, Sealant, and Bar Tape if missing.

6. Testing & Quality Assurance

The "Strict Mode" Rule:
The app defaults to Strict Mode. If a combination requires a "hack" or functions poorly (e.g., exceeding RD capacity by 2 teeth), it must flag a Red Warning.

Manual Test Cases:

The Weight Weenie: Aethos Frame + Darimo Post + THM Clavicula Cranks. (Does it fit?)

The Monster Gravel: Evil Chamois Hagar + SRAM Eagle + Enve Dropper. (Do cables route?)

The Old School: Rim Brake frame validation (Ensure Disc wheels are blocked).

7. Future Features (Backlog)

Geometry Geeks API Integration: Visual overlay of bike fit.

Price Scraper: Live pricing from major retailers.

User Accounts: "Garage" feature to save multiple builds.

Wattage Savings: Estimated aero drag coefficient (Requires wind tunnel data integration - Long term goal).

Appendix A: Data Schema Logic (The "Rosetta Stone")
Note to Developers: This project relies on an "Interface Matching" architecture, not a direct Parent-Child relationship.
1. The "Interface" Concept
We do not match parts to parts. We match parts to Interfaces.
We need a database table called Interfaces that acts as the standard setter.
Example Interfaces Table Entries:
INT_001: BSA_Threaded_68mm (Frame Shell)
INT_002: PF30 (Frame Shell)
INT_003: 24mm_Spindle (Crank Input)
INT_004: DUB_Spindle (Crank Input)
INT_005: Flat_Mount_Brake (Frame/Fork Mount)
INT_006: Post_Mount_Brake (Frame/Fork Mount)
2. The Component Attribute Structure (JSONB)
Components should have a compatibility_profile JSON column. This allows flexibility without altering table structure for every new standard.
Example: Specialized Tarmac SL7 Frame
code
JSON
{
  "component_type": "Frame",
  "name": "S-Works Tarmac SL7",
  "interfaces": {
    "bottom_bracket_shell": "BSA_Threaded_68mm",
    "rear_axle": "12x142mm",
    "brake_mount_rear": "Flat_Mount",
    "seatpost_shape": "Proprietary_Tarmac_SL7",
    "headset_upper": "IS41",
    "headset_lower": "IS52"
  },
  "constraints": {
    "max_tire_width_mm": 32,
    "min_rotor_size_rear": 140,
    "max_rotor_size_rear": 160
  }
}
Example: SRAM Red Crankset
code
JSON
{
  "component_type": "Crank",
  "name": "SRAM Red AXS Power Meter",
  "interfaces": {
    "spindle_type": "DUB_Spindle",
    "chainline": "45mm",
    "pedal_thread": "Standard_9/16"
  }
}
3. The "Bridge" Logic (The Missing Link)
This is the logic the backend needs to solve.
User has Frame: BSA_Threaded_68mm
User selects Crank: DUB_Spindle
System Query: SELECT * FROM Components WHERE type = 'Bottom_Bracket' AND interface_input = 'BSA_Threaded_68mm' AND interface_output = 'DUB_Spindle'
Result: SRAM DUB BSA Bottom Bracket.
4. The "Admin Panel" Requirement
To the Dev Team:
Before we can build the User-Facing App, we must build an Internal Admin Dashboard.
We cannot populate this database via SQL scripts; it’s too risky. We need a UI for our "Data Entry Specialist" that allows them to:
Create a new Component.
Select its Interfaces from dropdowns (defined in the Interface table).
Crucial: If a new standard comes out (e.g., "T-Type" Mount), the Admin must be able to create that new Interface definition without a code deploy.
Why adding this Appendix fixes the problem:
It solves the "How do I build the DB?" question: You've just told them to use a flexible JSON structure for attributes rather than hard columns (which is essential because frames have different attributes than wheels).
It highlights the Hidden Product: You pointed out the need for an Admin Panel. Most non-technical founders forget this. If you don't ask for it, the devs won't build it, and you'll have no way to put parts into your app without writing code.

This document outlines the UI/UX Strategy and Frontend Build Plan. It is designed to guide the Product Designer and Frontend Developers.

Core Design Philosophy: "The Cockpit."
The interface should feel like a professional instrument (e.g., Bloomberg Terminal, CAD software), not an e-commerce store. Information density is high. Whitespace is used for grouping, not for "airiness."

1. UI/UX Design Specification
A. Visual Language (The "Skin")

Theme: "Dark Mode" default (Technical, premium feel, reduces eye strain during long sessions).

Background: Deep Slate (#0f172a)

Panels: Carbon (#1e293b)

Accents:

Safe/Compatible: Signal Green (#10b981)

Warning/Strict Mode: Amber (#f59e0b)

Critical/Incompatible: Rose Red (#f43f5e)

Typography:

Headings/Labels: Sans-serif (Inter or Roboto) - Clean, readable.

Data/Metrics: Monospace (JetBrains Mono or Roboto Mono) - Essential for tabular data (Weight, Gear Ratios) to align perfectly.

B. The Layout Strategy (Desktop)

The "Three-Column Dashboard"

Column 1: The Manifesto (Left Sidebar - 25%)

Purpose: The current state of the build.

Behavior: Sticky (Always visible).

Content:

List of component slots (Frame, Fork, BB, Crank, etc.).

Filled slots show the Part Name + Weight.

Empty slots show "Select [Part Name]".

Total Weight (Large, bold, at the bottom).

Column 2: The Workbench (Center - 50%)

Purpose: Selection and Search.

Behavior: Scrollable.

Content:

Search Bar: "Search for SRAM Red..."

Smart Filters: (Auto-applied based on Frame selection).

Example: If Frame is Boost, the "Boost" filter is locked to ON.

Part List View: Dense rows, not giant cards.

Columns: Image (Thumbnail) | Name | Tech Spec (e.g. "30mm Spindle") | Weight | Price | "Add" Button.

Column 3: The Telemetry (Right Sidebar - 25%)

Purpose: Real-time physics and math.

Behavior: Sticky or Collapsible.

Content:

The Cadence Slider: A UI slider (60rpm - 120rpm).

Speed Table: Shows speed in Top Gear and Low Gear based on the slider.

Climbing Ratio: Calculated value (e.g., "0.85" - Hard / "1.2" - Easy).

Component Notes: "Note: This RD requires a B-Gap adjustment tool."

C. The Layout Strategy (Mobile PWA)

The "Stack & Modal" Approach

Main View: The Manifesto (The Build List).

Tap a slot (e.g., "Bottom Bracket") -> Opens Full Screen Modal for selection.

The Modal (The Workbench):

Search and Filter parts.

Tap to Select -> Closes Modal -> Updates Main View.

The Sticky Footer:

Shows "Total Weight" & "Total Price".

"Analyze" Button -> Opens the Telemetry Overlay (Charts/Graphs).

2. Key User Interactions (UX Flows)
Flow 1: The "Smart" Filter (The Compatibility Guardrails)

Action: User has selected a BSA Threaded Frame.

Action: User clicks "Add Bottom Bracket."

System Response:

The BB list loads.

UX Logic: The system automatically filters out PressFit, BB30, and T47.

Visual: A tag appears at top: "Showing only BSA Compatible units."

Override: User can toggle "Show Incompatible" -> Parts appear but are grayed out with a Red Warning Icon.

Flow 2: The "Conflict" Alert

Scenario: User tries to force a mismatch (e.g., Mechanical Shifters with Electronic RD).

Action: User clicks "Add".

System Response:

Pop-up Modal (The "Mechanic's Warning"):

Header: "Compatibility Breach"

Body: "You have selected Mechanical Shifters and an Electronic Derailleur. These cannot communicate."

Option A: "Cancel"

Option B: "Add Anyway (I am using a custom adapter)" -> Adds part with a permanent Red Flag on the build list.

Flow 3: The "Metric" Feedback Loop

Action: User changes Cassette from 11-28T to 11-34T.

System Response:

Immediate Animation: The "Climbing Ratio" number in the Telemetry sidebar turns Green and increases.

Immediate Animation: The "Weight" number flashes Red and increases by +40g.

3. Frontend Build Plan (Development Roadmap)

Tech Stack: Next.js, Tailwind CSS, Framer Motion (for subtle data transition animations), Recharts (for gearing graphs).

Phase 1: The Design System & Shell (Weeks 1-2)

Goal: Set up the visual language and responsive containers.

Tasks:

Configure Tailwind config.js with the "Slate/Carbon" color palette and Monospace fonts.

Create Layout.tsx: The 3-column responsive grid (Collapsing to 1-column on mobile).

Component Library: Build reusable atoms (Buttons, Badges, SearchInput, PartRow).

Checkpoint: Verify Dark Mode looks good on iPhone and Desktop.

Phase 2: The Manifesto & State Logic (Weeks 3-4)

Goal: Users can see empty slots and the state updates when data is mocked.

Tasks:

Setup Zustand/Redux store for currentBuild.

Build the BuildList component (Left Column).

Create the "Empty Slot" state (dashed outlines).

Create the "Filled Slot" state (Part data display).

Checkpoint: Manually injecting a part into the State should update the UI and the Total Weight.

Phase 3: The Workbench (Selection UI) (Weeks 5-7)

Goal: The core searching and filtering experience.

Tasks:

Build the PartSelector component.

Implement the "Compatibility Filter" UI (The tags that say "Filtered for Boost").

Build the PartDetail modal (Specs, Image, Technical drawings).

Checkpoint: User can click "Add Frame", select a frame, and the App automatically locks the filters for the next step (Wheels).

Phase 4: Telemetry & Visualization (Weeks 8-9)

Goal: The "Serious Cyclist" data layer.

Tasks:

Implement Recharts for the Gear Ratio bar chart.

Build the CadenceSlider component.

Create the MathEngine hook (Calculates speed/ratio on the fly).

Checkpoint: Dragging the cadence slider updates the "Speed at Top Gear" number instantly.

Phase 5: PWA & Polish (Weeks 10-11)

Goal: Mobile optimization and "App" feel.

Tasks:

Implement PWA Manifest (Icon, Splash screen).

Add "Skeleton Loaders" (The gray shimmering lines while database fetches).

Mobile Optimization: Ensure the "Sticky Footer" doesn't cover content.

Checkpoint: Install app on an iPad and phone. Test "Offline Mode" (viewing a cached build).

4. Visual Reference (Mental Image for Designers)

Think: "Stripe Dashboard meets Strava Analysis."

Background: Matte Dark Grey.

Text: Crisp White (High legibility).

Lines: Very thin (1px) borders in dark grey to separate sections.

Numbers: Colored.

Weight: White (Neutral).

Price: Green (Money).

Incompatible: Red.

Images: Parts are shown on a pure white or transparent background, no lifestyle shots.

This plan ensures the frontend team builds a tool that matches the complexity of the backend logic you established in the previous documents.
bump
