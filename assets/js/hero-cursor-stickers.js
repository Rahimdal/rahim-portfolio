
/**
 * Hero Cursor Stickers Animation
 * Ported & Smoothed from artemartemartem-clone-2 / CursorStickers.js
 */
document.addEventListener("DOMContentLoaded", () => {
    // Desktop hover check
    if (!window.matchMedia("(hover: hover)").matches || window.innerWidth <= 768) return;

    const container = document.getElementById("cursor-stickers-container");
    const hero = document.querySelector(".hero-section");

    if (!container || !hero) return;

    const stickerEls = Array.from(container.querySelectorAll(".cursor-sticker"));
    if (stickerEls.length === 0) return;

    let currentIndex = 0;
    let lastPos = { x: 0, y: 0 };
    let globalZ = 100;

    const handleMouseMove = (e) => {
        // Disable stickers if user scrolled down past hero section
        if (window.scrollY > window.innerHeight * 0.75) return;

        // Check if mouse cursor is within hero section bounds
        const heroRect = hero.getBoundingClientRect();
        if (
            e.clientY < heroRect.top ||
            e.clientY > heroRect.bottom ||
            e.clientX < heroRect.left ||
            e.clientX > heroRect.right
        ) {
            return;
        }

        const { clientX: x, clientY: y } = e;

        // Smooth distance threshold for fluid spacing
        const dist = Math.hypot(x - lastPos.x, y - lastPos.y);

        if (dist > 85) {
            lastPos = { x, y };

            const img = stickerEls[currentIndex];
            if (img) {
                if (typeof gsap !== "undefined") {
                    gsap.killTweensOf(img);

                    globalZ += 1;

                    // Initial smooth entrance state
                    gsap.set(img, {
                        x: x - img.offsetWidth / 2,
                        y: y - img.offsetHeight / 2,
                        opacity: 1,
                        scale: 0.6,
                        rotation: Math.random() * 24 - 12,
                        zIndex: globalZ
                    });

                    // Silky pop in animation
                    gsap.to(img, {
                        scale: 1,
                        duration: 0.45,
                        ease: "back.out(1.2)"
                    });

                    // Elegant drop off the bottom of the screen with smooth gravity
                    gsap.to(img, {
                        y: window.innerHeight + img.offsetHeight + 50,
                        rotation: "+=20",
                        duration: 0.85,
                        delay: 0.35,
                        ease: "power2.in",
                        onComplete: () => {
                            gsap.set(img, { opacity: 0 });
                        }
                    });

                    // Soft fade out near the bottom of fall
                    gsap.to(img, {
                        opacity: 0,
                        duration: 0.35,
                        delay: 0.8,
                        ease: "power1.out"
                    });
                }
            }

            currentIndex = (currentIndex + 1) % stickerEls.length;
        }
    };

    window.addEventListener("mousemove", handleMouseMove);
});
