import * as THREE from 'three';
import gsap from 'gsap';

let camera, scene, renderer, particles;
let objects = [];

export function initHero() {
  const canvas = document.querySelector('#hero-canvas');
  if (!canvas) return;

  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 1. Particle field
  const particlesGeometry = new THREE.BufferGeometry();
  // On mobile screens we use far fewer particles to protect
  // frame rate — the user won't notice the difference but
  // their phone battery will thank you.
  const isMobile = window.innerWidth < 768;
  const PARTICLE_COUNT = isMobile ? 800 : 3000;
  const posArray = new Float32Array(PARTICLE_COUNT * 3);

  for(let i = 0; i < PARTICLE_COUNT * 3; i+=3) {
    // Distribute randomly in a sphere of radius 8
    const r = 8 * Math.cbrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    
    posArray[i] = r * Math.sin(phi) * Math.cos(theta);
    posArray[i+1] = r * Math.sin(phi) * Math.sin(theta);
    posArray[i+2] = r * Math.cos(phi);
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: '#FFD600',
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // 2. Floating gym geometric objects
  function createDumbbell() {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x222222,
      emissive: 0x332a00,
      roughness: 0.2,
      metalness: 0.8
    });
    
    const weightGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
    const weight1 = new THREE.Mesh(weightGeo, material);
    weight1.rotation.z = Math.PI / 2;
    weight1.position.x = -0.6;
    
    const weight2 = new THREE.Mesh(weightGeo, material);
    weight2.rotation.z = Math.PI / 2;
    weight2.position.x = 0.6;
    
    const barGeo = new THREE.BoxGeometry(1.2, 0.1, 0.1);
    const bar = new THREE.Mesh(barGeo, material);
    
    group.add(weight1, weight2, bar);
    return group;
  }

  // Object 1 & 2: Dumbbells
  const dumbbell1 = createDumbbell();
  dumbbell1.position.set(-3, 1, -3);
  objects.push({ mesh: dumbbell1, timeOffset: 0, speed: 1.2 });

  const dumbbell2 = createDumbbell();
  dumbbell2.position.set(3, -2, -5);
  objects.push({ mesh: dumbbell2, timeOffset: Math.PI, speed: 0.8 });

  // Object 3: Torus (Weight plate)
  const torusGeo = new THREE.TorusGeometry(0.8, 0.2, 16, 50);
  const torusMat = new THREE.MeshStandardMaterial({ 
    color: 0xFFD600,
    roughness: 0.4,
    metalness: 0.3
  });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.position.set(-2, -1.5, -4);
  objects.push({ mesh: torus, timeOffset: Math.PI/2, speed: 1 });
  
  // Object 4: Octahedron (Abstract symbol)
  const octaGeo = new THREE.OctahedronGeometry(0.6);
  const octaMat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    emissive: 0x332a00,
    wireframe: true
  });
  const octa = new THREE.Mesh(octaGeo, octaMat);
  octa.position.set(2, 2, -2);
  objects.push({ mesh: octa, timeOffset: Math.PI*1.5, speed: 1.5 });

  objects.forEach(obj => scene.add(obj.mesh));

  // 3. Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Keep pixel ratio capped at 2 — retina screens go up to 3
    // but the visual difference above 2 is invisible while the
    // performance cost is very real.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // We move the render loop into GSAP's ticker so Three.js,
  // GSAP animations, and Lenis scroll all update on the exact
  // same animation frame — no more drift or desync.
  gsap.ticker.add(() => {
    const time = performance.now() * 0.001; // convert ms to seconds
    updateScene(time); // your floating shapes and particle rotation go here
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  });
}

function updateScene(time) {
  if (particles) particles.rotation.y += 0.0003;

  objects.forEach(obj => {
    obj.mesh.position.y += Math.sin(time * obj.speed + obj.timeOffset) * 0.002;
    obj.mesh.rotation.x += 0.002 * obj.speed;
    obj.mesh.rotation.y += 0.003 * obj.speed;
  });
}

export function getCamera() {
  return camera;
}
