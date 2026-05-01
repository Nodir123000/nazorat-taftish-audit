-- =============================================================================
-- Миграция: Добавление политик Row-Level Security (RLS) для иерархического управления доступом
-- Дата: 2026-05-01
-- Цель: Реализовать контроль доступа на уровне БД для таблицы rev_plan_year
-- =============================================================================

BEGIN;

-- =============================================================================
-- РАЗДЕЛ 1: Включить Row Level Security на таблице rev_plan_year
-- =============================================================================

-- POLICY: Enable RLS on rev_plan_year table
-- PURPOSE: Enforce hierarchical access control at database level
-- EFFECT: All operations (SELECT, INSERT, UPDATE, DELETE) will be subject to RLS policies
ALTER TABLE "rev_plan_year" ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- РАЗДЕЛ 2: POLICY для SELECT - Просмотр планов
-- =============================================================================

-- POLICY: rls_select_plan_by_authority
-- PURPOSE: Users can view plans created by their authority or lower-priority authorities
-- ALLOWS:
--   - Master (priority_level=1) can view ALL plans
--   - Central (priority_level=2) can view Central and Regional plans
--   - Regional (priority_level=3) can view only Regional plans
--   - Non-exceptional plans are viewable by anyone (fallback condition)
-- DENIES: Lower-priority user viewing higher-priority plan (unless plan is not exceptional)
-- SCENARIO:
--   - User A (Central authority, priority=2) tries to view plan created by Master (priority=1)
--   - Plan is normal (is_exceptional=false)
--   - Result: ALLOWED (fallback condition allows non-exceptional plans)
--   - User B (Regional authority, priority=3) tries to view plan created by Central (priority=2)
--   - Plan is normal (is_exceptional=false)
--   - Result: ALLOWED (fallback condition allows non-exceptional plans)

CREATE POLICY rls_select_plan_by_authority ON "rev_plan_year"
  FOR SELECT
  USING (
    -- Authority hierarchy check: user's priority_level >= plan creator's priority_level
    -- Lower number = higher authority, so >= means "same or lower authority"
    (SELECT COALESCE(c.priority_level, 999)
     FROM "ref_control_authorities" c
     INNER JOIN "users" u ON u.control_authority_id = c.authority_id
     WHERE u.user_id = (current_setting('app.current_user_id', true)::integer))
    >=
    (SELECT COALESCE(c.priority_level, 999)
     FROM "ref_control_authorities" c
     WHERE c.authority_id = "rev_plan_year".control_authority_id)
    OR
    -- Fallback: non-exceptional plans are readable by all authenticated users
    is_exceptional = false
  );

-- =============================================================================
-- РАЗДЕЛ 3: POLICY для INSERT - Создание планов
-- =============================================================================

-- POLICY: rls_insert_plan_by_authority
-- PURPOSE: Users can only create plans for their own authority
-- ALLOWS: User to INSERT a plan only if control_authority_id matches their authority
-- DENIES: Any attempt to create plan for another authority
-- SCENARIO:
--   - User A (authority_id=10) tries to create plan with control_authority_id=10
--   - Result: ALLOWED
--   - User A tries to create plan with control_authority_id=20
--   - Result: DENIED (WITH CHECK violation)

CREATE POLICY rls_insert_plan_by_authority ON "rev_plan_year"
  FOR INSERT
  WITH CHECK (
    control_authority_id = (
      SELECT u.control_authority_id
      FROM "users" u
      WHERE u.user_id = (current_setting('app.current_user_id', true)::integer)
    )
  );

-- =============================================================================
-- РАЗДЕЛ 4: POLICY для UPDATE - Обновление планов
-- =============================================================================

-- POLICY: rls_update_plan_by_authority
-- PURPOSE: Users can update plans within their authority scope; higher authority can override normal plans
-- ALLOWS:
--   - User can update plan created by their own authority
--   - Higher authority (lower priority_level) can update lower-priority plans
--   - BUT: Exceptional plans block updates by anyone except Master (priority_level=1)
-- DENIES:
--   - Lower-priority user updating higher-priority plan
--   - Non-Master user updating exceptional plan
--   - User updating plan from different authority (unless they have higher priority AND plan is not exceptional)
-- SCENARIO 1:
--   - User A (Central, priority=2) updates Central plan
--   - Result: ALLOWED (own authority)
-- SCENARIO 2:
--   - User A (Central, priority=2) updates Regional plan (priority=3, is_exceptional=false)
--   - Result: ALLOWED (higher authority, normal plan)
-- SCENARIO 3:
--   - User A (Central, priority=2) updates Regional plan (priority=3, is_exceptional=true)
--   - Result: DENIED (exceptional plan protection)
-- SCENARIO 4:
--   - User A (Regional, priority=3) updates Central plan (priority=2)
--   - Result: DENIED (lower authority cannot update higher authority)

CREATE POLICY rls_update_plan_by_authority ON "rev_plan_year"
  FOR UPDATE
  USING (
    -- USING clause: which rows can be updated
    -- Allow if own authority OR (higher authority AND not exceptional)
    (SELECT u.control_authority_id
     FROM "users" u
     WHERE u.user_id = (current_setting('app.current_user_id', true)::integer))
    = control_authority_id
    OR
    (
      (SELECT COALESCE(c.priority_level, 999)
       FROM "ref_control_authorities" c
       INNER JOIN "users" u ON u.control_authority_id = c.authority_id
       WHERE u.user_id = (current_setting('app.current_user_id', true)::integer))
      <
      (SELECT COALESCE(c.priority_level, 999)
       FROM "ref_control_authorities" c
       WHERE c.authority_id = "rev_plan_year".control_authority_id)
      AND is_exceptional = false
    )
  )
  WITH CHECK (
    -- WITH CHECK clause: enforces that updated values also satisfy constraints
    -- After update, control_authority_id must stay the same (prevent authority escalation)
    (SELECT u.control_authority_id
     FROM "users" u
     WHERE u.user_id = (current_setting('app.current_user_id', true)::integer))
    = control_authority_id
  );

-- =============================================================================
-- РАЗДЕЛ 5: POLICY для DELETE - Удаление планов
-- =============================================================================

-- POLICY: rls_delete_plan_by_authority
-- PURPOSE: Users can delete their own plans; only Master can delete any plan
-- ALLOWS:
--   - User can delete plan created by their own authority
--   - Master level (priority_level=1) can delete any plan
-- DENIES:
--   - Lower-priority user deleting higher-priority plan
--   - Non-Master user deleting plan from different authority
-- SCENARIO 1:
--   - User A (Central, priority=2) deletes Central plan
--   - Result: ALLOWED (own authority)
-- SCENARIO 2:
--   - Master (priority_level=1) deletes any plan
--   - Result: ALLOWED (Master authority)
-- SCENARIO 3:
--   - User A (Regional, priority=3) deletes Central plan (priority=2)
--   - Result: DENIED (lower authority cannot delete higher authority plan)

CREATE POLICY rls_delete_plan_by_authority ON "rev_plan_year"
  FOR DELETE
  USING (
    -- Allow if own authority OR Master level
    (SELECT u.control_authority_id
     FROM "users" u
     WHERE u.user_id = (current_setting('app.current_user_id', true)::integer))
    = control_authority_id
    OR
    ((SELECT COALESCE(c.priority_level, 999)
      FROM "ref_control_authorities" c
      INNER JOIN "users" u ON u.control_authority_id = c.authority_id
      WHERE u.user_id = (current_setting('app.current_user_id', true)::integer))
    = 1)
  );

-- =============================================================================
-- РАЗДЕЛ 6: Индексы для оптимизации RLS политик
-- =============================================================================

-- Ensure indexes exist for RLS performance
CREATE INDEX IF NOT EXISTS idx_rev_plan_year_control_authority_id ON "rev_plan_year" (control_authority_id);
CREATE INDEX IF NOT EXISTS idx_rev_plan_year_is_exceptional ON "rev_plan_year" (is_exceptional);
CREATE INDEX IF NOT EXISTS idx_users_control_authority_id ON "users" (control_authority_id);
CREATE INDEX IF NOT EXISTS idx_ref_control_authorities_priority_level ON "ref_control_authorities" (priority_level);

COMMIT;
