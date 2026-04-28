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

    if (follower && window.matchMedia("(hover: hover)").matches) {
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

