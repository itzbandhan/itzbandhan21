import { useState, useEffect } from 'react'
import './Navbar.css'

const navLinks = [
    { href: '#hero', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [activeSection, setActiveSection] = useState('hero')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)

            // Update active section based on scroll position
            const sections = navLinks.map(link => link.href.slice(1))
            for (const section of sections.reverse()) {
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

    const handleLinkClick = (e, href) => {
        e.preventDefault()
        const element = document.querySelector(href)
        element?.scrollIntoView({ behavior: 'smooth' })
        setIsMobileMenuOpen(false)
    }

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-container">
                <a href="#hero" className="navbar-logo" onClick={(e) => handleLinkClick(e, '#hero')}>
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
                    {navLinks.map(({ href, label }) => (
                        <li key={href}>
                            <a
                                href={href}
                                className={activeSection === href.slice(1) ? 'active' : ''}
                                onClick={(e) => handleLinkClick(e, href)}
                            >
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}
