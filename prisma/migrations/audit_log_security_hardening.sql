-- =============================================================================
-- Миграция: Усиление безопасности и производительности audit_log
-- Применять вручную: psql $DATABASE_URL -f audit_log_security_hardening.sql
-- =============================================================================

BEGIN;

-- 1. Убедиться, что NULL-значений в created_at нет (заполнить если есть)
UPDATE audit_log SET created_at = NOW() WHERE created_at IS NULL;

-- 2. Сделать created_at NOT NULL (обязательная метка времени для аудита)
ALTER TABLE audit_log ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE audit_log ALTER COLUMN created_at SET DEFAULT NOW();

-- 3. Добавить индексы для ускорения запросов журнала
--    (игнорировать если уже существуют)
CREATE INDEX IF NOT EXISTS audit_log_created_at_idx
  ON audit_log (created_at DESC);

CREATE INDEX IF NOT EXISTS audit_log_user_id_idx
  ON audit_log (user_id);

CREATE INDEX IF NOT EXISTS audit_log_action_idx
  ON audit_log (action);

COMMIT;
