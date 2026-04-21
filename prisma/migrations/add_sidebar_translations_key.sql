-- Добавление перевода для "Управление переводами" в сайдбар
INSERT INTO ui_translations (id, key, name, tags, status, description)
VALUES (
  gen_random_uuid(),
  'sidebar.reference.translations',
  '{"ru": "Управление переводами", "uz_latn": "Tarjimalarni boshqarish", "uz_cyrl": "Таржималарни бошқариш"}',
  ARRAY['sidebar', 'reference'],
  'active',
  'Пункт меню для управления переводами системы'
)
ON CONFLICT (key) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description;
