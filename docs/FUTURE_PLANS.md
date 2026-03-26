# CrankSmith Future Plans

## Vision

To be the ultimate cyclist tool for road, gravel, and MTB enthusiasts — the go-to app for gear nerds, weight weenies, and anyone who wants to optimize their ride. We don't compete with GPS giants like Garmin and Strava. They track your rides; we optimize your bike before you clip in.

---

## Strategic Positioning

### We Are:
- The ultimate **equipment optimization** platform
- The weight weenie's digital scale
- The drivetrain nerd's laboratory
- The tire pressure oracle
- The place cyclists go to obsess about gear without judgment

### We Are NOT:
- A GPS tracker (Strava, Garmin)
- A training platform (TrainerRoad, Zwift)
- A social network
- A bike shop (though affiliate revenue is fair game)

### Critical Success Factors:
1. **Data Integrity** — Our platform lives or dies by accurate weights and compatibility specs. New standards emerge monthly; we need robust data maintenance.
2. **Speed** — Faster than building a full bike. Quick tools for quick answers.
3. **Shareability** — Every calculation should generate a clean image for forum debates and group chat arguments.

---

## Dashboard / Homepage

**Goal:** Clean, focused navigation. Four cards. Get users to value in one tap.

### Core Navigation:
1. **Gear Metrics** — The Drivetrain Lab
2. **Weight Weenies** — The Scale
3. **Start a New Build** — The Workshop
4. **Tire Pressure Calc** — The Contact Patch

### Dashboard Features:
- [ ] Quick-access cards with discipline icons (Road/Gravel/MTB)
- [ ] "Recent Activity" — last 3 calculations/builds
- [ ] "My Garage" quick access (saved bikes)
- [ ] Discipline context selector (affects defaults across all tools)
- [ ] Dark/light mode

---

## 1. Gear Metrics (The Drivetrain Lab)

**Purpose:** Faster than building a bike. Focus solely on crankset, cassette, and wheel size. Answer the eternal questions: "Would I be faster?" and "Can I still climb?"

### Core Experience: Side-by-Side Comparison
The primary view is **Setup A vs Setup B**. Everything flows from comparison.

### Input (Per Setup):
- [ ] Chainring(s): 1x or 2x with tooth counts
- [ ] Cassette: Brand/model or manual tooth range
- [ ] Wheel size: 700c, 650b, 29", 27.5", etc.
- [ ] Tire width (affects actual diameter)

### Visualizations (Charts Over Spreadsheets):

#### Speed vs Cadence Graph
- [ ] Two overlaid lines showing speed at each RPM
- [ ] Highlight crossover points
- [ ] Quick-look stats: Speed at 90rpm (cruising), 110rpm (sprinting) in biggest gear

#### Gear Ratio Chart (Visual Grid)
- [ ] Horizontal bars for each gear combination
- [ ] **Percentage jump between shifts** — "That 15t→17t jump is a 13% change"
- [ ] Color-coded overlap/gaps between setups
- [ ] Dead zone detection in preferred cadence range

#### Development Visualization
- [ ] Meters traveled per pedal revolution (not just ratios)
- [ ] Visual comparison of "pedal effort" across gears

### The Climbing Reality Check:

- [ ] **Minimum Development Display** — Meters per pedal stroke in easiest gear
- [ ] **Gradient Capability Slider** — Input: rider weight + sustainable watts → Output: max gradient at target cadence (reuse logic from builder)
- [ ] **"Can I Make It?" Calculator** — Select a gradient, see required watts to maintain 75rpm
- [ ] Quick presets: "Local Climb" (user saves their nemesis gradient)

### Speed Analysis:
- [ ] Top speed potential at max sustainable cadence
- [ ] "What gear for 45kph at 95rpm?" reverse calculator
- [ ] Optimal gear suggestions for target speeds

### Share Features:
- [ ] **"Share My Lab Results"** — Clean comparison graphic
- [ ] Optimized for cycling forums, Reddit, group chats
- [ ] Include QR code linking back to interactive comparison
- [ ] Export to PDF for bike shop discussions

### Integration:
- [ ] "Build This Setup" → Pre-populate bike builder with selected drivetrain
- [ ] Compatibility warnings (derailleur capacity, chainring clearance)

---

## 2. Weight Weenies (The Scale)

**Purpose:** Gamify the gram obsession. A digital workshop scale that answers: "How much lighter?" and "Is it worth the money?"

**Design Philosophy:** Clean, focused, terrifying. Make the cost-per-gram the hero. Feel like a digital scale display.

---

### Core Experience: Baseline vs Target

Users start with a **baseline build** (import from builder or manual entry) and simulate upgrades in real-time.

---

### The 5 Core Features (In Priority Order):

#### 1. Baseline Build Entry ✅ MVP Phase 1
**Two entry methods:**
- [ ] **Import from saved build** — One-click from Builder/Garage
- [ ] **Manual entry** — Quick component picker with search

**Display after entry:**
- [ ] Big, bold total weight (digital scale aesthetic: neon green on dark)
- [ ] Category breakdown with percentages:
  - Frame & Fork
  - Wheels & Tires ⚡ (rotating weight indicator)
  - Drivetrain ⚡
  - Cockpit
  - Finishing Kit
  - Accessories
- [ ] Simple visual: Pie chart OR horizontal bars (not both - keep it clean)

#### 2. Cost Per Gram Saved — THE STAR FEATURE ✅ MVP Phase 1
**The Sacred Metric:** Every upgrade shows **$X per gram saved**

**Color-coded $/gram ratings:**
- 🟢 Under $1/gram — "Unicorn deal"
- 🟡 $1-5/gram — "Reasonable"
- 🟠 $5-10/gram — "Getting expensive"
- 🔴 $10+/gram — "Madness territory"

**Upgrade Simulator Interface:**
- [ ] Split view: Current Build (left) vs. Upgrade Options (right)
- [ ] Click any component → See lighter alternatives sorted by $/gram
- [ ] Each option shows:
  - Component name
  - Weight saved (e.g., "-400g")
  - Cost added (e.g., "+$1,800")
  - $/gram metric with color code
  - [Add to Target Build] button
- [ ] Rotating weight components marked with ⚡ icon

#### 3. Live Running Totals (The Terror Display) ✅ MVP Phase 1
**Sticky panel (always visible at top or bottom):**

Shows real-time updates as upgrades are added:
- [ ] **Baseline weight → Target weight**
- [ ] **Weight saved** (green, celebrates the wins)
- [ ] **Cost added** (RED, big and scary — "likely terrifying them")
- [ ] **Average $/gram** across all upgrades (color-coded)
- [ ] Action buttons: [Reset] [Save Target Build] [See Quick Wins]

**Example:**
```
BASELINE: 7,450g  →  TARGET: 6,800g
Weight Saved: -650g 💪
Cost Added: +$3,150 😱
$/gram avg: $4.85/gram 🟡
```

Numbers animate smoothly when changed. Haptic feedback on mobile.

#### 4. Rotating Weight Focus ⚡ ✅ MVP Phase 2
**Separate highlighted section for high-impact components:**

- [ ] Special callout panel for: Wheels, Tires, Tubes, Cassette, Rotors
- [ ] Educational tooltip: "Rotating weight matters ~2x for acceleration and climbing"
- [ ] Show total rotating weight as % of bike
- [ ] Show "effective weight penalty" calculation
- [ ] When rotating weight upgraded, show special message:
  - "✅ Upgraded wheels: -400g → Real impact: ~800g equivalent! ⚡"
- [ ] Suggest focusing rotating weight upgrades first

**Visual treatment:**
- ⚡ icon next to all rotating components
- Highlighted/different background color
- "Start here" nudge for first-time users

#### 5. "Quick Wins" Calculator 🎯 ✅ MVP Phase 2
**One-click button: [🎯 Show Me Quick Wins]**

Opens a panel showing:
- [ ] **Easiest/cheapest ways to drop 100g** based on current build
- [ ] Algorithm scans for:
  - Components that are "heavy for category"
  - Low-cost, high-impact swaps
  - Best $/gram opportunities under $100
- [ ] Displays top 5-10 suggestions sorted by $/gram
- [ ] Each suggestion shows:
  - Component name and upgrade
  - Weight saved
  - Cost
  - $/gram rating with color
  - [Add This] button
- [ ] Shows combined impact if user does multiple quick wins
- [ ] **Filter by budget:** [Under $50] [Under $100] [Under $250] [Sky's Limit]

**Example suggestions:**
- TPU Tubes: -120g for $60 ($0.50/gram) 🟢
- Carbon Bottle Cages: -50g for $40 ($0.80/gram) 🟢
- Ti Seatpost Clamp: -35g for $25 ($0.71/gram) 🟢
- Lighter Saddle: -80g for $160 ($2.00/gram) 🟡

---

### Visual Design (The "Scale" Aesthetic):

**Color Scheme:**
- [ ] Dark background (workshop table black/charcoal)
- [ ] Weight numbers: Neon green (digital scale LED display)
- [ ] Cost numbers: Bright red (danger/warning)
- [ ] Good $/gram: Green highlights
- [ ] Bad $/gram: Red/orange/purple gradients

**Typography:**
- [ ] Weight numbers: Monospace, bold, large (digital scale font)
- [ ] Cost numbers: Bold, attention-grabbing
- [ ] Body text: Clean sans-serif

**Animations:**
- [ ] Weight drops: Number animates down with green flash/pulse
- [ ] Cost rises: Number animates up with red pulse
- [ ] Smooth transitions when adding/removing upgrades
- [ ] Haptic feedback on mobile for milestone moments

**Mobile Optimizations:**
- [ ] Terror display sticky at top (always visible)
- [ ] Swipe to switch baseline/target views
- [ ] Bottom sheet for upgrade options
- [ ] Large touch targets
- [ ] Quick Wins as expandable panel

---

### User Flow:

**Step 1: Landing**
```
━━━━━━━━━━━━━━━━━━━━━━━━━
  THE SCALE
  How heavy is your bike?
━━━━━━━━━━━━━━━━━━━━━━━━━

[Import from Builder]
or
[Enter Manually]
```

**Step 2: Baseline Displayed**
- Shows weight breakdown
- Big total weight number
- Category percentages
- Buttons: [🎯 Quick Wins] [⚡ Optimize Rotating] [🔧 Start Upgrading]

**Step 3: Upgrade Simulator**
- Split view: Current vs. Options
- Click component → See upgrades sorted by $/gram
- Add to target → Numbers update live in Terror Display

**Step 4: Review & Save**
- Summary of all upgrades
- Before/after comparison
- Total cost breakdown
- [Save Target Build] [Share Results] [Start Over]

---

### Optional Enhancements (Phase 3+):

#### Reality Check Toggle (Optional Humor)
- [ ] "Brutal Truth Mode" toggle
- [ ] Shows occasional reality checks:
  - "That's $4.85/gram. A nice dinner costs less."
  - "Skipping breakfast saves 500g for $0"
  - "Training for 2 months > $2,000 in upgrades"
- [ ] User can turn off if they don't want sass

#### Weight Category Badge (Subtle)
- [ ] Small badge display: "Sub-7kg Club 🏆" or "UCI Legal ✅"
- [ ] Not prominent, just a nice touch at top corner
- [ ] Categories:
  - Featherweight (<6.8kg)
  - UCI Legal (6.8kg)
  - Climbing Machine (<7.5kg)
  - Enthusiast (7.5-9kg)
  - Tank (>9kg)

#### Share Graphics
- [ ] Generate clean before/after card
- [ ] Shows: Weight saved, cost added, $/gram avg
- [ ] Optimized for Reddit, forums, Instagram
- [ ] "I saved 650g for $3,150" headline

#### "Are You Sure?" Moment
- [ ] When total cost exceeds threshold ($5k? $10k?)
- [ ] Popup: "😱 That's $8,500. Last chance to reconsider."
- [ ] Just for fun, easy to dismiss

---

### Data Structure:

**Baseline Build:**
```typescript
{
  id: string;
  name: string;
  components: [
    {
      category: 'wheels' | 'frame' | 'fork' | 'tires' | 'cassette' | ...;
      component_id: string;
      name: string;
      weight: number;
      cost: number;
      is_rotating: boolean;
    }
  ];
  total_weight: number;
  total_cost: number;
}
```

**Target Build (Upgrade Simulation):**
```typescript
{
  baseline_id: string;
  upgrades: [
    {
      category: string;
      old_component_id: string;
      new_component_id: string;
      weight_saved: number;
      cost_added: number;
      cost_per_gram: number;
      is_rotating: boolean;
    }
  ];
  new_total_weight: number;
  total_weight_saved: number;
  total_cost_added: number;
  avg_cost_per_gram: number;
}
```

---

### Implementation Phases:

**Phase 1: MVP (Core Functionality)**
Priority: Weeks 1-2
- [x] Page layout and routing (/weight)
- [ ] Baseline entry (import from builder)
- [ ] Manual component picker
- [ ] Weight breakdown display
- [ ] Upgrade simulator interface
- [ ] Component search and filter
- [ ] Cost per gram calculation with color coding
- [ ] Live running totals (Terror Display)
- [ ] Save target build

**Phase 2: Smart Features (Intelligence Layer)**
Priority: Week 3
- [ ] Quick Wins algorithm and display
- [ ] Rotating weight highlighting and special treatment
- [ ] Budget filters in Quick Wins
- [ ] "Optimize Rotating Weight" filter
- [ ] Integration with Garage (save/load builds)

**Phase 3: Polish & Delight (User Experience)**
Priority: Week 4
- [ ] Animations and transitions
- [ ] Haptic feedback on mobile
- [ ] Share graphics generation
- [ ] Reality check toggle (optional humor)
- [ ] Weight category badges
- [ ] Mobile optimizations and gestures

**Phase 4: Community & Data (Future)**
- [ ] User-submitted verified weights
- [ ] Component database expansion
- [ ] Photo uploads of components on scales
- [ ] Upvote/verification system

---

### Success Metrics:

**User Engagement:**
- % of users who import vs. manual entry
- Average # of upgrades simulated per session
- % who save target build
- % who use Quick Wins feature

**Product Value:**
- Average weight saved in simulations
- Average cost added
- Most popular upgrade categories
- $/gram distribution (are users making smart choices?)

**Technical:**
- Page load time <1s
- Component search response <100ms
- Smooth 60fps animations

---

### Key Differentiators:

What makes this better than a spreadsheet:
1. **Visual & Interactive** — See impact immediately, not just numbers
2. **Cost per gram front and center** — The ultimate reality check
3. **Quick Wins intelligence** — AI suggests best opportunities
4. **Rotating weight education** — Most users don't know this matters
5. **Terror Display** — Makes cost visceral and real
6. **Mobile-friendly** — Use at bike shop or on couch

---

**Design Principle:** Keep it focused. Cost per gram is king. Everything else supports that one brutal, beautiful metric.

---

## 3. Start a New Build (The Workshop)

**Purpose:** The comprehensive bike builder — already exists. Enhance with tight integration to other tools.

### Enhancements:

#### Tool Integration
- [ ] **Gear Metrics Panel** — Show gearing analysis inline during drivetrain selection
- [ ] **Weight Tracker** — Running weight total as parts are added
- [ ] **Tire Pressure Preview** — Based on selected tires/rims, show estimated pressure range

#### Build Modes
- [ ] **Dream Build** — No budget, best parts, weight optimized
- [ ] **Budget Build** — Set max spend, suggest value alternatives
- [ ] **Clone a Pro Build** — Templates from pro team bikes

#### Optimization Assistant
- [ ] "Optimize" button that suggests:
  - Lighter alternatives within 10% price
  - Better value alternatives (more savings, less $/gram)
  - Compatibility improvements

#### Build Templates
- [ ] Climbing Build (weight focused)
- [ ] Aero Build (time trial/tri focused)
- [ ] Endurance Build (comfort focused)
- [ ] Gravel Adventure Build
- [ ] XC Race Build
- [ ] Enduro Build

---

## 4. Tire Pressure Calculator (The Contact Patch)

**Purpose:** Beat SRAM and Silca calculators with more nuance. Because 2 PSI changes everything.

### Core Philosophy:
- Don't give one number. Give a **range with a slider**.
- Always separate **front vs rear**.
- Account for **actual measured width**, not stated width.

### Inputs:

#### Rider & Bike
- [ ] System weight (rider + bike + gear/kit)
- [ ] Weight distribution slider (default 45% front / 55% rear)

#### Tire Details
- [ ] **Stated tire width** (what's on the sidewall)
- [ ] **Internal rim width** — Auto-calculate actual mounted width
- [ ] **Measured width option** — For obsessives who've measured
- [ ] Tire type: Tubeless, Tubed, Tubular
- [ ] **Casing suppleness (TPI)** — 60 TPI tank vs 320 TPI supple cotton

#### Conditions
- [ ] Discipline: Road / Gravel / MTB

**Road Scenarios:**
- [ ] Smooth tarmac
- [ ] Rough/chip seal
- [ ] Wet roads
- [ ] Mixed quality

**Gravel Scenarios:**
- [ ] Champagne gravel (fast hardpack)
- [ ] Chunky flint (Unbound-style)
- [ ] Loose over hard
- [ ] Mud/wet
- [ ] Mixed adventure

**MTB Scenarios:**
- [ ] XC race (speed priority)
- [ ] Trail (balanced)
- [ ] Enduro (grip + rim protection)
- [ ] Wet roots/rocks
- [ ] Loose over hardpack

### Output: The Range Slider

Instead of one number, show:
```
MAX SPEED: 42 psi ←————●————→ MAX GRIP: 36 psi
                 Recommended: 39 psi
```

- [ ] **Speed optimized** — Minimum rolling resistance, pinch flat risk warning
- [ ] **Grip optimized** — Maximum contact patch, cornering confidence
- [ ] **Balanced** — Best all-around (default position)
- [ ] User can drag slider to preference

### Front/Rear Split
- [ ] Always display separate recommendations
- [ ] Explain why (weight distribution, steering vs traction)
- [ ] Typical: Front 2-4 psi lower than rear

### Advanced Adjustments:
- [ ] Temperature compensation (hot = +2-3 psi baseline)
- [ ] Altitude adjustment
- [ ] Tire brand/model specific data (if available)

### Risk Indicators:
- [ ] **Pinch flat risk** — Warning when too low for rim/tire combo
- [ ] **Rim damage risk** — For MTB, when too low for terrain
- [ ] **Comfort penalty** — When too high for conditions

### Presets & Saving:
- [ ] Quick presets: Race Day, Training, Adventure, Wet Weather
- [ ] Save custom setups per bike
- [ ] "My Sunday group ride" / "Race day" / "Gravel century" profiles

### Educational Content:
- [ ] "Why this pressure?" expandable explanations
- [ ] Rolling resistance vs pressure charts
- [ ] Tire pressure myths debunked
- [ ] "What if I went 2mm wider?" comparison

### Integration:
- [ ] Pull tire/rim data from saved builds
- [ ] Suggest tire width changes based on rim

---

## 5. My Garage (User Profile & Build Storage)

**Purpose:** Serious cyclists have N+1 bikes. Give them a home for their obsession.

### Features:

#### Multiple Saved Builds
- [ ] Store unlimited bikes: "Dream Gravel Rig," "Current Road Bike," "MTB Project"
- [ ] Quick-switch between bikes in all tools
- [ ] "Active bike" selector affects tool defaults

#### Per-Bike Storage
- [ ] Complete parts list
- [ ] Weight breakdown
- [ ] Gearing summary
- [ ] Tire pressure presets
- [ ] Photos (optional)

#### Upgrade Tracking
- [ ] Mark current parts vs "want to upgrade"
- [ ] Wish list with price tracking
- [ ] "Upgrade cost remaining" calculator

#### History
- [ ] Past builds / deleted bikes archive
- [ ] "Evolution of my build" timeline

### Account Features:
- [ ] Cloud sync across devices
- [ ] Export build data (JSON/CSV)
- [ ] Share public build profiles

---

## 6. Reverse Compatibility Checker

**Purpose:** "I have a frame. What fits it?"

### The Problem:
Current flow: Pick parts → Make a bike.
Many users: Already have a frame/wheelset → Want to know options.

### Features:

#### Frame-First Mode
- [ ] Select frame (brand/model/year)
- [ ] Show ALL compatible: Bottom brackets, headsets, seatposts, etc.
- [ ] Filter by budget, weight, brand preference

#### Component-First Mode
- [ ] "I have this wheelset. What frames accept it?"
- [ ] "I have this crankset. What bottom brackets work?"

#### The Use Case:
> "I have a 2021 Specialized Tarmac SL7 frame. Show me every bottom bracket and headset that fits this specific frame."

---

## 7. The Visualizer (Future)

**Purpose:** Cyclists are vain. Data matters, but aesthetics seal the deal.

### MVP: Color Matching Panel
- [ ] Side-by-side swatches: Frame color, bar tape, saddle, tire sidewalls
- [ ] "Does tan wall clash with my blue frame?" instant check
- [ ] Color harmony suggestions

### Future State: Build Preview
- [ ] 2D composite image generation
- [ ] Silhouette with color overlays
- [ ] Shareable "this is my dream build" visuals

---

## 8. Community & Data Crowdsourcing

**Purpose:** Turn users into the data team. Scale data maintenance.

### User Contributions:

#### Weight Verification
- [ ] "Submit Real Weight" — Photo of part on scale
- [ ] Community voting/verification
- [ ] "Verified by X users" badge
- [ ] Discrepancy alerts when claimed ≠ measured

#### Compatibility Reports
- [ ] "Report an Error" button on every part listing
- [ ] "This derailleur doesn't actually clear 36t despite specs"
- [ ] Crowdsourced compatibility exceptions

#### Community Trust System
- [ ] Contributor reputation scores
- [ ] "Trusted Contributor" badges
- [ ] Weighted voting based on reputation

### Data Quality:
- [ ] Manufacturer data as baseline
- [ ] Community corrections overlaid
- [ ] Transparent sourcing: "Manufacturer claimed" vs "Community verified (n=12)"

---

## Future Ideas (Phase 4+)

### Fit Calculator
- Stack/reach comparisons
- Stem length/angle impact
- "Will this frame fit me?" quick check

### Maintenance Tracker
- Component lifespan tracking
- Service reminders
- Chain wear estimator

### Ride Fuel Calculator
- Calorie/carb planning
- Hydration recommendations
- Bonk prevention

### Local Climb Database
- User-submitted climbs with gradients
- Integrates with Gear Metrics
- "What gearing for Mt. Lemmon?"

### Cost Per Ride Calculator
- Total bike cost ÷ rides
- The ultimate partner justification tool
- "It's only $1.50 per ride now, honey"

---

## Monetization Strategy (Implicit)

### Near-Term:
- [ ] Affiliate links on all part recommendations
- [ ] "Buy this part" → Commission from retailers

### Medium-Term:
- [ ] Premium tier for:
  - Unlimited saved builds
  - Advanced comparison features
  - Priority data access
  - No ads

### Long-Term:
- [ ] API access for bike shops/manufacturers
- [ ] White-label builder for bike brands
- [ ] Sponsored "pro build" templates

---

## Design Principles

1. **Mobile-first** — Trailside and bike shop usage
2. **Instant** — Sub-second calculations
3. **Visual** — Charts over spreadsheets
4. **Shareable** — Every output generates a clean graphic
5. **Educational** — Explain why, not just what
6. **Honest** — Show real weights, real costs, real tradeoffs
7. **Fun** — This is passion; make it enjoyable

---

## Priority Roadmap

### Phase 1: Foundation (Dashboard + Quick Tools)
- [ ] Dashboard redesign with 4-card navigation
- [ ] Gear Metrics MVP (comparison + climb check)
- [ ] Tire Pressure Calculator MVP (range slider + scenarios)

### Phase 2: Weight + Garage
- [ ] Weight Weenies MVP (baseline + upgrade simulator)
- [ ] My Garage (multi-bike storage)
- [ ] Integration between all tools

### Phase 3: Share + Community
- [ ] Share graphics generation across all tools
- [ ] Community weight submissions
- [ ] Compatibility error reporting
- [ ] User accounts + cloud sync

### Phase 4: Expansion
- [ ] Reverse compatibility checker
- [ ] Visualizer MVP
- [ ] Additional calculators
- [ ] Premium tier launch

---

## Open Questions

1. **Data sourcing** — Partner with weight databases (e.g., weightweenies.com) or build from scratch?
2. **Account system** — Build custom auth or use social logins?
3. **Mobile app** — Stay web-only or native apps later?
4. **Strava integration** — Import segment data for climb analysis?

---

*This document is a living roadmap. Features prioritized based on user feedback and development capacity.*

**Last Updated:** November 29, 2025
**Version:** 2.0 — Consolidated with strategic feedback
