import { initSmoothScroll } from './smooth-scroll.js';
import { initHero } from './hero3d.js';
import { initAnimations } from './animations.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initDumbbellDrop } from './dumbbellDrop.js';

// Preloader & Initialize core components
initSmoothScroll();

const preloader = document.getElementById('preloader');
if (preloader) {
  const tl = gsap.timeline();
  tl.to('.preloader-logo', { opacity: 1, y: -20, duration: 0.8, ease: 'power3.out' })
    .to('.preloader-logo', { opacity: 0, duration: 0.5, delay: 0.5 })
    .to('#preloader', { opacity: 0, duration: 0.8, ease: 'power2.inOut', onComplete: () => {
      preloader.style.display = 'none';
      initHero();
      initAnimations();
      initDumbbellDrop('dumbbell-drop');
    }});
} else {
  initHero();
  initAnimations();
  initDumbbellDrop('dumbbell-drop');
}

console.log("Main JS loaded. Welcome to B2BO Fitness Studio!");

// Dumbbell Drop logic is now handled fully by ScrollTrigger in dumbbellDrop.js
// Navbar Scroll Logic
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile Menu Toggle
const hamburger = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  // Close menu on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });
}

// Testimonial Carousel Clone trick
const track = document.getElementById('testimonial-track');
if (track) {
  // Clone all children to make it infinite
  const cards = Array.from(track.children);
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });
}

// Contact Form GSAP focus effect
const formControls = document.querySelectorAll('.form-control');
const formWrapper = document.getElementById('form-wrapper');

if (formControls.length > 0 && formWrapper) {
  formControls.forEach(control => {
    control.addEventListener('focus', () => {
      gsap.to(formWrapper, {
        boxShadow: '0 0 20px rgba(255, 214, 0, 0.4)',
        borderColor: 'rgba(255, 214, 0, 0.5)',
        duration: 0.3
      });
    });
    control.addEventListener('blur', () => {
      gsap.to(formWrapper, {
        boxShadow: '0 0 0px rgba(255, 214, 0, 0)',
        borderColor: 'rgba(255, 255, 255, 0.05)',
        duration: 0.3
      });
    });
  });
}

// Back to Top Logic
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});
