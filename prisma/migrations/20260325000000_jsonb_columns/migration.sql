-- Migration: Convert String JSON columns to JSONB for queryability
-- Safe to run on existing data — casts all stored JSON text to native JSONB.

ALTER TABLE "Component" ALTER COLUMN "interfaces" TYPE JSONB USING interfaces::jsonb;
ALTER TABLE "Component" ALTER COLUMN "attributes" TYPE JSONB USING attributes::jsonb;
ALTER TABLE "SavedBuild" ALTER COLUMN "parts" TYPE JSONB USING parts::jsonb;
