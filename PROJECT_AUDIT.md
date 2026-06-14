# Project Audit & Scalability Notes

Last updated: 2026-06-03

## Scope

This audit covers the frontend structure of Quantix Studio: React/Vite routing, shared UI components, Tailwind/shadcn styling, admin screens, and root documentation. The goal is to keep the project flexible, scalable, reliable, and governed by global styles plus reusable components.

## Current Strengths

- The app already has a clear split between public pages, admin pages, shared components, hooks, Supabase integration, and shadcn/ui primitives.
- The visual system is centralized in `src/index.css` and uses CSS custom properties with Tailwind tokens.
- Admin CRUD screens already share concepts like `PageHeader`, `StatePanel`, `admin-surface`, `table-shell`, and route-level layout via `DashboardLayout`.
- Data access is mostly isolated in hooks, which keeps pages relatively presentation-focused.

## Improvements Applied

- Added semantic global layout classes in `src/index.css`: `page-stack`, `content-stack`, `content-stack-sm`, `content-cluster`, `admin-loading-panel`, `state-panel-icon`, `status-dot`, and `admin-metric-icon`.
- Added `AdminPageShell` to make admin list pages share the same header, primary action, loading state, and accessibility structure.
- Added `AdminMetricCard` to remove repeated dashboard stat-card markup and keep metric cards consistent.
- Updated `PageHeader` to support `titleId`, allowing page shells to connect sections with `aria-labelledby`.
- Updated `StatePanel` and dashboard status rows to use semantic global classes instead of repeated one-off utility clusters.
- Fixed the legacy `/project/:slug` redirect so it preserves the actual slug and routes to `/portfolio/{slug}`.

## Styling Rules

- Keep design tokens and semantic CSS classes in `src/index.css`; do not create parallel global CSS files.
- Prefer global semantic classes for repeated layout patterns, and prefer Tailwind utilities for one-off layout adjustments.
- Use shadcn/ui primitives before custom markup when the pattern already exists.
- Use `gap-*` or semantic stack classes instead of adding new `space-y-*` patterns in feature code.
- Use semantic color tokens like `bg-card`, `text-muted-foreground`, `border-border`, and `text-accent`; avoid raw hex classes in JSX.
- Keep icons decorative with `aria-hidden="true"` unless they carry unique meaning not repeated by text.

## Component Rules

- New admin index/list pages should start with `AdminPageShell`.
- Repeated dashboard stats should use `AdminMetricCard`.
- Empty/loading/error blocks should use shared components like `StatePanel`, `Skeleton`, and existing shadcn feedback primitives.
- Presentational components should not fetch Supabase data directly; use hooks or route/page boundaries for data access.
- Add new shared components only when the repetition is real across at least two screens or when it clarifies an important product pattern.

## Reliability Notes

- `src/App.tsx` now handles the legacy project redirect safely with route params.
- Keep route aliases documented: `/aus` remains a hidden admin alias.
- The Supabase client and `.env` setup are still inconsistent: `client.ts` hardcodes values while env files define `VITE_SUPABASE_*`.
- Generated Supabase types still appear stale compared with migrations; treat migrations as schema truth until types are regenerated.

## Recommended Next Pass

- Normalize Supabase client configuration to either fully use `import.meta.env` or intentionally document the hardcoded production client.
- Regenerate `src/integrations/supabase/types.ts` from the live schema or current migrations.
- Continue migrating repeated page spacing from ad-hoc utility strings to `page-stack` and `content-stack` where it improves clarity.
- Review form modals for consistent field grouping, validation messaging, loading states, and upload error states.
- Verify admin and public routes in browser at desktop and mobile widths after future UI-heavy changes.
