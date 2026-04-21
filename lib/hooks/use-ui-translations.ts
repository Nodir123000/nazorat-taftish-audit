import useSWR from 'swr'
import { useCallback } from 'react'
import { useI18n } from '@/lib/i18n/context'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export interface UITranslationData {
    id: string
    key: string
    name: Record<string, string> // { "ru": "...", "uz_latn": "..." }
    description?: string
    tags: string[]
    status: string
}

export function useUITranslations() {
    const { locale } = useI18n()

    // Transform locale name to match keys in JSON (ru, uz_latn, uz_cyrl)
    const dbLocale = locale === 'uzLatn' ? 'uz_latn' : locale === 'uzCyrl' ? 'uz_cyrl' : 'ru'

    const { data, error, mutate, isLoading } = useSWR<{ ok: boolean, data: UITranslationData[] }>(
        `/api/ui-translations`,
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    )

    const t = useCallback((key: string, fallback?: string): string => {
        if (!data?.ok || !data.data) return fallback || key

        const item = data.data.find(i => i.key === key)
        if (!item || !item.name) return fallback || key

        // Get translation for current locale
        if (item.name[dbLocale]) return item.name[dbLocale]

        // Fallback chain: ru
        if (item.name['ru']) return item.name['ru']

        return fallback || key
    }, [data, dbLocale])

    const refreshUI = () => mutate()

    return {
        t,
        translations: data?.data || [],
        isLoading,
        isError: error,
        refreshUI,
        locale: dbLocale
    }
}
