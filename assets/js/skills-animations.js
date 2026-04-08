document.addEventListener("DOMContentLoaded", () => {
    // Register plugin if not already
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    const icons = document.querySelectorAll(".gsap-skill-icon");
    const container = document.getElementById("gsap-skills-container");
    const footer = document.querySelector(".footer-section");

    if (!icons.length || !container || !footer) return;

    const iconData = [];
    
    const width = footer.clientWidth;
    const height = footer.clientHeight;

    // Setup initial positions visually randomly scattered in the footer
    icons.forEach((icon, i) => {
        let baseX, baseY;
        let isOverlapping = true;
        let attempts = 0;

        // Rejection sampling for good random spacing
        while (isOverlapping && attempts < 100) {
            // Random position bounded to footer dimensions (with a 40px margin)
            baseX = (Math.random() * (width - 80)) - ((width - 80) / 2);
            baseY = (Math.random() * (height - 80)) - ((height - 80) / 2);

            // Keep center somewhat clear so text is readable (optional but good UI)
            const distToCenter = Math.sqrt(baseX * baseX + baseY * baseY);
            if (distToCenter < 120) {
                attempts++;
                continue;
            }

            // Check against other icons to prevent overlapping
            isOverlapping = false;
            for (let j = 0; j < iconData.length; j++) {
                const existing = iconData[j];
                const dx = existing.baseX - baseX;
                const dy = existing.baseY - baseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 85) { // minimum spacing of 85px between bubbles
                    isOverlapping = true;
                    break;
                }
            }
            attempts++;
        }

        iconData.push({
            el: icon,
            baseX: baseX,
            baseY: baseY,
            x: baseX,
            y: baseY,
            floatTime: Math.random() * 100,
            active: false
        });

        // Set them initially super high offscreen so they drop down
        gsap.set(icon, { x: baseX, y: baseY - 1000, opacity: 0 });
    });

    let mouseX = -9999;
    let mouseY = -9999;

    // Track mouse position over footer relative to container center
    footer.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = e.clientX - rect.left - rect.width / 2;
        mouseY = e.clientY - rect.top - rect.height / 2;
    });

    footer.addEventListener('mouseleave', () => {
        mouseX = -9999;
        mouseY = -9999;
    });

    // 1. Entrance and Exit Animation via independent ScrollTrigger events 
    // This allows fully smooth transitions with ZERO snapping, and random stagger logic!
    ScrollTrigger.create({
        trigger: footer,
        start: "top 85%", // Starts when footer is 15% up from bottom
        onEnter: () => {
            // Stop interactive physics instantly
            iconData.forEach(d => d.active = false);

            // Animate IN from wherever they currently are
            gsap.to(icons, {
                y: (i) => iconData[i].baseY,
                x: (i) => iconData[i].baseX, // Ensure they return exactly to their home columns
                opacity: 1,
                duration: () => 1 + Math.random() * 0.8, // Randomize duration so they fall dynamically but INSTANTLY start
                ease: "power3.out",
                overwrite: "auto", // smoothly kill any outgoing animations
                onComplete: () => {
                    // Turn continuous floating/repulsion back on
                    iconData.forEach(d => {
                        d.x = d.baseX;
                        d.y = d.baseY;
                        d.active = true;
                    });
                }
            });
        },
        onLeaveBack: () => {
            // Stop physics instantly
            iconData.forEach(d => d.active = false);

            // Animate BACK OUT cleanly. By not forcing a set position, they will float out 
            // relative to exactly where the hover/floating physics left them! Flawless smoothness.
            gsap.to(icons, {
                y: "-=800", // Fly straight up into the sky
                opacity: 0,
                duration: () => 0.8 + Math.random() * 0.5, // Start instantly without delay
                ease: "power2.inOut",
                overwrite: "auto"
            });
        }
    });

    // 2. The Interactive Loop (Floating + Magnetic Repel "Mouse Run")
    gsap.ticker.add(() => {
        iconData.forEach(data => {
            if (!data.active) return; // Wait for entrance to finish

            // Smooth Sine-wave floating
            data.floatTime += 0.03;
            const floatOffsetX = Math.sin(data.floatTime * 0.7) * 10;
            const floatOffsetY = Math.sin(data.floatTime) * 15;

            // Compute distance to mouse
            const dx = data.x - mouseX;
            const dy = data.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let targetX = data.baseX;
            let targetY = data.baseY;

            // If mouse is close (within 150px)
            if (dist < 150) {
                const force = (150 - dist) / 150; // scale force (0 to 1)
                const angle = Math.atan2(dy, dx);
                
                // Repel ("Run away" push from cursor)
                targetX = data.baseX + Math.cos(angle) * force * 100;
                targetY = data.baseY + Math.sin(angle) * force * 100;
            }

            // Ease physical values towards target
            data.x += (targetX - data.x) * 0.1;
            data.y += (targetY - data.y) * 0.1;

            // Apply position instantly to DOM
            gsap.set(data.el, {
                x: data.x + floatOffsetX,
                y: data.y + floatOffsetY
            });
        });
    });
});
