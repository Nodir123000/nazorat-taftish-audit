"use client"

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { ToastProvider } from "./toast-provider"

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        retry: 1,
                        refetchOnWindowFocus: false,
                    },
                },
                // Global Error Handling
                queryCache: new QueryCache({
                    onError: (error: any) => {
                        const message = error?.message || "Ошибка загрузки данных"
                        toast.error(message, {
                            description: "Пожалуйста, попробуйте позже.",
                        })
                    },
                }),
                mutationCache: new MutationCache({
                    onError: (error: any) => {
                        const message = error?.message || "Произошла ошибка"
                        toast.error(message)
                    },
                    onSuccess: () => {
                        toast.success("Операция выполнена успешно")
                    },
                }),
            })
    )

    return (
        <ToastProvider>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </ToastProvider>
    )
}
