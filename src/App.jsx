import AnimatedBackground from './components/Hero/AnimatedBackground'
import Navbar from './components/Navigation/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Skills from './components/Skills/Skills'
import Projects from './components/Projects/Projects'
import Contact from './components/Contact/Contact'

function App() {

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
