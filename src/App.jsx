import { useState, useEffect } from 'react'
import AnimatedBackground from './components/Hero/AnimatedBackground'
import Navbar from './components/Navigation/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Skills from './components/Skills/Skills'
import Projects from './components/Projects/Projects'
import Contact from './components/Contact/Contact'
import AdminPage from './components/Admin/AdminPage'

function App() {
    const [isAdminRoute, setIsAdminRoute] = useState(false)

    useEffect(() => {
        // Check if we're on the admin route
        const checkRoute = () => {
            setIsAdminRoute(window.location.hash === '#/admin')
        }

        checkRoute()
        window.addEventListener('hashchange', checkRoute)
        return () => window.removeEventListener('hashchange', checkRoute)
    }, [])

    if (isAdminRoute) {
        return <AdminPage />
    }

    return (
        <>
            <AnimatedBackground />
            <Navbar />
            <main>
                <Hero />
                <About />
                <Skills />
                <Projects />
                <Contact />
            </main>
        </>
    )
}

export default App
