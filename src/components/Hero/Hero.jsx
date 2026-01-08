import { useEffect, useRef } from 'react'
import './Hero.css'

export default function Hero() {
    const heroRef = useRef()

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible')
                    }
                })
            },
            { threshold: 0.1 }
        )

        const animatedElements = heroRef.current?.querySelectorAll('.animate-on-scroll')
        animatedElements?.forEach((el) => observer.observe(el))

        return () => observer.disconnect()
    }, [])

    const scrollToNext = () => {
        const aboutSection = document.getElementById('about')
        aboutSection?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <section id="hero" className="hero" ref={heroRef}>
            <div className="container hero-content">
                <div className="hero-badge animate-on-scroll">
                    <span className="badge-dot"></span>
                    Available for opportunities
                </div>

                <h1 className="hero-title animate-on-scroll">
                    <span className="title-line">Hi, I'm</span>
                    <span className="title-name">Bandhan Pokhrel</span>
                </h1>

                <p className="hero-subtitle animate-on-scroll">
                    Full-Stack Web Developer & Creative Technologist
                </p>

                <p className="hero-description animate-on-scroll">
                    Building modern, performant web applications and interactive digital
                    experiences from Kathmandu, Nepal.
                </p>

                <div className="hero-cta animate-on-scroll">
                    <a href="#projects" className="btn btn-primary">
                        View My Work
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>
                    <a href="#contact" className="btn btn-secondary">
                        Get in Touch
                    </a>
                </div>
            </div>

            <button className="scroll-indicator" onClick={scrollToNext} aria-label="Scroll to next section">
                <div className="scroll-mouse">
                    <div className="scroll-wheel"></div>
                </div>
                <span>Scroll</span>
            </button>
        </section>
    )
}
