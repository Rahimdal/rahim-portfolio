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


/* Skiper71 3D Stacked Push Scroll Slider */
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const data = [
        { 
            src: 'assets/images/projects/Gym-mockup.webp', 
            title: 'Gym Website',   
            note: 'A premium fitness website built with React, GSAP animations, scroll-triggered effects, and fully responsive layout.',
            cat: 'React / GSAP',
            url: 'https://gym-tau-lemon.vercel.app/',
            rot: -3
        },
        { 
            src: 'assets/images/projects/Interior-mockup.webp', 
            title: 'Interior Design Platform', 
            note: 'Immersive interior design site featuring Framer Motion, Lenis smooth scrolling, and elegant visual aesthetic.',
            cat: 'React / Motion',
            url: 'https://interior-eight-jade.vercel.app/',
            rot: 4
        },
        { 
            src: 'assets/images/projects/Photography-mockup.webp', 
            title: 'Photography Portfolio',   
            note: 'A visually stunning custom-built photography portfolio designed to showcase high-quality images with smooth interactions.',
            cat: 'HTML / CSS / JS',
            url: 'https://photography-website-henna-delta.vercel.app/',
            rot: -4
        },
        { 
            src: 'assets/images/projects/sarees.webp',  
            title: 'Traditional Saree Brand',  
            note: 'An elegant e-commerce experience celebrating authentic heritage sarees, rich craftsmanship, and seamless online ordering.',
            cat: 'Custom Web / E-Commerce',
            url: 'https://rahimdal.github.io/modern-sari/',
            rot: 3
        },
        { 
            src: 'assets/images/projects/Clothing.webp',  
            title: 'Clothing Store Website',  
            note: 'A modern, responsive online clothing storefront with custom layout enhancements, fast performance, and sleek product showcases.',
            cat: 'E-Commerce / Brand',
            url: 'https://www.social.ct.ws/',
            rot: -2
        }
    ];

    const pushStage = document.getElementById('pushStage');
    const pushRail  = document.getElementById('pushRail');
    const wrap      = document.getElementById('pushCardsWrap');

    if (!pushStage || !wrap) return;

    pushStage.innerHTML = '';
    if (pushRail) pushRail.innerHTML = '';

    const cards = [];
    const ticks = [];
    const n = data.length;

    data.forEach((d, i) => {
        const card = document.createElement('div');
        card.className = 'push-card';
        card.dataset.index = i;
        const isExternal = d.url.startsWith('http');
        card.innerHTML = `
          <div class="push-card-inner">
            <div class="push-card-img-wrap">
              <img src="${d.src}" alt="${d.title}" />
            </div>
            <div class="push-card-content">
              <span class="push-card-num">0${i+1} / 0${n} &bull; ${d.cat}</span>
              <h3>${d.title}</h3>
              <p>${d.note}</p>
              <a href="${d.url}" class="proj-visit-btn" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                <span>Visit Website</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </a>
            </div>
          </div>`;
        pushStage.appendChild(card);
        cards.push(card);

        if (pushRail) {
            const tick = document.createElement('div');
            tick.className = 'tick' + (i === 0 ? ' active' : '');
            tick.dataset.index = i;
            tick.innerHTML = `<span class="dash"></span><span>0${i+1}</span>`;
            pushRail.appendChild(tick);
            ticks.push(tick);
        }
    });

    if (pushRail) pushStage.appendChild(pushRail);

    // Set container height so scrolling pins the stage across all cards
    wrap.style.height = (n * 110) + 'vh';

    // Initial Stack Configuration: cards stack in 3D depth with slight rotations
    const setStackState = () => {
        cards.forEach((card, i) => {
            const depth = i * 36; // translateY offset down stack
            const zDepth = -i * 50; // translateZ back in depth
            const scale = 1 - (i * 0.04); // scale down cards further back
            const rot = data[i].rot || (i % 2 === 0 ? -3 : 3);
            
            gsap.set(card, {
                y: depth,
                z: zDepth,
                rotation: rot,
                scale: scale,
                opacity: i > 3 ? 0 : (1 - i * 0.12),
                zIndex: n - i
            });
        });
    };

    setStackState();

    // GSAP ScrollTrigger to PUSH each card UP & AWAY one by one as user scrolls
    const masterTl = gsap.timeline({
        scrollTrigger: {
            trigger: wrap,
            start: 'top top',
            end: 'bottom bottom',
            pin: pushStage,
            pinSpacing: true,
            scrub: 0.7,
            onUpdate: (self) => {
                const activeIdx = Math.min(n - 1, Math.floor(self.progress * n));
                if (ticks.length) {
                    ticks.forEach((t, i) => t.classList.toggle('active', i === activeIdx));
                }
            }
        }
    });

    // Create Push-up step for each card (0 to n-2)
    for (let i = 0; i < n - 1; i++) {
        const card = cards[i];
        const nextCards = cards.slice(i + 1);

        // Current card pushes UP, rotates, and fades away into upper depth
        masterTl.to(card, {
            y: -140 - (i * 20),
            z: 100,
            rotation: data[i].rot * 2.5,
            scale: 1.08,
            opacity: 0,
            duration: 1,
            ease: 'power2.inOut'
        }, i);

        // Next cards step forward in the stack to take center stage
        nextCards.forEach((nc, idx) => {
            const newPos = idx; // 0 is now front, 1 is next behind, etc.
            const depth = newPos * 36;
            const zDepth = -newPos * 50;
            const scale = 1 - (newPos * 0.04);
            const rot = data[i + 1 + idx].rot;

            masterTl.to(nc, {
                y: depth,
                z: zDepth,
                rotation: rot,
                scale: scale,
                opacity: newPos > 3 ? 0 : (1 - newPos * 0.12),
                duration: 1,
                ease: 'power2.inOut'
            }, i);
        });
    }

    // Rail tick click navigation
    if (ticks.length) {
        ticks.forEach((t, i) => {
            t.addEventListener('click', () => {
                const target = wrap.offsetTop + (wrap.offsetHeight * (i / n)) + 10;
                if (typeof gsap !== 'undefined' && gsap.plugins && gsap.plugins.scrollTo) {
                    gsap.to(window, { scrollTo: target, duration: 1, ease: 'power2.inOut' });
                } else {
                    window.scrollTo({ top: target, behavior: 'smooth' });
                }
            });
        });
    }
});

