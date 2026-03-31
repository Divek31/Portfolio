// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    direction: 'vertical', 
    gestureDirection: 'vertical', 
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
})

// Integrate Lenis with GSAP ScrollTrigger
function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

gsap.registerPlugin(ScrollTrigger);

// Custom Cursor Logic
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Immediate cursor update
    gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power2.out"
    });
});

// Smooth follower update
gsap.ticker.add(() => {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    gsap.set(follower, {
        x: followerX,
        y: followerY
    });
});

// Magnetic effect on interactive elements
const magnetics = document.querySelectorAll('.magnetic, a');

magnetics.forEach((elem) => {
    elem.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        follower.classList.add('active');
    });
    
    elem.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        follower.classList.remove('active');
        gsap.to(elem, {x: 0, y: 0, duration: 0.5, ease: "power2.out"});
    });
    
    if(elem.classList.contains('magnetic')) {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distX = e.clientX - centerX;
            const distY = e.clientY - centerY;
            
            gsap.to(elem, {
                x: distX * 0.3,
                y: distY * 0.3,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    }
});

// Initial Loader Animation
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    
    tl.to('.loader-text', {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: "power3.inOut"
    })
    .to('.loader', {
        yPercent: -100,
        duration: 1,
        ease: "power4.inOut"
    }, "-=0.2")
    .from('.logo, .nav-links a', {
        y: -20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.5")
    .from('.hero-subtitle', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
    }, "-=0.6")
    .from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out"
    }, "-=0.4")
    .from('.hero-desc', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
    }, "-=1")
    .from('.hero-image-container', {
        clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
        duration: 1.5,
        ease: "power4.inOut"
    }, "-=1.2");
});

// Scroll Animations
const revealTexts = document.querySelectorAll('.reveal-text');
revealTexts.forEach((text) => {
    gsap.from(text, {
        scrollTrigger: {
            trigger: text,
            start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// Parallax Image
if(document.querySelector('.hero-img')) {
    gsap.to('.hero-img', {
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        },
        yPercent: 20,
        ease: "none"
    });
}

// Parallax Section Headers
const sectionHeaders = document.querySelectorAll('.parallax-text');
sectionHeaders.forEach((header) => {
    gsap.from(header, {
        scrollTrigger: {
            trigger: header,
            start: "top 90%",
            end: "bottom top",
            scrub: 1
        },
        x: -50,
        opacity: 0,
        ease: "none"
    });
});

// Card sequential reveals
const sections = document.querySelectorAll('section');
sections.forEach((section) => {
    const cards = section.querySelectorAll('.card');
    if(cards.length > 0) {
        gsap.from(cards, {
            scrollTrigger: {
                trigger: section,
                start: "top 75%",
            },
            y: 50,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out"
        });
    }
});

// --- Premium Awwards Interactions ---

// 1. Scroll Progress Ring
const progressBar = document.querySelector('.progress-bar');
if(progressBar) {
    gsap.to(progressBar, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.1
        }
    });
}

// 2. Advanced Nav Hover effect
const navLinksAnchors = document.querySelectorAll('.nav-links a');
navLinksAnchors.forEach(link => {
    // Avoid double wrapping if already wrapped during live edit preview.
    if(!link.querySelector('.nav-text-inner')) {
        const text = link.innerText;
        link.innerHTML = `
            <div class="nav-text-inner">
                <span>${text}</span>
                <span style="color: var(--accent-color);">${text}</span>
            </div>
        `;
    }
});

// 3. 3D Holographic Card Tilts
const cards3D = document.querySelectorAll('.card');
cards3D.forEach(card => {
    // Inject glare div if not exists
    if(!card.querySelector('.card-glare')) {
        const glare = document.createElement('div');
        glare.classList.add('card-glare');
        card.appendChild(glare);
    }
    
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top; 
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -8; // subtle 8 deg tilt
        const rotateY = ((x - centerX) / centerX) * 8;
        
        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            duration: 0.5,
            ease: "power2.out"
        });
        
        // Move glare
        const glare = card.querySelector('.card-glare');
        if(glare) {
            gsap.to(glare, {
                background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15), transparent 60%)`,
                duration: 0.1
            });
        }
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.8,
            ease: "power2.out"
        });
        const glare = card.querySelector('.card-glare');
        if(glare) {
            gsap.to(glare, {
                background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0), transparent 50%)`,
                duration: 0.8
            });
        }
    });
});