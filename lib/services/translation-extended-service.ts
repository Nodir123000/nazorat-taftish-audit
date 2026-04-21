import { prisma } from "../db/prisma";

export const translationExtendedService = {
  /**
   * Получение всех переводов для конкретной локали (ru, uzLatn, uzCyrl).
   */
  async getTranslations(locale: string) {
    const data = await prisma.i18n_values.findMany({
      where: { locale },
      include: {
        i18n_keys: true
      }
    });

    // Преобразование в плоский JSON объект для использования во фронтенде
    const dictionary: Record<string, string> = {};
    data.forEach((item: any) => {
      dictionary[item.i18n_keys.key] = item.value;
    });

    return dictionary;
  },

  /**
   * Обновление термина в БД (Административный интерфейс).
   */
  async updateTerm(key: string, locale: string, value: string) {
    // 1. Находим или создаем ключ
    let keyRecord = await prisma.i18n_keys.findUnique({ where: { key } });
    if (!keyRecord) {
      keyRecord = await prisma.i18n_keys.create({ data: { key } });
    }

    // 2. Обновляем или создаем значение
    return await prisma.i18n_values.upsert({
      where: {
        // Предполагается уникальный индекс по [key_id, locale] в БД
        key_id_locale: {
          key_id: keyRecord.id,
          locale
        }
      },
      update: { value },
      create: {
        key_id: keyRecord.id,
        locale,
        value
      }
    });
  },

  /**
   * Список всех ключей для управления
   */
  async getAllKeys() {
    return await prisma.i18n_keys.findMany({
      include: {
        i18n_values: true
      }
    });
  }
};
