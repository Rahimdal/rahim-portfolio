document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    if (filterBtns.length > 0 && projectItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filterValue = btn.getAttribute('data-filter');
                const itemsToShow = [];
                const itemsToHide = [];
                projectItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        itemsToShow.push(item);
                    } else {
                        itemsToHide.push(item);
                    }
                });
                if (itemsToHide.length > 0) {
                    gsap.to(itemsToHide, {
                        autoAlpha: 0,
                        scale: 0.95,
                        duration: 0.3,
                        ease: 'power2.in',
                        onComplete: () => {
                            itemsToHide.forEach(item => item.style.display = 'none');
                            itemsToShow.forEach(item => item.style.display = 'flex');
                            ScrollTrigger.refresh();
                            gsap.fromTo(itemsToShow,
                                { autoAlpha: 0, scale: 0.95 },
                                { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power2.out', stagger: 0.05, clearProps: "transform" }
                            );
                        }
                    });
                } else {
                    itemsToShow.forEach(item => item.style.display = 'flex');
                    ScrollTrigger.refresh();
                    gsap.fromTo(itemsToShow,
                        { autoAlpha: 0, scale: 0.95 },
                        { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power2.out', stagger: 0.05, clearProps: "transform" }
                    );
                }
            });
        });
    }
});

  document.addEventListener('DOMContentLoaded', () => {
            gsap.from(".page-title", {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power4.out"
            });

            gsap.from(".header-desc", {
                y: 30,
                opacity: 0,
                duration: 1,
                delay: 0.2,
                ease: "power3.out"
            });

            gsap.from(".filter-btn", {
                y: 20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.05,
                delay: 0.4,
                ease: "power3.out"
            });

            gsap.from(".divider-line", {
                scaleX: 0,
                duration: 1,
                delay: 0.6,
                transformOrigin: "left center",
                ease: "power3.out"
            });
            gsap.utils.toArray('.project-item').forEach((item, i) => {
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: "top 90%",
                    },
                    y: 40,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out"
                });
            });
        });
