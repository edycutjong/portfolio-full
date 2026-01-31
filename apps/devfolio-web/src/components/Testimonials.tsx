'use client'

import { useState, useEffect } from 'react'

const testimonials = [
    {
        id: 1,
        name: 'Sarah Chen',
        role: 'CTO at TechStart',
        avatar: '👩‍💼',
        content: 'Exceptional work on our AI integration project. Delivered ahead of schedule with clean, maintainable code. The attention to performance optimization was impressive.',
        rating: 5,
    },
    {
        id: 2,
        name: 'Marcus Johnson',
        role: 'Product Lead at ScaleUp',
        avatar: '👨‍💻',
        content: 'One of the most skilled full-stack developers I\'ve worked with. Great communication, deep technical knowledge, and always goes the extra mile.',
        rating: 5,
    },
    {
        id: 3,
        name: 'Elena Rodriguez',
        role: 'Engineering Manager',
        avatar: '👩‍🔬',
        content: 'Built our entire cloud infrastructure from scratch. The documentation was thorough and the handoff was seamless. Highly recommend for complex projects.',
        rating: 5,
    },
]

export function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    useEffect(() => {
        if (!isAutoPlaying) return

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [isAutoPlaying])

    return (
        <section className="py-24 px-6">
            <div className="container mx-auto max-w-4xl">
                {/* Section header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">What People Say</h2>
                    <p className="text-xl text-gray-400">
                        Feedback from clients and collaborators
                    </p>
                </div>

                {/* Testimonial carousel */}
                <div
                    className="relative glass-card p-8 md:p-12"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    {/* Quote icon */}
                    <div className="absolute top-6 left-6 text-6xl text-primary-500/20">
                        &ldquo;
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        <div
                            key={activeIndex}
                            className="animate-fade-in"
                        >
                            {/* Rating stars */}
                            <div className="flex gap-1 mb-6 justify-center">
                                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className="w-5 h-5 text-yellow-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Quote */}
                            <blockquote className="text-xl md:text-2xl text-gray-200 text-center mb-8 leading-relaxed">
                                {testimonials[activeIndex].content}
                            </blockquote>

                            {/* Author */}
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-4xl">{testimonials[activeIndex].avatar}</span>
                                <div>
                                    <div className="font-semibold text-lg">{testimonials[activeIndex].name}</div>
                                    <div className="text-gray-400">{testimonials[activeIndex].role}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation dots */}
                    <div className="flex justify-center gap-3 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeIndex
                                        ? 'bg-primary-500 w-8'
                                        : 'bg-white/20 hover:bg-white/40'
                                    }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Disclaimer */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    <em>Demo testimonials for portfolio showcase</em>
                </p>
            </div>
        </section>
    )
}
