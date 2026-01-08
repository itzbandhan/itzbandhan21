import { useEffect, useRef } from 'react'
import './About.css'

export default function About() {
    const sectionRef = useRef()

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

        const animatedElements = sectionRef.current?.querySelectorAll('.animate-on-scroll')
        animatedElements?.forEach((el) => observer.observe(el))

        return () => observer.disconnect()
    }, [])

    return (
        <section id="about" className="about" ref={sectionRef}>
            <div className="container">
                <div className="section-header animate-on-scroll">
                    <span className="section-label">About Me</span>
                    <h2>Crafting Digital Experiences</h2>
                </div>

                <div className="about-grid">
                    <div className="about-content animate-on-scroll">
                        <p className="about-intro">
                            I'm a <strong>self-driven developer</strong> based in Kathmandu, Nepal,
                            passionate about building modern, performant web applications and
                            interactive digital experiences.
                        </p>

                        <p>
                            My approach centers on <strong>clean architecture</strong>, smooth UI/UX,
                            and mobile-first design. I believe in learning by building – turning complex
                            ideas into working products through iteration and experimentation.
                        </p>

                        <p>
                            Whether it's a video-based content platform, an interactive game, or an
                            IoT system, I love tackling challenges that push the boundaries of what's
                            possible on the web.
                        </p>

                        <div className="about-stats">
                            <div className="stat-item">
                                <span className="stat-number">5+</span>
                                <span className="stat-label">Projects Built</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">3+</span>
                                <span className="stat-label">Technologies</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">∞</span>
                                <span className="stat-label">Curiosity</span>
                            </div>
                        </div>
                    </div>

                    <div className="about-visual animate-on-scroll">
                        <div className="visual-card glass">
                            <div className="visual-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <h4>Full-Stack Development</h4>
                            <p>Building end-to-end solutions from database to UI</p>
                        </div>

                        <div className="visual-card glass">
                            <div className="visual-icon accent-2">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <h4>Problem Solving</h4>
                            <p>Strong debugging and logical reasoning skills</p>
                        </div>

                        <div className="visual-card glass">
                            <div className="visual-icon accent-3">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 6v6l4 2" />
                                </svg>
                            </div>
                            <h4>Attention to Detail</h4>
                            <p>Pixel-perfect UI with smooth animations</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
