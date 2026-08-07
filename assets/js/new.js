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


/* Skiper71 Image Reveal Script */
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);
    if (typeof ScrollToPlugin !== 'undefined') {
        gsap.registerPlugin(ScrollToPlugin);
    }

    const data = [
        { 
            src: 'assets/images/projects/Gym-mockup.webp', 
            title: 'Gym Website',   
            note: 'A premium fitness website built with React, GSAP animations, scroll-triggered effects, and fully responsive layout.',
            cat: 'React / GSAP',
            url: 'https://gym-tau-lemon.vercel.app/'
        },
        { 
            src: 'assets/images/projects/Interior-mockup.webp', 
            title: 'Interior Design Platform', 
            note: 'Immersive interior design site featuring Framer Motion, Lenis smooth scrolling, and elegant visual aesthetic.',
            cat: 'React / Motion',
            url: 'https://interior-eight-jade.vercel.app/'
        },
        { 
            src: 'assets/images/projects/Photography-mockup.webp', 
            title: 'Photography Portfolio',   
            note: 'A visually stunning custom-built photography portfolio designed to showcase high-quality images with smooth interactions.',
            cat: 'HTML / CSS / JS',
            url: 'https://photography-website-henna-delta.vercel.app/'
        },
        { 
            src: 'assets/images/projects/sarees.webp',  
            title: 'Traditional Saree Brand',  
            note: 'An elegant e-commerce experience celebrating authentic heritage sarees, rich craftsmanship, and seamless online ordering.',
            cat: 'E-Commerce / Brand',
            url: 'projects/'
        },
        { 
            src: 'assets/images/projects/Clothing.webp',  
            title: 'Clothing Store Website',  
            note: 'A modern, responsive online clothing storefront with custom layout enhancements, fast performance, and sleek product showcases.',
            cat: 'Custom Web / E-Commerce',
            url: 'projects/'
        }
    ];

    const stage = document.getElementById('stage');
    const rail  = document.getElementById('rail');
    const wrap  = document.getElementById('revealWrap');

    if (!stage || !rail || !wrap) return;

    // Clear existing inner content except rail
    stage.innerHTML = '';
    rail.innerHTML = '';

    data.forEach((d, i) => {
        const frame = document.createElement('div');
        frame.className = 'frame';
        frame.dataset.index = i;
        const isExternal = d.url.startsWith('http');
        frame.innerHTML = `
          <img src="${d.src}" alt="${d.title}" />
          <div class="cap">
            <span class="num">0${i+1} / 0${data.length} &bull; ${d.cat}</span>
            <h2>${d.title}</h2>
            <p>${d.note}</p>
            <div class="cap-btn-wrap">
                <a href="${d.url}" class="proj-visit-btn" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                    <span>Visit Website</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                </a>
            </div>
          </div>`;
        stage.appendChild(frame);

        const tick = document.createElement('div');
        tick.className = 'tick' + (i === 0 ? ' active' : '');
        tick.dataset.index = i;
        tick.innerHTML = `<span class="dash"></span><span>0${i+1}</span>`;
        rail.appendChild(tick);
    });

    stage.appendChild(rail);

    const frames = gsap.utils.toArray('#stage .frame');
    const ticks  = gsap.utils.toArray('#rail .tick');
    const caps   = gsap.utils.toArray('#stage .cap');
    const imgs   = gsap.utils.toArray('#stage .frame img');

    const n = frames.length;

    wrap.style.height = (n * 100) + 'vh';

    ScrollTrigger.create({
        trigger: wrap,
        start: 'top top',
        end: 'bottom bottom',
        pin: stage,
        pinSpacing: false,
        scrub: 0.6,
        onUpdate(self) {
            const overall = self.progress;
            const activeIdx = Math.min(n - 1, Math.floor(overall * n));
            const activeLocal = gsap.utils.clamp(0, 1, (overall - activeIdx / n) / (1 / n));

            frames.forEach((f, i) => {
                const segStart = i / n;
                const segEnd   = (i + 1) / n;
                let local = (overall - segStart) / (segEnd - segStart);
                local = gsap.utils.clamp(0, 1, local);

                const clipTop = gsap.utils.interpolate(100, 0, local);
                f.style.clipPath = `inset(${clipTop}% 0% 0% 0%)`;

                const bright = i < activeIdx
                    ? 0.55
                    : gsap.utils.interpolate(0.45, 1, local);
                const scale = gsap.utils.interpolate(1.12, 1.0, local);
                imgs[i].style.filter = `brightness(${bright}) saturate(${gsap.utils.interpolate(0.85, 1, local)})`;
                imgs[i].style.transform = `scale(${scale})`;

                let capOpacity = 0;
                let capY = 24;
                if (i === activeIdx) {
                    const capLocal = gsap.utils.clamp(0, 1, (activeLocal - 0.15) / 0.55);
                    capOpacity = capLocal;
                    capY = gsap.utils.interpolate(24, 0, capLocal);
                } else if (i === activeIdx - 1) {
                    const exitLocal = gsap.utils.clamp(0, 1, activeLocal * 4);
                    capOpacity = 1 - exitLocal;
                    capY = gsap.utils.interpolate(0, -16, exitLocal);
                }
                caps[i].style.opacity = capOpacity;
                caps[i].style.transform = `translateY(${capY}px)`;

                f.style.zIndex = i;
            });

            ticks.forEach((t, i) => t.classList.toggle('active', i === activeIdx));
        }
    });

    ticks.forEach((t, i) => {
        t.style.cursor = 'pointer';
        t.addEventListener('click', () => {
            const target = wrap.offsetTop + (wrap.offsetHeight * (i / n)) + 10;
            if (typeof gsap !== 'undefined' && gsap.plugins && gsap.plugins.scrollTo) {
                gsap.to(window, { scrollTo: target, duration: 1, ease: 'power2.inOut' });
            } else {
                window.scrollTo({ top: target, behavior: 'smooth' });
            }
        });
    });
});


