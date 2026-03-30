import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initSmoothScroll() {
  const lenis = new Lenis({
    lerp: 0.05, // Lowered for a butter-smooth, heavier scroll interpolation
    wheelMultiplier: 1, // Standard raw delta multiplier without fractional clipping
    smoothWheel: true,
  });

  // Bridge: makes ScrollTrigger read Lenis scroll position, not native scroll
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  lenis.on('scroll', ScrollTrigger.update);

  return lenis;
}
