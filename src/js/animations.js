import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getCamera } from './hero3d.js';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  // Wait a tick for camera to be initialized
  setTimeout(() => {
    const camera = getCamera();
    
    // Fade and scale hero content OUT as user scrolls
    gsap.to('.hero-overlay', {
      opacity: 0,
      y: -60,
      scale: 0.95,
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });

    // Move camera position UP (translate Three.js camera) tied to scroll
    if (camera) {
      gsap.to(camera.position, {
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        },
        y: 3,
        z: 6
      });
    }

    // --- About Section Animations ---
    
    // Split text logic manually for headings
    const headings = document.querySelectorAll('.split-heading');
    headings.forEach(heading => {
      const text = heading.innerHTML;
      // Split by words/spaces or <br>
      const splitText = text.replace(/([^\s<]+)|(<br>)/g, (match) => {
        if (match === '<br>') return match;
        return `<span class="word"><span>${match}</span></span>`;
      });
      heading.innerHTML = splitText;
      
      gsap.to(heading.querySelectorAll('.word span'), {
        scrollTrigger: {
          trigger: heading,
          start: 'top 80%'
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out'
      });
    });

    // Stat Counters
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const isDecimal = stat.hasAttribute('data-decimal');
      const obj = { val: 0 };
      
      gsap.to(obj, {
        scrollTrigger: {
          trigger: '.stats-row',
          start: 'top 85%'
        },
        val: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => {
          stat.innerHTML = isDecimal ? obj.val.toFixed(1) : Math.floor(obj.val);
        }
      });
    });

    // --- Programs Section Animation ---
    gsap.from('.program-card', {
      scrollTrigger: {
        trigger: '.programs-grid',
        start: 'top 85%'
      },
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    });

    // --- Trainers Section Animation ---
    gsap.to('.scroll-hint-line', {
      scrollTrigger: {
        trigger: '.trainers-section',
        start: 'top 75%'
      },
      x: '100%',
      duration: 1.5,
      ease: 'power2.inOut'
    });

    gsap.from('#trainer-1', {
      scrollTrigger: { trigger: '.trainers-grid', start: 'top 80%' },
      x: -100, opacity: 0, duration: 0.8, ease: 'power3.out'
    });
    
    gsap.from('#trainer-2', {
      scrollTrigger: { trigger: '.trainers-grid', start: 'top 80%' },
      y: 100, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.2
    });
    
    gsap.from('#trainer-3', {
      scrollTrigger: { trigger: '.trainers-grid', start: 'top 80%' },
      x: 100, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.4
    });

    // --- Pricing Section Animation ---
    gsap.from('.pricing-card, .pricing-card-wrapper', {
      scrollTrigger: {
        trigger: '.pricing-grid',
        start: 'top 80%'
      },
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // --- Gifts Section Animation ---
    gsap.from('.unwrap-item', {
      scrollTrigger: {
        trigger: '.gifts-grid',
        start: 'top 80%'
      },
      scale: 0,
      opacity: 0,
      duration: 1.5,
      stagger: 0.3,
      ease: 'elastic.out(1, 0.7)'
    });

    // --- Contact Section Animation ---
    gsap.from('#form-wrapper', {
      scrollTrigger: {
        trigger: '.contact-grid',
        start: 'top 80%'
      },
      x: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('#info-card', {
      scrollTrigger: {
        trigger: '.contact-grid',
        start: 'top 80%'
      },
      x: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    ScrollTrigger.refresh();
  }, 100);
}
