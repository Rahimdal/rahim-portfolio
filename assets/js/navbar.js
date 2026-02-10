document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    const toggleMenu = () => {
        const isActive = mobileMenuBtn.classList.contains('active');

        if (!isActive) {
            mobileMenuBtn.classList.add('active');
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden';

            if (typeof gsap !== 'undefined') {
                gsap.to(mobileNav, {
                    clipPath: "circle(150% at 100% 0%)",
                    opacity: 1,
                    duration: 1,
                    ease: "power4.inOut"
                });

                gsap.fromTo(mobileLinks,
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.2 }
                );
            } else {
                mobileNav.style.opacity = '1';
                mobileNav.style.pointerEvents = 'auto';
            }
        } else {
            mobileMenuBtn.classList.remove('active');
            document.body.style.overflow = '';

            if (typeof gsap !== 'undefined') {
                gsap.to(mobileNav, {
                    clipPath: "circle(0% at 100% 0%)",
                    opacity: 0,
                    duration: 0.8,
                    ease: "power4.inOut",
                    onComplete: () => {
                        mobileNav.classList.remove('active');
                    }
                });
            } else {
                mobileNav.classList.remove('active');
                mobileNav.style.opacity = '0';
                mobileNav.style.pointerEvents = 'none';
            }
        }
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuBtn.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    if (typeof gsap !== 'undefined') {
        gsap.from(".navbar", {
            duration: 1,
            clipPath: "inset(0 100% 0 0)",
            ease: "power4.out",
            delay: 0.2,
            clearProps: "all"
        });
    }
});
