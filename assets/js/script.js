document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(".hero-section",
            { backgroundPosition: "50% -300px" },
            { backgroundPosition: "50% 0px", duration: 1.5, ease: "back.out(1.7)" }
        )
            .from(".hero-title", {
                y: 50,
                opacity: 0,
                duration: 0.8
            }, "-=1.2")
            .from(".hero-subtitle-line", {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15
            }, "-=0.6")
            .from(".hero-footer", {
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
            gsap.from(".intro-container", {
                scrollTrigger: {
                    trigger: ".intro-section",
                    start: "top 70%"
                },
                y: 30,
                opacity: 0,
                duration: 1
            });
            const sections = [".bento-section", ".services-section", ".design-section", ".footer-section", ".story-section", ".highlights-section", ".skills-hero", ".skills-interaction-section"];

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
