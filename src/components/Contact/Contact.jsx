import { useEffect, useRef, useState, useCallback } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { supabase } from '../../lib/supabase'
import './Contact.css'

export default function Contact() {
    const sectionRef = useRef()
    const recaptchaRef = useRef()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })
    const [status, setStatus] = useState({ type: '', message: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [captchaToken, setCaptchaToken] = useState(null)

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

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleCaptchaChange = useCallback((token) => {
        setCaptchaToken(token)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!captchaToken) {
            setStatus({ type: 'error', message: 'Please complete the CAPTCHA verification.' })
            return
        }

        setIsSubmitting(true)
        setStatus({ type: '', message: '' })

        try {
            const { error } = await supabase
                .from('contact_submissions')
                .insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        message: formData.message,
                        captcha_token: captchaToken,
                        submitted_at: new Date().toISOString()
                    }
                ])

            if (error) throw error

            setStatus({
                type: 'success',
                message: 'Thank you! Your message has been sent successfully.'
            })
            setFormData({ name: '', email: '', message: '' })
            setCaptchaToken(null)
            recaptchaRef.current?.reset()

        } catch (error) {
            console.error('Error submitting form:', error)
            setStatus({
                type: 'error',
                message: 'Something went wrong. Please try again later.'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const socialLinks = [
        {
            name: 'GitHub',
            url: 'https://github.com/itzbandhan',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
            )
        },
        {
            name: 'LinkedIn',
            url: 'https://linkedin.com/in/itzbandhan',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            )
        },
        {
            name: 'Twitter',
            url: 'https://twitter.com/itzbandhan',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            )
        },
        {
            name: 'Email',
            url: 'mailto:hello@itzbandhan.tech',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="M22 6l-10 7L2 6" />
                </svg>
            )
        }
    ]

    return (
        <section id="contact" className="contact" ref={sectionRef}>
            <div className="container">
                <div className="section-header animate-on-scroll">
                    <span className="section-label">Contact</span>
                    <h2>Let's Work Together</h2>
                    <p className="section-description">
                        Have a project in mind? I'd love to hear from you.
                    </p>
                </div>

                <div className="contact-grid">
                    <div className="contact-info animate-on-scroll">
                        <div className="info-card glass">
                            <h3>Get in Touch</h3>
                            <p>
                                I'm currently open to internships, freelance projects, and
                                collaborative development opportunities. Let's build something
                                amazing together!
                            </p>

                            <div className="location-badge">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span>Kathmandu, Nepal</span>
                            </div>

                            <div className="social-links">
                                {socialLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-link"
                                        aria-label={link.name}
                                    >
                                        {link.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <form className="contact-form animate-on-scroll" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-input"
                                placeholder="Your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message" className="form-label">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                className="form-textarea"
                                placeholder="Tell me about your project..."
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group captcha-wrapper">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                                onChange={handleCaptchaChange}
                                theme="dark"
                            />
                            <p className="captcha-note">Please verify you're human</p>
                        </div>

                        {status.message && (
                            <div className={`form-status ${status.type}`}>
                                {status.type === 'success' ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <path d="M22 4L12 14.01l-3-3" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M15 9l-6 6M9 9l6 6" />
                                    </svg>
                                )}
                                {status.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    Send Message
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <footer className="contact-footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Bandhan Pokhrel. All rights reserved.</p>
                    <p className="footer-made">Crafted with 💜 in Kathmandu</p>
                </div>
            </footer>
        </section>
    )
}
