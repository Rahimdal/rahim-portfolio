document.addEventListener('DOMContentLoaded', () => {
    gsap.from(".contact-overline", { y: 20, opacity: 0, duration: 0.8, delay: 0.2 });
    gsap.from(".contact-headline", { y: 30, opacity: 0, duration: 1, delay: 0.3, ease: "power3.out" });
    gsap.from(".contact-desc", { y: 20, opacity: 0, duration: 0.8, delay: 0.4 });
    gsap.from(".contact-link-item", { x: -20, stagger: 0.1, duration: 0.8, delay: 0.5 });
    gsap.from(".social-pill", { y: 20, stagger: 0.05, duration: 0.6, delay: 0.7 });
    gsap.from(".form-wrapper", {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: "power3.out"
    });

});

document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = this.querySelector('.send-btn');
    const originalBtnContent = btn.innerHTML;

    btn.innerHTML = '<span>Sending...</span>';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    fetch("https://formsubmit.co/ajax/rahimdal32@gmail.com", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(new FormData(e.target)))
    })
        .then(response => response.json())
        .then(data => {

            btn.innerHTML = '<span>Message Sent!</span> <i class="fa-solid fa-check"></i>';
            btn.style.backgroundColor = '#10B981';
            btn.style.opacity = '1';
            btn.style.borderColor = '#10B981';

            e.target.reset();

            setTimeout(() => {
                btn.innerHTML = originalBtnContent;
                btn.style.backgroundColor = '';
                btn.style.borderColor = '';
                btn.disabled = false;
            }, 4000);
        })
        .catch(error => {
            console.error('Error:', error);
            btn.innerHTML = '<span>Failed. Try again?</span>';
            btn.style.backgroundColor = '#EF4444';

            setTimeout(() => {
                btn.innerHTML = originalBtnContent;
                btn.style.backgroundColor = '';
                btn.disabled = false;
            }, 4000);
        });
});