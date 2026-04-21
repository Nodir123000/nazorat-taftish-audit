-- Создание справочника типов территорий
CREATE TABLE IF NOT EXISTS ref_territory_types (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name JSONB NOT NULL, -- {"ru": "...", "uz_latn": "...", "uz_cyrl": "..."}
  description TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Заполнение справочника типов территорий
INSERT INTO ref_territory_types (code, name) VALUES
  ('region', '{"ru": "Область", "uz_latn": "Viloyat", "uz_cyrl": "Вилоят"}'),
  ('republic', '{"ru": "Республика", "uz_latn": "Respublika", "uz_cyrl": "Республика"}'),
  ('city', '{"ru": "Город", "uz_latn": "Shahar", "uz_cyrl": "Шаҳар"}'),
  ('district', '{"ru": "Район", "uz_latn": "Tuman", "uz_cyrl": "Туман"}')
ON CONFLICT (code) DO NOTHING;

-- Создание справочника статусов
CREATE TABLE IF NOT EXISTS ref_statuses (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name JSONB NOT NULL, -- {"ru": "...", "uz_latn": "...", "uz_cyrl": "..."}
  category VARCHAR(50), -- 'territory', 'general', etc.
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Заполнение справочника статусов
INSERT INTO ref_statuses (code, name, category) VALUES
  ('active', '{"ru": "Активен", "uz_latn": "Faol", "uz_cyrl": "Актив"}', 'general'),
  ('inactive', '{"ru": "Неактивен", "uz_latn": "Faol emas", "uz_cyrl": "Фаол эмас"}', 'general')
ON CONFLICT (code) DO NOTHING;

-- Комментарии
COMMENT ON TABLE ref_territory_types IS 'Справочник типов территорий (области, районы, города)';
COMMENT ON TABLE ref_statuses IS 'Справочник статусов для различных сущностей';
