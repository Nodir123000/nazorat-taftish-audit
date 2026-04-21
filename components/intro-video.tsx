"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, Volume2, VolumeX, Play } from "lucide-react"
import { cn } from "@/lib/utils"

export function IntroVideo() {
    const [isVisible, setIsVisible] = useState(false)
    const [isMuted, setIsMuted] = useState(false) // Try to be unmuted by default
    const [showStartButton, setShowStartButton] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        // Check if we've already shown the intro in this session
        // We strictly follow the local storage flag to ensure it plays only once per user
        const hasPlayed = localStorage.getItem("introPlayed")

        // Only show if not played and we are client-side
        if (!hasPlayed) {
            setIsVisible(true)
        }
    }, [])

    useEffect(() => {
        if (isVisible && videoRef.current) {
            // Attempt to play automatically
            const playPromise = videoRef.current.play()

            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    // Check if it's not a normal AbortError (which happens on skip/unmount)
                    if (error.name !== "AbortError") {
                        console.info("Autoplay interaction requirement:", error.name)
                        // Autoplay was prevented (likely due to unmuted)
                        // Show a start button to require user interaction
                        setShowStartButton(true)
                    }
                })
            }
        }
    }, [isVisible])

    const handleStart = (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation()
            e.preventDefault()
        }
        
        if (videoRef.current) {
            videoRef.current.muted = false
            const playPromise = videoRef.current.play()

            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    if (error.name !== "AbortError") {
                        console.error("Playback failed:", error)
                        // If it fails to play even after user interaction, just skip to avoid getting stuck
                        handleComplete()
                    }
                })
            }

            setShowStartButton(false)
            setIsMuted(false)
        }
    }

    const handleComplete = (e?: React.SyntheticEvent) => {
        if (e) {
            e.stopPropagation()
        }
        
        // Pause video before removing to prevent AbortError in some browsers
        if (videoRef.current) {
            videoRef.current.pause()
        }

        // Add a small fade out effect could be nice, but for now simple removal
        setIsVisible(false)
        localStorage.setItem("introPlayed", "true")
    }

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted
            setIsMuted(!isMuted)
        }
    }

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center animate-in fade-in duration-500">
            {/* 
        Video element with fallback sources. 
      */}
            <video
                ref={videoRef}
                // Removed autoPlay attribute to control it manually via useEffect
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
                onEnded={handleComplete}
                // Click to skip for UX convenience
                onClick={handleComplete}
            >
                <source src="/intro.mp4" type="video/mp4" />
                <source src="/intro.webm" type="video/webm" />
                Your browser does not support the video tag.
            </video>

            {/* Start Button Overlay (if autoplay blocked) */}
            {showStartButton && (
                <div className="absolute inset-0 flex items-center justify-center z-[10001]">
                    {/* Background layer for click-to-skip */}
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" 
                        onClick={handleComplete} 
                    />
                    
                    {/* Interactive center content */}
                    <div className="relative text-center z-10">
                        <div className="flex flex-col gap-4">
                            <Button
                                size="lg"
                                className="text-lg px-8 py-6 rounded-full bg-white text-black hover:bg-gray-200 transition-transform hover:scale-105 pointer-events-auto"
                                onClick={handleStart}
                            >
                                <Play className="mr-2 h-5 w-5 fill-current" />
                                Смотреть вступление
                            </Button>

                            <Button
                                variant="ghost"
                                className="text-white/70 hover:text-white hover:bg-white/10 pointer-events-auto"
                                onClick={handleComplete}
                            >
                                Пропустить и войти
                            </Button>
                        </div>
                        <p className="mt-4 text-white/50 text-sm">Нажмите для запуска со звуком</p>
                    </div>
                </div>
            )}

            {/* Controls Container */}
            {!showStartButton && (
                <div className="absolute bottom-8 right-8 z-[10000] flex gap-4 items-center">
                    {/* Mute Toggle */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="bg-black/20 text-white border-white/20 hover:bg-black/40 hover:text-white backdrop-blur-sm transition-all rounded-full h-10 w-10"
                        onClick={toggleMute}
                        title={isMuted ? "Включить звук" : "Выключить звук"}
                    >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>

                    {/* Skip Button */}
                    <Button
                        variant="outline"
                        className="bg-black/20 text-white border-white/20 hover:bg-black/40 hover:text-white backdrop-blur-sm transition-all rounded-full px-6"
                        onClick={handleComplete}
                    >
                        Пропустить <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}
