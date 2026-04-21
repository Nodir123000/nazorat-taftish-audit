'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
    children?: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center border border-red-100">
                        <div className="flex justify-center mb-4">
                            <AlertCircle className="h-12 w-12 text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Произошла ошибка</h2>
                        <p className="text-gray-600 mb-6">
                            Извините, при загрузке системы произошла непредвиденная ошибка.
                        </p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Обновить страницу
                        </Button>
                        {process.env.NODE_ENV === 'development' && (
                            <pre className="mt-4 p-4 bg-gray-50 rounded text-left text-xs overflow-auto max-h-40 border border-gray-200">
                                {this.state.error?.message}
                            </pre>
                        )}
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
