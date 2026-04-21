import { useState, useEffect } from 'react'
import { ReferenceData } from '../types'

interface TerritoryReferences {
    types: ReferenceData[]
    statuses: ReferenceData[]
}

export function useTerritoryReferences() {
    const [references, setReferences] = useState<TerritoryReferences>({
        types: [],
        statuses: []
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadReferences() {
            try {
                const response = await fetch('/api/reference/territory-references')
                if (!response.ok) {
                    throw new Error('Failed to load references')
                }
                const data = await response.json()
                setReferences(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error')
            } finally {
                setLoading(false)
            }
        }

        loadReferences()
    }, [])

    return { references, loading, error }
}
