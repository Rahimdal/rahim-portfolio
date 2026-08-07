/*
  TextRoll component script for turning-ideas-textroll
  - Two stacked character rows: top row exits upward, bottom (orange) row
    enters from below, staggered per character on hover.
  - Scroll Abyss animation: each word blurs in from abyss depth, focuses sharply, 
    and blurs out separately as you scroll past.
*/

document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        function TextRoll(el) {
            const text = el.getAttribute('data-text');
            if (!text) return;
            const center = el.getAttribute('data-center') === 'true';
            const chars = [...text];

            el.innerHTML = '';

            const buildRow = (cls) => {
                const row = document.createElement('div');
                row.className = 'roll-row ' + cls;
                chars.forEach(ch => {
                    const span = document.createElement('span');
                    span.className = 'char';
                    span.textContent = ch === ' ' ? '\u00A0' : ch;
                    row.appendChild(span);
                });
                return row;
            };

            const top = buildRow('top');
            const bottom = buildRow('bottom');
            el.appendChild(top);
            el.appendChild(bottom);

            el.style.height = top.getBoundingClientRect().height + 'px';

            const topChars = top.querySelectorAll('.char');
            const bottomChars = bottom.querySelectorAll('.char');

            gsap.set(bottomChars, { yPercent: 100 });

            const staggerConfig = center
                ? { each: 0.025, from: 'center' }
                : { each: 0.025, from: 'start' };

            const tl = gsap.timeline({ paused: true });
            tl.to(topChars, {
                yPercent: -100,
                duration: 0.45,
                ease: 'power3.inOut',
                stagger: staggerConfig
            }, 0)
            .to(bottomChars, {
                yPercent: 0,
                duration: 0.45,
                ease: 'power3.inOut',
                stagger: staggerConfig
            }, 0);

            el.addEventListener('mouseenter', () => tl.play());
            el.addEventListener('mouseleave', () => tl.reverse());
            // touch support for mobile — tap plays the roll once
            el.addEventListener('touchstart', () => {
                tl.play();
                clearTimeout(el._touchTimer);
                el._touchTimer = setTimeout(() => tl.reverse(), 900);
            }, { passive: true });

            return el;
        }

        function initAll() {
            document.querySelectorAll('.text-roll').forEach(TextRoll);
        }

        initAll();

        // re-measure row heights on resize so responsive font-size (clamp) never clips
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                document.querySelectorAll('.text-roll').forEach(el => {
                    const top = el.querySelector('.roll-row.top');
                    if (top) el.style.height = top.getBoundingClientRect().height + 'px';
                });
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                }
            }, 150);
        });

        /* ---------- Scroll Abyss & Separate Blur Out Animation per Word ---------- */
        if (typeof ScrollTrigger !== 'undefined') {
            const words = document.querySelectorAll('.headline .text-roll');

            words.forEach((word) => {
                // Set initial state deep in abyss with strong blur
                gsap.set(word, {
                    opacity: 0,
                    y: 70,
                    scale: 0.78,
                    filter: 'blur(18px)'
                });

                // Timeline per word scrubbing smoothly on scroll
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: word,
                        start: 'top 95%',
                        end: 'bottom 10%',
                        scrub: 0.6,
                        toggleActions: 'play reverse play reverse'
                    }
                });

                // Phase 1: Emerge from abyss, fade in & blur out to clear focus
                tl.to(word, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 0.4,
                    ease: 'power2.out'
                })
                // Phase 2: Hold focused state through center scroll zone
                .to(word, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 0.35
                })
                // Phase 3: Blur out into upper abyss when scrolling past
                .to(word, {
                    opacity: 0,
                    y: -50,
                    scale: 0.85,
                    filter: 'blur(16px)',
                    duration: 0.4,
                    ease: 'power2.in'
                });
            });

            // Animate button at bottom of textroll section
            const btnWrapper = document.querySelector('.textroll-btn-wrapper');
            if (btnWrapper) {
                gsap.set(btnWrapper, { opacity: 0, y: 50, filter: 'blur(12px)' });
                gsap.to(btnWrapper, {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: btnWrapper,
                        start: 'top 92%',
                        toggleActions: 'play none none reverse'
                    }
                });
            }
        }
    }
});

