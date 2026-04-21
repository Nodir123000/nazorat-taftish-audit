import { useState } from "react"
import { Region, District } from "../types"

type ItemType = Region | District | null

export function useTerritoryDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<ItemType>(null)
    const [activeTab, setActiveTab] = useState<"regions" | "districts">("regions")

    const openForAdd = (tab: "regions" | "districts") => {
        setEditingItem(null)
        setActiveTab(tab)
        setIsOpen(true)
    }

    const openForEdit = (item: Region | District, tab: "regions" | "districts") => {
        setEditingItem(item)
        setActiveTab(tab)
        setIsOpen(true)
    }

    const close = () => {
        setIsOpen(false)
        setEditingItem(null)
    }

    return {
        isOpen,
        setIsOpen,
        editingItem,
        activeTab,
        setActiveTab,
        openForAdd,
        openForEdit,
        close
    }
}
