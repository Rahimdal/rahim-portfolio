document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(".hero-section",
            { backgroundPosition: "50% -300px" },
            { backgroundPosition: "50% 0px", duration: 1.5, ease: "back.out(1.7)" }
        );

        // Separate, fast animations for the hero text and inline avatar
        tl.from([".hero-greeting", ".hero-im", ".hero-inline-avatar", ".hero-name"], {
            y: 30,
            opacity: 0,
            scale: 0.9,
            duration: 0.4,
            stagger: 0.1,
            ease: "back.out(1.5)"
        }, "-=1.3");


        // Apply BlurText animation ONLY to the first subtitle line: "I’m a Web Developer and"
        const firstSubtitle = document.querySelectorAll(".hero-subtitle-line")[0];
        if (firstSubtitle) {
            const targets = Array.from(firstSubtitle.children);
            tl.fromTo(targets,
                { filter: 'blur(10px)', opacity: 0, y: -50 },
                {
                    keyframes: [
                        { filter: 'blur(5px)', opacity: 0.5, y: 5, duration: 0.4 },
                        { filter: 'blur(0px)', opacity: 1, y: 0, duration: 0.4 }
                    ],
                    stagger: 0.15,
                    ease: "power2.out"
                },
                "-=0.6"
            );
        }

        // Simple animation for the rest of the subtitle and status
        const secondSubtitle = document.querySelectorAll(".hero-subtitle-line")[1];
        if (secondSubtitle) {
            tl.from(secondSubtitle, {
                y: 30,
                opacity: 0,
                duration: 0.8
            }, "-=0.6");
        }

        // Recovered the button and footer description animation
        tl.from(".hero-footer", {
            y: 30,
            opacity: 0,
            duration: 0.8
        }, "-=0.6");


        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);


            gsap.from(".intro-section", {
                scrollTrigger: {
                    trigger: ".intro-section",
                    start: "top 100%",
                    end: "top 20%",
                    scrub: 1
                },
                scale: 0.8,
                y: 100,
                transformOrigin: "center bottom",
                opacity: 0,
                borderRadius: "40px",
                ease: "power2.out"
            });

            // Intro Section Reveal Animation
            const introRevealTexts = gsap.utils.toArray('.intro-section .intro-reveal-text');
            gsap.from(introRevealTexts, {
                y: "110%",
                opacity: 0,
                duration: 1.2,
                ease: "power4.out",
                stagger: 0.1,
                scrollTrigger: {
                    trigger: ".intro-section",
                    start: "top 75%",
                    toggleActions: "restart none none reverse"
                }
            });

            const sections = [".design-section", ".footer-section", ".story-section", ".highlights-section", ".skills-hero", ".skills-interaction-section"];

            sections.forEach(section => {
                gsap.from(section, {
                    scrollTrigger: {
                        trigger: section,
                        start: "top 100%",
                        end: "top 20%",
                        scrub: 1
                    },
                    scale: 0.8,
                    y: 100,
                    transformOrigin: "center bottom",
                    opacity: 0,
                    borderRadius: "40px",
                    ease: "power2.out"
                });
            });

            gsap.fromTo(".bento-item",
                { y: 50, scale: 0.95, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: ".bento-section",
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    },
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "back.out(1.2)"
                }
            );

            // Services Section Reveal Animation
            const servicesRevealTexts = gsap.utils.toArray('.scroll-stack-header .reveal-text');
            if (servicesRevealTexts.length > 0) {
                gsap.from(servicesRevealTexts, {
                    y: "110%",
                    opacity: 0,
                    duration: 1.2,
                    ease: "power4.out",
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: ".scroll-stack-section",
                        start: "top 75%",
                        toggleActions: "restart none none reverse"
                    }
                });
            }


            // Premium GSAP Classic Image Slider (Fade Auto-only)
            const sliderTrack = document.querySelector('.classic-slider-track');
            const slides = document.querySelectorAll('.classic-slide');

            if (sliderTrack && slides.length > 0) {
                let currentSlide = 0;
                let isAnimating = false;

                // Setup initial layout where slides are stacked and hidden except the first
                gsap.set(slides, { opacity: 0, visibility: "hidden" });
                gsap.set(slides[0], { opacity: 1, visibility: "visible" });

                function goToSlide(index) {
                    if (isAnimating || slides.length < 2) return;
                    isAnimating = true;

                    const prevSlide = currentSlide;

                    // Handle seamless index wrapping
                    if (index >= slides.length) currentSlide = 0;
                    else if (index < 0) currentSlide = slides.length - 1;
                    else currentSlide = index;

                    // Elegantly crossfade the outgoing slide
                    gsap.to(slides[prevSlide], {
                        opacity: 0,
                        duration: 1.5,
                        ease: "power2.inOut",
                        onComplete: () => gsap.set(slides[prevSlide], { visibility: "hidden" })
                    });

                    // Elegantly crossfade the incoming slide
                    gsap.set(slides[currentSlide], { visibility: "visible" });
                    gsap.to(slides[currentSlide], {
                        opacity: 1,
                        duration: 1.5,
                        ease: "power2.inOut",
                        onComplete: () => isAnimating = false
                    });
                }

                // Auto sliding every 5 seconds
                let autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);

                // Pause auto-slider when hovering
                const sliderContainer = document.querySelector('.classic-slider-container');
                sliderContainer.addEventListener('mouseenter', () => clearInterval(autoSlide));
                sliderContainer.addEventListener('mouseleave', () => {
                    autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
                });
            }

            // Expertise Section Text Rotation Animation
            const expertiseList = document.querySelector(".expertise-list");
            const expertiseItems = gsap.utils.toArray(".expertise-item");
            if (expertiseList && expertiseItems.length > 0) {
                // Ensure no translations from previous logic remain
                gsap.set(expertiseList, { clearProps: "y" });

                // Words array initialized from the original HTML content
                const words = ["Performance", "Visibility", "Growth", "Design", "Development", "Frontend", "Seo"];
                const totalWords = words.length;

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".expertise-section",
                        start: "center center",
                        end: "+=200%",
                        pin: true,
                        scrub: true,
                        toggleClass: "is-pinned",
                        onUpdate: (self) => {
                            const progress = self.progress;
                            let offset = Math.floor(progress * totalWords);
                            if (offset >= totalWords) offset = totalWords - 1;

                            expertiseItems.forEach((item, i) => {
                                const wordIndex = (i + offset) % totalWords;
                                item.innerText = words[wordIndex];
                            });
                        }
                    }
                });
            }

                // Interactive Circle Animation
                const icRing = document.querySelector('.ic-ring');
                const icItems = document.querySelectorAll('.ic-item');
                
                if (icRing && icItems.length > 0) {
                    let currentRadius = 330; // Slightly smaller round
                    const numItems = icItems.length;

                    // Initial positioning
                    function updatePositions(radius) {
                        icItems.forEach((item, index) => {
                            const angle = (index / numItems) * Math.PI * 2;
                            const x = Math.cos(angle) * radius;
                            const y = Math.sin(angle) * radius;
                            gsap.set(item, { x: x, y: y, xPercent: -50, yPercent: -50 });
                        });
                    }
                    
                    // Positions will be set by handleICResize

                    // Rotation Animation Style Logic
                    let rotationTl;
                    function setupRotation(styleValue) {
                        if (rotationTl) rotationTl.kill();
                        
                        let currentRot = gsap.getProperty(icRing, "rotation") || 0;
                        let currentItemsRot = gsap.getProperty(icItems[0], "rotation") || 0;
                        
                        if (styleValue >= 50) {
                            // Linear mode (Smooth continuous rotation) - FASTER
                            rotationTl = gsap.timeline({ repeat: -1 });
                            rotationTl.to(icRing, { rotation: currentRot + 360, duration: 15, ease: "none" }, 0)
                                      .to(icItems, { rotation: currentItemsRot - 360, duration: 15, ease: "none" }, 0);
                        } else {
                            // Push mode (Step by step one by one image) - FASTER
                            rotationTl = gsap.timeline({ repeat: -1 });
                            const stepAngle = 360 / numItems;
                            for (let i = 1; i <= numItems; i++) {
                                rotationTl.to(icRing, {
                                    rotation: currentRot + (stepAngle * i),
                                    duration: 0.5,
                                    ease: "power3.inOut"
                                })
                                .to(icItems, {
                                    rotation: currentItemsRot - (stepAngle * i),
                                    duration: 0.5,
                                    ease: "power3.inOut"
                                }, "<") // animate simultaneously
                                .to({}, { duration: 0.8 }); // Faster Pause between pushes
                            }
                        }
                    }
                    
                    // Initialize with Linear (100)
                    setupRotation(100);

                    // Controls Logic
                    const radiusInput = document.getElementById('ic-radius');
                    const sizeInput = document.getElementById('ic-size');
                    const styleInput = document.getElementById('ic-style');

                    if (radiusInput) {
                        radiusInput.addEventListener('input', (e) => {
                            gsap.to(icItems, { borderRadius: `${e.target.value}%`, duration: 0.3 });
                        });
                    }

                    let currentBaseSize = 120;

                    function handleICResize() {
                        if (window.innerWidth < 768) {
                            currentRadius = 130;
                        } else if (window.innerHeight < 800) {
                            currentRadius = 250; // Medium for laptops
                        } else {
                            currentRadius = 330; // Large for desktops
                        }
                        updatePositions(currentRadius);
                        
                        let baseVal = sizeInput ? parseInt(sizeInput.value) : 120;
                        currentBaseSize = window.innerWidth < 768 ? baseVal * 0.6 : baseVal;
                    }
                    
                    window.addEventListener('resize', handleICResize);
                    handleICResize();

                    if (sizeInput) {
                        sizeInput.addEventListener('input', (e) => {
                            currentBaseSize = window.innerWidth < 768 ? parseInt(e.target.value) * 0.6 : parseInt(e.target.value);
                        });
                    }

                    // Dynamically scale items based on their global position (Left = Small, Right = Large)
                    gsap.ticker.add(() => {
                        const ringRot = gsap.getProperty(icRing, "rotation") * (Math.PI / 180);
                        
                        icItems.forEach((item, index) => {
                            const baseAngle = (index / numItems) * Math.PI * 2;
                            const globalAngle = baseAngle + ringRot;
                            
                            // Math.cos(globalAngle) is -1 on the left, +1 on the right
                            const scaleFactor = 0.5 + (Math.cos(globalAngle) * 0.5); // Maps to 0.0 -> 1.0
                            const finalScale = 0.5 + (0.5 * scaleFactor); // Maps to 0.5 -> 1.0
                            
                            const finalSize = currentBaseSize * finalScale;
                            gsap.set(item, { 
                                width: finalSize, 
                                height: finalSize,
                                fontSize: (finalSize * 0.25) + "px" // Scale text items proportionally
                            });
                        });
                    });

                    if (styleInput) {
                        styleInput.addEventListener('change', (e) => {
                            const styleValue = parseInt(e.target.value);
                            setupRotation(styleValue);
                        });
                    }

                    // Scroll Entry Animation for Interactive Circle Section
                    gsap.from(".ic-controls", {
                        scrollTrigger: {
                            trigger: ".interactive-circle-section",
                            start: "top 70%",
                        },
                        opacity: 0,
                        scale: 0.8,
                        duration: 1,
                        ease: "back.out(1.7)"
                    });

                    gsap.from(icItems, {
                        scrollTrigger: {
                            trigger: ".interactive-circle-section",
                            start: "top 60%",
                        },
                        opacity: 0,
                        scale: 0,
                        stagger: 0.1,
                        duration: 1.5,
                        ease: "back.out(1.5)"
                    });
                }

        }
    }
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = toggleBtn.querySelector('i');
    function toggleTheme() {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    }
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            const rect = toggleBtn.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            document.documentElement.style.setProperty('--click-x', `${x}px`);
            document.documentElement.style.setProperty('--click-y', `${y}px`);
            if (document.startViewTransition) {
                document.startViewTransition(() => {
                    toggleTheme();
                });
            } else {
                toggleTheme();
            }
        });
    }
    const follower = document.querySelector('.cursor-follower');
    if (follower && window.matchMedia("(hover: hover)").matches && window.innerWidth > 1024) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        function animateFollower() {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;

            follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
            requestAnimationFrame(animateFollower);
        }
        animateFollower();
    } else if (follower) {
        follower.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP and ScrollTrigger are loaded
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        initScrollStack();
    }
});

function initScrollStack() {
    const cards = gsap.utils.toArray('.scroll-stack-item');

    cards.forEach((card, index) => {
        // Create an animation for each card as it scrolls into the stack
        // We only animate the cards that are NOT the last one to scale down and fade
        if (index < cards.length - 1) {
            gsap.to(card, {
                scrollTrigger: {
                    trigger: cards[index + 1], // Triggered when the NEXT card starts coming up
                    start: "top 80%", // Start early for smooth transition
                    end: "top 100px",
                    scrub: true,
                },
                scale: 0.9,
                opacity: 0.6,
                filter: "blur(2px) brightness(0.4)",
            });
        }
    });

    // Refresh ScrollTrigger to ensure correct calculations
    ScrollTrigger.refresh();
}
// Disable right-click and inspect element shortcuts to protect code
document.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('keydown', (e) => {
    // Disable F12
    if (e.key === 'F12') {
        e.preventDefault();
    }
    // Disable Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element Inspect)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
    }
    // Disable Ctrl+U (View Source)
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
    }
    // Disable Ctrl+S (Save)
    if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
    }
});


/* ── Reviews Slider ─────────────────────────────── */
window.initReviewsSlider = function () {
    const track = document.getElementById('reviewsTrack');
    const wrapper = track ? track.closest('.reviews-track-wrapper') : null;
    const prevBtn = document.querySelector('.reviews-prev');
    const nextBtn = document.querySelector('.reviews-next');

    if (!track || !wrapper) return;

    const cards = track.querySelectorAll('.review-card');
    const totalCards = cards.length;
    if (totalCards === 0) return;

    let currentIndex = 0;
    let cardWidth = 0;
    const gap = 24;
    let visibleCount = 3;

    function getVisibleCount() {
        const w = window.innerWidth;
        if (w <= 640) return 1;
        if (w <= 1024) return 2;
        return 3;
    }

    function updateDimensions() {
        visibleCount = getVisibleCount();
        const totalGap = gap * (visibleCount - 1);
        cardWidth = (wrapper.offsetWidth - totalGap) / visibleCount;

        cards.forEach(card => {
            card.style.minWidth = cardWidth + 'px';
            card.style.maxWidth = cardWidth + 'px';
        });

        const maxIndex = Math.max(0, totalCards - visibleCount);
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        applyTransform(false);
    }

    function applyTransform(animate) {
        const offset = currentIndex * (cardWidth + gap);
        track.style.transition = animate === false ? 'none' : 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
        track.style.transform = 'translateX(-' + offset + 'px)';
    }

    function goNext() {
        const maxIndex = Math.max(0, totalCards - visibleCount);
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        applyTransform(true);
    }

    function goPrev() {
        const maxIndex = Math.max(0, totalCards - visibleCount);
        currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
        applyTransform(true);
    }

    // Remove old listeners by cloning buttons
    const newNext = nextBtn.cloneNode(true);
    const newPrev = prevBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNext, nextBtn);
    prevBtn.parentNode.replaceChild(newPrev, prevBtn);

    newNext.addEventListener('click', goNext);
    newPrev.addEventListener('click', goPrev);

    // Drag / swipe
    let startX = 0;
    let isDragging = false;

    wrapper.addEventListener('mousedown', function(e) { startX = e.clientX; isDragging = true; });
    wrapper.addEventListener('mouseup', function(e) {
        if (!isDragging) return;
        isDragging = false;
        const diff = e.clientX - startX;
        if (Math.abs(diff) > 50) { diff < 0 ? goNext() : goPrev(); }
    });
    wrapper.addEventListener('mouseleave', function() { isDragging = false; });

    wrapper.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
    wrapper.addEventListener('touchend', function(e) {
        const diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) > 40) { diff < 0 ? goNext() : goPrev(); }
    });

    // Auto-play
    if (window._reviewsAutoPlay) clearInterval(window._reviewsAutoPlay);
    window._reviewsAutoPlay = setInterval(goNext, 6000);
    wrapper.addEventListener('mouseenter', function() { clearInterval(window._reviewsAutoPlay); });
    wrapper.addEventListener('mouseleave', function() { window._reviewsAutoPlay = setInterval(goNext, 6000); });

    window.removeEventListener('resize', window._reviewsResizeHandler);
    window._reviewsResizeHandler = updateDimensions;
    window.addEventListener('resize', window._reviewsResizeHandler);

    updateDimensions();
};


