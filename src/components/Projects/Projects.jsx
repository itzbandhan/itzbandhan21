import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import './Projects.css'

// Default projects (fallback if database is empty)
const defaultProjects = [
    {
        type: 'Web Application',
        title: 'Video Content Platform',
        description: 'Built a video-based content platform with randomized feeds, dynamic routing, and optimized loading states.',
        tags: ['React', 'Vite', 'Supabase'],
        color: 'primary',
        url: '#'
    },
    {
        type: 'Interactive Systems',
        title: 'Embedded Content Manager',
        description: 'Developed pause-and-resume logic for embedded content using conditional UI flows.',
        tags: ['Next.js', 'State Management', 'API'],
        color: 'secondary',
        url: '#'
    },
    {
        type: 'Games & Animation',
        title: 'Mobile Browser Games',
        description: 'Created browser-based games optimized for mobile devices with touch-friendly controls.',
        tags: ['JavaScript', 'Canvas', 'Mobile-First'],
        color: 'tertiary',
        url: '#'
    },
    {
        type: 'IoT & Hardware',
        title: 'Web-Connected Automation',
        description: 'Integrated microcontrollers with web and mobile interfaces for real-world automation and control.',
        tags: ['IoT', 'REST APIs', 'Real-time'],
        color: 'primary',
        url: '#'
    }
]

export default function Projects() {
    const sectionRef = useRef()
    const [hoveredIndex, setHoveredIndex] = useState(null)
    const [projects, setProjects] = useState(defaultProjects)

    useEffect(() => {
        // Fetch projects from Supabase
        const fetchProjects = async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false })

            if (!error && data && data.length > 0) {
                setProjects(data)
            }
        }

        fetchProjects()
    }, [])

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

        const animatedElements = sectionRef.current?.querySelectorAll('.project-card')
        animatedElements?.forEach((el, i) => {
            el.style.transitionDelay = `${i * 0.15}s`
            observer.observe(el)
        })

        return () => observer.disconnect()
    }, [projects])

    return (
        <section id="projects" className="projects" ref={sectionRef}>
            <div className="container">
                <div className="section-header animate-on-scroll">
                    <span className="section-label">Projects</span>
                    <h2>What I've Built</h2>
                    <p className="section-description">
                        A showcase of my development experience and problem-solving abilities
                    </p>
                </div>

                <div className="projects-grid">
                    {projects.map((project, index) => (
                        <a
                            key={project.id || index}
                            href={project.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`project-card color-${project.color || 'primary'} ${hoveredIndex === index ? 'hovered' : ''}`}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className="project-header">
                                <span className="project-type">{project.type}</span>
                                <div className="project-arrow">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M7 17L17 7M17 7H7M17 7v10" />
                                    </svg>
                                </div>
                            </div>

                            <h3 className="project-title">{project.title}</h3>
                            <p className="project-description">{project.description}</p>

                            <div className="project-tags">
                                {(project.tags || []).map((tag, i) => (
                                    <span key={i} className="project-tag">{tag}</span>
                                ))}
                            </div>

                            <div className="project-glow"></div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}
