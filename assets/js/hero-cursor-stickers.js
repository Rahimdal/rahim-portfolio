/**
 * Hero Cursor Stickers Animation
 * Ported directly from artemartemartem-clone-2 / CursorStickers.js
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

        // Distance threshold to spawn a new sticker (same as artemartemartem clone)
        const dist = Math.hypot(x - lastPos.x, y - lastPos.y);

        if (dist > 75) {
            lastPos = { x, y };

            const img = stickerEls[currentIndex];
            if (img) {
                // Reset any running GSAP animation on this image
                if (typeof gsap !== "undefined") {
                    gsap.killTweensOf(img);

                    // Position and animate in (artemartemartem exact logic)
                    gsap.set(img, {
                        x: x - img.offsetWidth / 2,
                        y: y - img.offsetHeight / 2,
                        opacity: 1,
                        scale: 0.5,
                        rotation: Math.random() * 40 - 20,
                        zIndex: 100 + currentIndex
                    });

                    gsap.to(img, {
                        scale: 1,
                        duration: 0.4,
                        ease: "back.out(1.5)"
                    });

                    // Animate out: Drop off the bottom of the screen with gravity
                    gsap.to(img, {
                        y: window.innerHeight + img.offsetHeight,
                        rotation: "+=30",
                        duration: 0.6,
                        delay: 0.4,
                        ease: "power2.in",
                        onComplete: () => {
                            gsap.set(img, { opacity: 0 });
                        }
                    });
                }
            }

            currentIndex = (currentIndex + 1) % stickerEls.length;
        }
    };

    window.addEventListener("mousemove", handleMouseMove);
});

