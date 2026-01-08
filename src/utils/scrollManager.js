/**
 * Scroll Manager - Handles smooth scroll snapping behavior
 * When user scrolls even a few pixels, automatically snaps to next/previous section
 */

export function initScrollManager() {
    const sections = document.querySelectorAll('section')
    let isScrolling = false
    let scrollTimeout = null
    let lastScrollY = window.scrollY

    const scrollToSection = (section) => {
        isScrolling = true
        section.scrollIntoView({ behavior: 'smooth' })

        // Reset scrolling flag after animation completes
        setTimeout(() => {
            isScrolling = false
            lastScrollY = window.scrollY
        }, 800)
    }

    const handleScroll = () => {
        if (isScrolling) return

        const currentScrollY = window.scrollY
        const scrollDelta = currentScrollY - lastScrollY
        const scrollThreshold = 30 // pixels needed to trigger snap

        if (Math.abs(scrollDelta) < scrollThreshold) return

        clearTimeout(scrollTimeout)

        scrollTimeout = setTimeout(() => {
            const scrollDirection = scrollDelta > 0 ? 1 : -1
            const viewportHeight = window.innerHeight

            // Find current section
            let currentSectionIndex = 0
            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect()
                if (rect.top <= viewportHeight * 0.3) {
                    currentSectionIndex = index
                }
            })

            // Calculate target section
            const targetIndex = Math.max(0, Math.min(sections.length - 1, currentSectionIndex + scrollDirection))
            const targetSection = sections[targetIndex]

            if (targetSection) {
                scrollToSection(targetSection)
            }
        }, 50)
    }

    // Initial setup
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Handle wheel events for more precise snapping
    const handleWheel = (e) => {
        if (isScrolling) {
            e.preventDefault()
            return
        }

        const scrollDirection = e.deltaY > 0 ? 1 : -1
        const viewportHeight = window.innerHeight

        // Find current section
        let currentSectionIndex = 0
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect()
            if (rect.top <= viewportHeight * 0.3) {
                currentSectionIndex = index
            }
        })

        // Calculate target section
        const targetIndex = Math.max(0, Math.min(sections.length - 1, currentSectionIndex + scrollDirection))
        const targetSection = sections[targetIndex]

        // Only snap if we're moving to a different section
        if (targetSection && targetIndex !== currentSectionIndex) {
            e.preventDefault()
            scrollToSection(targetSection)
        }
    }

    // Use passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false })

    // Handle touch events for mobile
    let touchStartY = 0

    const handleTouchStart = (e) => {
        touchStartY = e.touches[0].clientY
    }

    const handleTouchEnd = (e) => {
        if (isScrolling) return

        const touchEndY = e.changedTouches[0].clientY
        const touchDelta = touchStartY - touchEndY
        const touchThreshold = 50 // pixels needed to trigger snap

        if (Math.abs(touchDelta) < touchThreshold) return

        const scrollDirection = touchDelta > 0 ? 1 : -1
        const viewportHeight = window.innerHeight

        // Find current section
        let currentSectionIndex = 0
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect()
            if (rect.top <= viewportHeight * 0.3) {
                currentSectionIndex = index
            }
        })

        // Calculate target section
        const targetIndex = Math.max(0, Math.min(sections.length - 1, currentSectionIndex + scrollDirection))
        const targetSection = sections[targetIndex]

        if (targetSection && targetIndex !== currentSectionIndex) {
            scrollToSection(targetSection)
        }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    // Cleanup function
    return () => {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('wheel', handleWheel)
        window.removeEventListener('touchstart', handleTouchStart)
        window.removeEventListener('touchend', handleTouchEnd)
        clearTimeout(scrollTimeout)
    }
}
