import { useToast as useShadcnToast } from "@/components/ui/use-toast"

export function useToast() {
    const { toast } = useShadcnToast()

    const success = (message: string) => {
        toast({
            title: "Успешно",
            description: message,
            variant: "default",
        })
    }

    const error = (message: string) => {
        toast({
            title: "Ошибка",
            description: message,
            variant: "destructive",
        })
    }

    const warning = (message: string) => {
        toast({
            title: "Внимание",
            description: message,
            variant: "default",
        })
    }

    const info = (message: string) => {
        toast({
            title: "Информация",
            description: message,
            variant: "default",
        })
    }

    return {
        toast,
        success,
        error,
        warning,
        info,
    }
}
