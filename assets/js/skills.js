 document.addEventListener('DOMContentLoaded', () => {
            gsap.from(".skills-title-line", {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power4.out"
            });

            gsap.from(".skills-lead", {
                y: 30,
                opacity: 0,
                duration: 1,
                delay: 0.4,
                ease: "power3.out"
            });

            gsap.from(".skills-interaction-section", {
                y: 50,
                opacity: 0,
                duration: 1,
                delay: 0.6,
                ease: "power3.out"
            });
            const skillsData = {
                seo: {
                    title: "SEO",
                    icon: "fa-search",
                    details: [
                        "Keyword research",
                        "Site audits",
                        "Link building strategies",
                        "SEO content optimization",
                        "Analytics & tracking",
                        "Site speed boost",
                        "Content SEO"
                    ],
                    color: "#EA580C"
                },
                wordpress: {
                    title: "WORDPRESS",
                    icon: "fa-brands fa-wordpress",
                    details: [
                        "Custom Theme Development",
                        "Plugin Customization",
                        "WooCommerce Integration",
                        "Performance Optimization",
                        "Security Hardening",
                        "Migration & Backups",
                        "Headless WordPress"
                    ],
                    color: "#21759B"
                },
                shopify: {
                    title: "SHOPIFY",
                    icon: "fa-brands fa-shopify",
                    details: [
                        "Store Setup & Configuration",
                        "Liquid Theme Customization",
                        "App Integration",
                        "Conversion Rate Optimization",
                        "Checkout Customization",
                        "Inventory Management Logic",
                        "Shopify Plus Features"
                    ],
                    color: "#96BF48"
                },
                html: {
                    title: "HTML",
                    icon: "fa-brands fa-html5",
                    details: [
                        "Semantic Markup",
                        "Accessibility (WCAG)",
                        "SEO-friendly Structure",
                        "Cross-browser Compatibility",
                        "Modern HTML5 Features",
                        "Performance Best Practices",
                        "Clean Code Standards"
                    ],
                    color: "#E34F26"
                },
                css: {
                    title: "CSS",
                    icon: "fa-brands fa-css3-alt",
                    details: [
                        "Responsive Design",
                        "Flexbox & Grid Layouts",
                        "CSS Animations & Transitions",
                        "Preprocessor (SASS/SCSS)",
                        "BEM Methodology",
                        "Tailwind CSS / Bootstrap",
                        "Variable & Theming"
                    ],
                    color: "#1572B6"
                },
                javascript: {
                    title: "JAVASCRIPT",
                    icon: "fa-brands fa-js",
                    details: [
                        "ES6+ Syntax",
                        "DOM Manipulation",
                        "Async/Await Patterns",
                        "Fetch API / AJAX",
                        "Event Handling",
                        "JSON Data Parsing",
                        "Modular Architecture"
                    ],
                    color: "#F7DF1E"
                },
                react: {
                    title: "React.Js",
                    icon: "fa-brands fa-react",
                    details: [
                        "Functional Components",
                        "Hooks (useState, useEffect)",
                        "React Router",
                        "State Management (Context/Redux)",
                        "Next.js Framework",
                        "Component Lifecycle",
                        "Performance Optimization"
                    ],
                    color: "#61DAFB"
                },
                gsap: {
                    title: "GSAP LIBRARY",
                    icon: "fa-solid fa-film",
                    details: [
                        "ScrollTrigger Animations",
                        "Timeline Sequencing",
                        "SVG Animation",
                        "Text Effects",
                        "Parallax Scrolling",
                        "Morphing Shapes",
                        "Performance-tuned Animation"
                    ],
                    color: "#88CE02"
                },
                bootstrap: {
                    title: "BOOTSTRAP",
                    icon: "fa-brands fa-bootstrap",
                    details: [
                        "Rapid Prototyping",
                        "Grid System Mastery",
                        "Custom Component Styling",
                        "Responsive Utilities",
                        "Bootstrap Icons",
                        "Modal & JavaScript Interactivity",
                        "Theme Customization"
                    ],
                    color: "#7952B3"
                },
                php: {
                    title: "PHP",
                    icon: "fa-brands fa-php",
                    details: [
                        "Server-side Logic",
                        "Database Integration (MySQL)",
                        "Form Handling",
                        "Session Management",
                        "API Creation",
                        "Security Best Practices",
                        "WordPress Backend"
                    ],
                    color: "#777BB4"
                },
                figma: {
                    title: "Figma",
                    icon: "fa-brands fa-figma",
                    details: [
                        "UI/UX Design",
                        "Wireframing & Prototyping",
                        "Design Systems",
                        "Auto Layout Mastery",
                        "Vector Illustration",
                        "Developer Handoff",
                        "Interactive Components"
                    ],
                    color: "#F24E1E"
                },
                vibe: {
                    title: "Vibe coding",
                    icon: "fa-solid fa-wand-magic-sparkles",
                    details: [
                        "AI-Assisted Workflows",
                        "Prompt Engineering",
                        "Rapid Prototyping",
                        "Flow State Coding",
                        "Cursor IDE Mastery",
                        "Debugging with LLMs",
                        "Creative Problem Solving"
                    ],
                    color: "#A855F7"
                }
            };
            const listItems = document.querySelectorAll('.skill-item');
            const cardTitle = document.querySelector('.skill-name');
            const cardIcon = document.querySelector('.skill-icon i');
            const cardList = document.querySelector('.skill-details-list');
            const card = document.getElementById('skill-card');
            listItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    listItems.forEach(li => li.classList.remove('active'));
                    item.classList.add('active');
                    const key = item.getAttribute('data-skill');
                    const data = skillsData[key];
                    if (data) {
                        gsap.to(card, {
                            opacity: 0,
                            y: 10,
                            duration: 0.2,
                            onComplete: () => {
                                cardTitle.textContent = data.title;
                                cardIcon.className = `fa-solid ${data.icon.startsWith('fa-') ? data.icon : 'fa-' + data.icon}`;
                                card.style.borderTop = `4px solid ${data.color}`;
                                cardList.innerHTML = '';
                                data.details.forEach(detail => {
                                    const li = document.createElement('li');
                                    li.innerHTML = `<i class="fa-solid fa-check" style="color: ${data.color}"></i> ${detail}`;
                                    cardList.appendChild(li);
                                });
                                gsap.to(card, {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.3,
                                    ease: "power2.out"
                                });
                            }
                        });
                    }
                });
            });
        });