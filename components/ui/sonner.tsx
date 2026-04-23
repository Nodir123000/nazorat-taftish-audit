'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      position="top-center"
      richColors
      expand={true}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl group-[.toaster]:px-4 group-[.toaster]:py-3 group-[.toaster]:font-medium",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:border-green-500/50 group-[.toaster]:bg-green-50/50 dark:group-[.toaster]:bg-green-500/10",
          error: "group-[.toaster]:border-red-500/50 group-[.toaster]:bg-red-50/50 dark:group-[.toaster]:bg-red-500/10",
          info: "group-[.toaster]:border-blue-500/50 group-[.toaster]:bg-blue-50/50 dark:group-[.toaster]:bg-blue-500/10",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
