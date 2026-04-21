'use client'

import React from 'react'
import { FileQuestion, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface NoDataFoundProps {
    title?: string
    description?: string
    icon?: React.ReactNode
    actionLabel?: string
    onAction?: () => void
    query?: string
    onClear?: () => void
    onReset?: () => void
}

export function NoSearchResults(props: NoDataFoundProps) {
    return (
        <NoDataFound
            {...props}
            title={props.title || "Результаты не найдены"}
            description={props.description || (props.query ? `По запросу "${props.query}" ничего не найдено.` : "По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска.")}
            actionLabel={props.actionLabel || "Сбросить поиск"}
            onAction={props.onAction || props.onClear || props.onReset}
        />
    )
}

export function NoDataFound({
    title = "Данные не найдены",
    description = "По вашему запросу ничего не найдено. Попробуйте изменить фильтры или добавить новую запись.",
    icon = <FileQuestion className="h-12 w-12 text-muted-foreground" />,
    actionLabel,
    onAction,
    onReset
}: NoDataFoundProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-lg border border-dashed border-muted-foreground/25 min-h-[300px]">
            <div className="mb-4">{icon}</div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2 mb-6">
                {description}
            </p>
            {(actionLabel || onAction || onReset) && (
                <Button onClick={onAction || onReset} variant="outline">
                    {actionLabel || "Сбросить"}
                </Button>
            )}
        </div>
    )
}

export interface ErrorStateProps {
    title?: string
    description?: string
    onRetry?: () => void
}

export function ErrorState({
    title = "Ошибка загрузки",
    description = "Произошла ошибка при получении данных. Пожалуйста, попробуйте еще раз.",
    onRetry
}: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-lg border border-red-100 min-h-[300px]">
            <div className="mb-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-red-900">{title}</h3>
            <p className="text-sm text-red-600 max-w-xs mx-auto mt-2 mb-6">
                {description}
            </p>
            {onRetry && (
                <Button onClick={onRetry} variant="destructive">
                    Повторить попытку
                </Button>
            )}
        </div>
    )
}
