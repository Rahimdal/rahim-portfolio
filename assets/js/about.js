   // Simple animation for about page elements
        document.addEventListener("DOMContentLoaded", () => {
            gsap.from(".about-title-line", {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power4.out"
            });

            gsap.from(".about-lead", {
                y: 50,
                opacity: 0,
                duration: 1,
                delay: 0.5,
                ease: "power3.out"
            });
        });