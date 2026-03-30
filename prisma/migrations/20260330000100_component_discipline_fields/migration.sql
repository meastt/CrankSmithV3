-- Add discipline taxonomy fields for gravel-only builder gating
ALTER TABLE "Component"
  ADD COLUMN "discipline" TEXT NOT NULL DEFAULT 'multi',
  ADD COLUMN "disciplineTags" TEXT,
  ADD COLUMN "builderEligible" BOOLEAN NOT NULL DEFAULT false;

-- Backfill likely-gravel eligibility from existing normalized category hints in attributes JSON.
-- This is intentionally conservative and can be refined by follow-up curation scripts.
UPDATE "Component"
SET
  "discipline" = CASE
    WHEN LOWER(COALESCE(NULLIF("attributes", ''), '{}')::jsonb ->> 'category') = 'gravel' THEN 'gravel'
    WHEN LOWER(COALESCE(NULLIF("attributes", ''), '{}')::jsonb ->> 'category') = 'road' THEN 'road'
    WHEN LOWER(COALESCE(NULLIF("attributes", ''), '{}')::jsonb ->> 'category') IN ('mtb', 'mountain') THEN 'mtb'
    ELSE 'multi'
  END,
  "builderEligible" = CASE
    WHEN LOWER(COALESCE(NULLIF("attributes", ''), '{}')::jsonb ->> 'category') = 'gravel' THEN true
    ELSE false
  END;
