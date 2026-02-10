/**
 * Lenis Smooth Scroll Configuration
 * Optimized for smooth, non-laggy scrolling across all pages
 */

// Initialize Lenis with optimized settings
const lenis = new Lenis({
    duration: 3,              // Increased duration for super smooth scrolling
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Keep the exponential easing
    direction: 'vertical',       // Vertical scrolling only
    gestureDirection: 'vertical', // Vertical gestures only
    smooth: true,                // Enable smooth scrolling
    mouseMultiplier: 0.8,        // Reduced sensitivity for smoother feel
    smoothTouch: false,          // Disable smooth scrolling on touch (native often better)
    touchMultiplier: 2.5,        // Touch scroll multiplier
    infinite: false,             // No infinite scroll
    autoResize: true,            // Auto-resize on window changes
});

// Request Animation Frame loop for Lenis
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Integrate with GSAP if available
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Sync ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // Tell GSAP to use Lenis's scroll position
    gsap.ticker.lagSmoothing(0);
}

// Prevent scroll lag on resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        lenis.resize();
    }, 150);
});

// Stop scroll on specific elements (like modals, dropdowns)
document.querySelectorAll('[data-lenis-prevent]').forEach(element => {
    element.addEventListener('wheel', (e) => {
        e.stopPropagation();
    });
});

// Smooth scroll to anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                lenis.scrollTo(target, {
                    offset: -100, // Offset for fixed navbar
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        }
    });
});

// Export lenis instance for external use
window.lenis = lenis;
