'use client'

import { useState, useEffect } from 'react'

interface TypeWriterProps {
    texts: string[]
    typingSpeed?: number
    deletingSpeed?: number
    pauseDuration?: number
    className?: string
}

export function TypeWriter({
    texts,
    typingSpeed = 100,
    deletingSpeed = 50,
    pauseDuration = 2000,
    className = '',
}: TypeWriterProps) {
    const [displayText, setDisplayText] = useState('')
    const [textIndex, setTextIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isPaused, setIsPaused] = useState(false)

    useEffect(() => {
        const currentText = texts[textIndex]

        if (isPaused) {
            const pauseTimer = setTimeout(() => {
                setIsPaused(false)
                setIsDeleting(true)
            }, pauseDuration)
            return () => clearTimeout(pauseTimer)
        }

        if (isDeleting) {
            if (displayText === '') {
                setIsDeleting(false)
                setTextIndex((prev) => (prev + 1) % texts.length)
            } else {
                const deleteTimer = setTimeout(() => {
                    setDisplayText(currentText.substring(0, displayText.length - 1))
                }, deletingSpeed)
                return () => clearTimeout(deleteTimer)
            }
        } else {
            if (displayText === currentText) {
                setIsPaused(true)
            } else {
                const typeTimer = setTimeout(() => {
                    setDisplayText(currentText.substring(0, displayText.length + 1))
                }, typingSpeed)
                return () => clearTimeout(typeTimer)
            }
        }
    }, [displayText, isDeleting, isPaused, textIndex, texts, typingSpeed, deletingSpeed, pauseDuration])

    return (
        <span className={`inline-flex items-baseline ${className}`}>
            <span className="whitespace-nowrap">{displayText}</span>
            <span className="cursor-blink text-primary-500">|</span>
        </span>
    )
}
