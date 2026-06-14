# Database Architecture

Last updated: 2026-06-14

## Status

This file previously described the older Supabase project that shipped with this
repo. The connected Supabase project has since been replaced and its live schema
no longer matches the earlier local migration history or generated types.

## Canonical Reference

Use [SUPABASE_LIVE_SCHEMA_AUDIT.md](/Users/eugenepivovarov/Documents/CodexWorkspace/projects/Quantix Lovable/quantix-studio-spark-new-supabase/SUPABASE_LIVE_SCHEMA_AUDIT.md)
as the authoritative root-level documentation for:

- current live tables
- fields and constraints
- foreign key relationships
- RLS behavior
- storage buckets
- schema mismatches between the app and the connected project

## Important Note

Until the repository migrations and generated types are regenerated from the new
project, do not treat `supabase/migrations/` or older schema docs as source of
truth for the active backend.
