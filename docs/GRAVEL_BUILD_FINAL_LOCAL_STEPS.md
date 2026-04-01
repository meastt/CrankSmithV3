# Final Local Steps for Gravel Builder Refactor

Welcome to `main`! The refactoring PR added several new database fields (for component discipline tracking) and new audit scripts that the previous AI assistant prepared for you. 

Because changes were made to the database schema, you must run the following steps locally to get your environment fully synchronized with the new code.

### Step 1: Install Dependencies
Run this in case any package checksums or dependencies were slightly modified during the merge.
```bash
npm install
```

### Step 2: Apply Database Migrations & Generate Prisma Client
A new migration (`20260330000100_component_discipline_fields`) was merged to add the `discipline` and `builderEligible` capabilities. Apply this to your local database and regenerate the client:
```bash
npx prisma migrate dev
npx prisma generate
```

### Step 3: Run the Local DB Audit Scripts
Now that the schema supports the new gravel-only functionality, the AI provided helpful scripts to audit your existing database parts and saved builds to see how they will be impacted by the rollout.

**Audit builder eligibility (checks for valid gravel parts):**
```bash
npm run db:audit-builder-eligibility
```

**Audit existing user saved builds for legacy components:**
```bash
npm run db:audit-build-migration
```

### Step 4: Verify the Application Locally
Run the local server and navigate to the Builder to verify the new scoped gravel filters.
```bash
npm run dev
```

### Step 5: Rollout Verification
You can also run the rollout gate check that was implemented in Phase 6 to confirm if your metrics are healthy enough to enable the `CRANKSMITH_GRAVEL_BUILDER_ENABLED` feature flag for everyone:
```bash
npm run rollout:check-gates
```

---
*Note: The previous assistant indicated it would create this file, but it seems it either hit a length limit or forgot to include it in the final commit. I've re-synthesized the exact necessary steps for you based on the PR's contents!*
