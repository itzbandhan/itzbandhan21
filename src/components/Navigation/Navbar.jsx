import { useState, useEffect } from 'react'
import './Navbar.css'

const navLinks = [
    { href: '#hero', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
    { href: 'https://projectblogs.itzbandhan.tech', label: 'Blog', external: true },
]

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [activeSection, setActiveSection] = useState('hero')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)

            // Update active section based on scroll position - only for internal links
            const internalSections = navLinks
                .filter(link => link.href.startsWith('#'))
                .map(link => link.href.slice(1))

            for (const section of [...internalSections].reverse()) {
                const element = document.getElementById(section)
                if (element) {
                    const rect = element.getBoundingClientRect()
                    if (rect.top <= 150) {
                        setActiveSection(section)
                        break
                    }
                }
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLinkClick = (e, link) => {
        if (link.external) return // Let default behavior happen for external links

        e.preventDefault()
        const element = document.querySelector(link.href)
        element?.scrollIntoView({ behavior: 'smooth' })
        setIsMobileMenuOpen(false)
    }

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-container">
                <a href="#hero" className="navbar-logo" onClick={(e) => handleLinkClick(e, { href: '#hero' })}>
                    <span className="logo-text">B</span>
                    <span className="logo-full">andhan</span>
                </a>

                <button
                    className={`mobile-toggle ${isMobileMenuOpen ? 'open' : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <ul className={`navbar-links ${isMobileMenuOpen ? 'open' : ''}`}>
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className={activeSection === link.href.slice(1) ? 'active' : ''}
                                onClick={(e) => handleLinkClick(e, link)}
                                target={link.external ? "_blank" : undefined}
                                rel={link.external ? "noopener noreferrer" : undefined}
                            >
                                {link.label}
                                {link.external && (
                                    <svg className="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                                    </svg>
                                )}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}
