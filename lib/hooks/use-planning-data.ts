"use client"

import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useAnnualPlans(year?: number, status?: string) {
  const params = new URLSearchParams()
  if (year) params.append("year", year.toString())
  if (status) params.append("status", status)

  const { data, error, isLoading, mutate } = useSWR(`/api/planning/annual-plans?${params.toString()}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })

  return {
    plans: data?.data || [],
    total: data?.total || 0,
    isLoading,
    error,
    mutate,
  }
}

export function useApprovedPlans(year?: number, inspectionType?: string) {
  const params = new URLSearchParams()
  if (year) params.append("year", year.toString())
  if (inspectionType) params.append("inspectionType", inspectionType)

  const { data, error, isLoading, mutate } = useSWR(`/api/planning/approved-plans?${params.toString()}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })

  return {
    plans: data?.data || [],
    total: data?.total || 0,
    isLoading,
    error,
    mutate,
  }
}

export function useInspectorAssignments(planId?: number, status?: string) {
  const params = new URLSearchParams()
  if (planId) params.append("planId", planId.toString())
  if (status) params.append("status", status)

  const { data, error, isLoading, mutate } = useSWR(
    `/api/planning/inspector-assignments?${params.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  )

  return {
    assignments: data?.data || [],
    total: data?.total || 0,
    isLoading,
    error,
    mutate,
  }
}

export function useExecutionControl(year?: number, quarter?: number) {
  const params = new URLSearchParams()
  if (year) params.append("year", year.toString())
  if (quarter) params.append("quarter", quarter.toString())

  const { data, error, isLoading, mutate } = useSWR(`/api/planning/execution-control?${params.toString()}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })

  return {
    data: data?.data || [],
    summary: data?.summary || {},
    isLoading,
    error,
    mutate,
  }
}
