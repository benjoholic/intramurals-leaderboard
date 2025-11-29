Run the SQL migration to add the `points_breakdown` JSONB column to your `events` table.

Options:

1) Supabase Console

2) psql (if you have DB connection info)

  psql "postgresql://USER:PASSWORD@HOST:PORT/DATABASE" -f db/migrations/20251130_add_points_breakdown.sql

Notes:
 - The migration uses `IF NOT EXISTS` and will backfill `points_breakdown` from `points` where available. Back up your DB if this is production.
 - A second migration `db/migrations/20251130_add_points_columns.sql` adds three separate integer columns: `points_first`, `points_second`, `points_third` and backfills them from `points_breakdown` or legacy `points`.
 - Run both migrations (first JSONB if you applied it earlier, then the new columns migration). After these run, the API will persist the separate point columns.
 - If you have migrated and verified the new `points_first/points_second/points_third` columns, you can remove the legacy columns using `db/migrations/20251130_drop_legacy_points.sql`.
 - Run order recommendation:
   1. `20251130_add_points_breakdown.sql` (if not already applied) — adds `points_breakdown` JSONB and backfills from `points`.
   2. `20251130_add_points_columns.sql` — adds `points_first/second/third` and backfills from `points_breakdown` or `points`.
   3. Verify the new columns contain expected values in your DB and in the app UI.
   4. `20251130_drop_legacy_points.sql` — drop legacy `points` and `points_breakdown` (only after verification and backup).

Important: Back up your database before running destructive migrations.
 - If you also have the older `points_first/points_second/points_third` columns (legacy naming), you can drop them with `db/migrations/20251130_drop_points_first_columns.sql` after verifying `first_point/second_point/third_point` are correct.
 - Example run order when moving from old names to new: run JSONB (if needed) → `20251130_add_points_columns.sql` (creates `first_point/second_point/third_point`) → verify → `20251130_drop_points_first_columns.sql` (drops `points_first/points_second/points_third`) → `20251130_drop_legacy_points.sql` (drops `points`/`points_breakdown`).
