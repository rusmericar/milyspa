document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header
    const header = document.getElementById('header');
    let headerTicking = false;
    window.addEventListener('scroll', () => {
        if (!headerTicking) {
            window.requestAnimationFrame(() => {
                header.classList.toggle('scrolled', window.scrollY > 50);
                headerTicking = false;
            });
            headerTicking = true;
        }
    }, { passive: true });


    // Clean up will-change after hero animations complete to free GPU memory
    const heroContent = document.querySelector('.hero-content');
    const heroImage   = document.querySelector('.hero-image');
    if (heroContent) {
        heroContent.addEventListener('animationend', () => {
            heroContent.style.willChange = 'auto';
        }, { once: true });
    }
    if (heroImage) {
        heroImage.addEventListener('animationend', () => {
            heroImage.style.willChange = 'auto';
        }, { once: true });
    }

    // 3. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const icon = menuToggle.querySelector('i');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-link, .nav-btn');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // 4. Smooth Scroll and Active State update
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    // Cache section positions once — read offsetTop outside scroll handler to avoid forced reflow
    let sectionCache = [];
    function buildSectionCache() {
        sectionCache = Array.from(sections).map(s => ({
            id: s.getAttribute('id'),
            top: s.offsetTop,
            height: s.offsetHeight
        }));
    }
    buildSectionCache();
    window.addEventListener('resize', buildSectionCache, { passive: true });

    let navTicking = false;
    window.addEventListener('scroll', () => {
        if (!navTicking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                let current = '';
                sectionCache.forEach(({ id, top, height }) => {
                    if (scrollY >= top - height / 3) current = id;
                });
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').includes(current)) {
                        link.classList.add('active');
                    }
                });
                navTicking = false;
            });
            navTicking = true;
        }
    }, { passive: true });

    // 5. Enhanced Scroll Reveal Animations
    const observerOptions = {
        root: null,
        rootMargin: '-50px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
        '.section-header, .about-images, .about-content, .service-card, .testimonial-card, .cta-container'
    );

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Special handling for service cards - they already have their own animation
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card) => {
        card.style.animationPlayState = 'paused';
    });

    // Custom observer for service cards
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('animate-in');
                serviceObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    serviceCards.forEach(card => {
        serviceObserver.observe(card);
    });
    // 5. Testimonial Carousel Logic
    const carousel = document.getElementById('testimonial-carousel');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.getElementById('carousel-dots');

    if (carousel && cards.length > 0) {
        let currentIndex = 0;
        const totalCards = cards.length;
        let intervalId;

        // Create dots
        cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.dataset.index = index;
            dotsContainer.appendChild(dot);

            // Dot click event
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetInterval();
            });
        });

        const dots = document.querySelectorAll('.dot');

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCarousel();
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        function startInterval() {
            intervalId = setInterval(nextSlide, 5000); // Auto slide every 5s
        }

        function resetInterval() {
            clearInterval(intervalId);
            startInterval();
        }

        // Button Events
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });

        // Initialize auto-slide
        startInterval();
    }
});
