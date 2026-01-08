import { useEffect, useRef } from 'react'
import './Skills.css'

const skillCategories = [
    {
        title: 'Frontend',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <path d="M8 21h8M12 17v4" />
            </svg>
        ),
        skills: ['React', 'Next.js', 'Vite', 'Tailwind CSS'],
        color: 'primary'
    },
    {
        title: 'Backend',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
            </svg>
        ),
        skills: ['Supabase', 'REST APIs', 'Authentication'],
        color: 'secondary'
    },
    {
        title: 'UI/UX',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
            </svg>
        ),
        skills: ['Responsive Design', 'Neumorphism', 'Animations', 'Mobile-First'],
        color: 'tertiary'
    },
    {
        title: 'Tooling',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
        ),
        skills: ['Git', 'Cloudflare', 'Auth0', 'Modern Build Tools'],
        color: 'primary'
    }
]

export default function Skills() {
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

        const animatedElements = sectionRef.current?.querySelectorAll('.skill-card')
        animatedElements?.forEach((el, i) => {
            el.style.transitionDelay = `${i * 0.1}s`
            observer.observe(el)
        })

        return () => observer.disconnect()
    }, [])

    return (
        <section id="skills" className="skills" ref={sectionRef}>
            <div className="container">
                <div className="section-header animate-on-scroll">
                    <span className="section-label">Skills</span>
                    <h2>My Tech Stack</h2>
                    <p className="section-description">
                        Technologies I work with to bring ideas to life
                    </p>
                </div>

                <div className="skills-grid">
                    {skillCategories.map((category, index) => (
                        <div key={index} className={`skill-card color-${category.color}`}>
                            <div className="skill-card-header">
                                <div className="skill-icon">{category.icon}</div>
                                <h3>{category.title}</h3>
                            </div>
                            <div className="skill-tags">
                                {category.skills.map((skill, i) => (
                                    <span key={i} className="skill-tag">{skill}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
