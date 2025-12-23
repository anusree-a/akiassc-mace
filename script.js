// Animated Geometric Background
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = document.documentElement.scrollHeight;

const shapes = [];
const shapeCount = 25;
let scrollY = 0;

class GeometricShape {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 60 + 20;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.rotation = 0;
        this.rotationSpeed = Math.random() * 0.02 - 0.01;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.type = Math.floor(Math.random() * 3); // 0: triangle, 1: hexagon, 2: diamond
        this.color = Math.random() > 0.5 ? '#d4af37' : '#f4e5a0';
    }

    update(scrollDelta) {
      

        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        // Boundary wrapping
        if (this.x > canvas.width + 100) this.x = -100;
        if (this.x < -100) this.x = canvas.width + 100;
        if (this.y > canvas.height + 100) this.y = -100;
        if (this.y < -100) this.y = canvas.height + 100;

        // Fade in/out effect
        this.opacity += Math.sin(Date.now() * 0.001 + this.x * 0.01) * 0.005;
        this.opacity = Math.max(0.05, Math.min(0.4, this.opacity));
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity * 0.1;

        if (this.type === 0) {
            // Triangle
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 2);
            ctx.lineTo(-this.size / 2, this.size / 2);
            ctx.lineTo(this.size / 2, this.size / 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else if (this.type === 1) {
            // Hexagon
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3;
                const x = Math.cos(angle) * this.size / 2;
                const y = Math.sin(angle) * this.size / 2;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else {
            // Diamond
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 2);
            ctx.lineTo(this.size / 2, 0);
            ctx.lineTo(0, this.size / 2);
            ctx.lineTo(-this.size / 2, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        ctx.restore();
    }
}

function init() {
    for (let i = 0; i < shapeCount; i++) {
        shapes.push(new GeometricShape());
    }
}

let lastScrollY = 0;
let scrollDelta = 0;

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let shape of shapes) {
        shape.update(scrollDelta);
        shape.draw();
    }

    for (let i = 0; i < shapes.length; i++) {
        for (let j = i + 1; j < shapes.length; j++) {
            const dx = shapes[i].x - shapes[j].x;
            const dy = shapes[i].y - shapes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                const avgOpacity = (shapes[i].opacity + shapes[j].opacity) / 2;
                ctx.strokeStyle = `rgba(212, 175, 55, ${avgOpacity * 0.3})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(shapes[i].x, shapes[i].y);
                ctx.lineTo(shapes[j].x, shapes[j].y);
                ctx.stroke();
            }
        }
    }

    scrollDelta *= 0.95;
    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    scrollDelta = (currentScrollY - lastScrollY) * 0.05; 
    lastScrollY = currentScrollY;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
});

// Countdown Timer
const eventDate = new Date('February 12, 2026 00:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

    if (distance < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
    }
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');

function updateCarousel() {
    const carousel = document.getElementById('carousel');
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;

    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function changeSlide(direction) {
    currentSlide += direction;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    if (currentSlide >= slides.length) currentSlide = 0;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

// Auto-advance carousel
setInterval(() => {
    changeSlide(1);
}, 5000);

// Mobile menu toggle
function toggleMenu() {
    document.getElementById('navMenu').classList.toggle('active');
}

// Scroll animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.section-title').forEach(title => {
    observer.observe(title);
});

// Parallax effect on hero heading
window.addEventListener('scroll', () => {
    const heroH1 = document.querySelector('.hero h1');
    const scrolled = window.scrollY;
    if (heroH1 && scrolled < window.innerHeight) {
        heroH1.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Scroll Animation Handler
const scrollSections = document.querySelectorAll('.scroll-section');
const mainNav = document.getElementById('mainNav');
let currentVisibleIndex = -1;

function handleScrollAnimations() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const logoImg = document.querySelector('.logo-only img');

    // Handle logo enlargement and movement based on scroll
    if (logoImg) {
        const totalScrollSections = scrollSections.length;
        const maxScroll = totalScrollSections * windowHeight;
        const scrollProgress = Math.min(scrollY / maxScroll, 1);

        // Logo scales from 1x to 2.5x and moves up as you scroll
        const scale = 1 + scrollProgress * 1.5; 
        const translateY = scrollProgress * -200; 
        logoImg.style.transform = `scale(${scale}) translateY(${translateY}px)`;
    }

    // Find the current active section based on scroll position
    let activeIndex = -1;
    scrollSections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionCenter = sectionTop + sectionHeight / 2;

        // Check if this section should be active (centered in viewport)
        if (scrollY + windowHeight / 2 > sectionTop && scrollY + windowHeight / 2 < sectionTop + sectionHeight) {
            activeIndex = index;
        }
    });

    // Update active states
    scrollSections.forEach((section, index) => {
        if (index === activeIndex) {
            section.classList.add('active');
            section.classList.remove('hidden');
        } else {
            section.classList.remove('active');
            section.classList.remove('hidden');
        }
    });

    // Hide scroll sections when scrolling past them to home
    const homeSection = document.getElementById('home');
    if (homeSection) {
        const homeTop = homeSection.offsetTop;
        if (scrollY + windowHeight / 2 > homeTop) {
            scrollSections.forEach(section => {
                section.classList.add('hidden');
                section.classList.remove('active');
            });
            mainNav.classList.add('visible');
        } else {
            mainNav.classList.remove('visible');
        }
    }

    // Show full hero after all scroll sections
    const lastScrollSection = scrollSections[scrollSections.length - 1];
    if (lastScrollSection) {
        const lastSectionBottom = lastScrollSection.offsetTop + lastScrollSection.offsetHeight;

        if (scrollY > lastSectionBottom - windowHeight * 0.5) {
            const fullHeroElement = document.querySelector('.full-hero');
            if (fullHeroElement) {
                fullHeroElement.classList.add('visible');
            }
        } else {
            const fullHeroElement = document.querySelector('.full-hero');
            if (fullHeroElement) {
                fullHeroElement.classList.remove('visible');
            }
        }
    }
}

// Add scroll listener
window.addEventListener('scroll', handleScrollAnimations);

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            document.getElementById('navMenu').classList.remove('active');
        }
    });
});