import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function initDumbbellDrop(canvasId) {
  const cv = document.getElementById(canvasId);
  if (!cv) return;
  const cx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const GY = H - 42, MX = W / 2;

  const PW = W * 0.18, PH = W * 0.17, PR = W * 0.044;
  const BW = W * 0.18, BH = W * 0.064;

  // progress goes from 0 (top of section) to 1 (bottom of section)
  // This single value controls the entire animation state
  let progress = 0;

  const clamp = (v,a,b) => Math.max(a, Math.min(b,v));
  const eIC   = t => t * t * t;
  const eOC   = t => 1 - Math.pow(1-t, 3);

  function rrp(x,y,w,h,r){
    cx.beginPath();
    cx.moveTo(x+r,y); cx.lineTo(x+w-r,y);
    cx.arcTo(x+w,y,x+w,y+r,r);
    cx.lineTo(x+w,y+h-r);
    cx.arcTo(x+w,y+h,x+w-r,y+h,r);
    cx.lineTo(x+r,y+h);
    cx.arcTo(x,y+h,x,y+h-r,r);
    cx.lineTo(x,y+r);
    cx.arcTo(x,y,x+r,y,r);
    cx.closePath();
  }

  function drawPlate(px, py, glow) {
    const x = px - PW/2, y = py - PH/2;
    // depth shadow
    rrp(x+5, y+6, PW, PH, PR);
    cx.fillStyle = 'rgba(15,0,40,0.6)'; cx.fill();
    // main plate
    const mg = cx.createLinearGradient(x,y,x,y+PH);
    mg.addColorStop(0,    '#C890FF');
    mg.addColorStop(0.28, '#9B55EE');
    mg.addColorStop(0.62, '#7030C0');
    mg.addColorStop(1,    '#4A1888');
    rrp(x,y,PW,PH,PR);
    cx.fillStyle = mg; cx.fill();
    cx.strokeStyle = '#280D60'; cx.lineWidth = 3; cx.stroke();
    // shine blob
    cx.save();
    rrp(x,y,PW,PH,PR); cx.clip();
    const shine = cx.createRadialGradient(
      px-PW*0.17, py-PH*0.24, 1,
      px-PW*0.17, py-PH*0.24, PW*0.58
    );
    shine.addColorStop(0,    'rgba(255,255,255,0.5)');
    shine.addColorStop(0.38, 'rgba(255,255,255,0.14)');
    shine.addColorStop(1,    'rgba(255,255,255,0)');
    cx.fillStyle = shine; cx.fillRect(x,y,PW,PH);
    cx.fillStyle = 'rgba(255,255,255,0.18)';
    rrp(x+PW*0.14, y+PH*0.1, PW*0.72, PH*0.14, 4); cx.fill();
    cx.restore();
    // glow halo
    if (glow > 0.04) {
      const hl = cx.createRadialGradient(px,py,PW*0.3,px,py,PW*1.8);
      hl.addColorStop(0, `rgba(255,210,0,${glow*0.28})`);
      hl.addColorStop(1, 'rgba(255,210,0,0)');
      cx.fillStyle = hl;
      cx.beginPath(); cx.arc(px,py,PW*1.8,0,Math.PI*2); cx.fill();
    }
    // B2BO text
    cx.save();
    if (glow > 0.08) {
      cx.shadowColor = '#FFD600';
      cx.shadowBlur  = 14 * glow;
    }
    cx.fillStyle = `rgba(255,220,0,${0.2 + glow*0.8})`;
    cx.font = `900 ${Math.round(PH*0.25)}px Arial Black,Arial`;
    cx.textAlign = 'center'; cx.textBaseline = 'middle';
    cx.fillText('B2BO', px, py);
    cx.restore();
  }

  function drawBar(bx, by) {
    const x = bx-BW/2, y = by-BH/2, r = BH/2;
    rrp(x+3,y+4,BW,BH,r);
    cx.fillStyle = 'rgba(15,0,40,0.45)'; cx.fill();
    const bg = cx.createLinearGradient(x,y,x,y+BH);
    bg.addColorStop(0,   '#A870F8');
    bg.addColorStop(0.4, '#7030C0');
    bg.addColorStop(1,   '#3C1278');
    rrp(x,y,BW,BH,r);
    cx.fillStyle = bg; cx.fill();
    cx.strokeStyle = '#280D60'; cx.lineWidth = 2.5; cx.stroke();
    cx.save();
    rrp(x,y,BW,BH,r); cx.clip();
    cx.fillStyle = 'rgba(255,255,255,0.26)';
    rrp(x+BW*0.14, y+BH*0.18, BW*0.72, BH*0.3, 3); cx.fill();
    cx.restore();
  }

  function drawDumbbell(dbx, dby, glow) {
    cx.save(); cx.translate(dbx, dby);
    const po = BW/2 + PW/2 - 3;
    drawBar(0,0);
    drawPlate(-po, 0, glow);
    drawPlate( po, 0, glow);
    cx.restore();
  }

  function drawShadow(dbx, dby) {
    const dist = GY - dby;
    const prog = clamp(1 - dist/(GY + PH/2 + 30), 0, 1);
    const sw   = (BW + PW*2) * (0.16 + prog*0.6);
    const sh   = 16 * prog;
    if (sh < 0.5) return;
    const sg = cx.createRadialGradient(dbx,GY,0,dbx,GY,sw/2);
    sg.addColorStop(0, `rgba(0,0,0,${prog*0.52})`);
    sg.addColorStop(1, 'rgba(0,0,0,0)');
    cx.fillStyle = sg;
    cx.beginPath();
    cx.ellipse(dbx,GY,sw/2,sh,0,0,Math.PI*2);
    cx.fill();
  }

  function drawGround() {
    const gg = cx.createLinearGradient(0,GY,0,H);
    gg.addColorStop(0,'#140828'); gg.addColorStop(1,'#080515');
    cx.fillStyle = gg; cx.fillRect(0,GY,W,H-GY);
    cx.save(); cx.globalAlpha = 0.045;
    cx.strokeStyle = '#A060FF'; cx.lineWidth = 1;
    for(let i = MX%36; i < W; i+=36){
      cx.beginPath(); cx.moveTo(i,GY); cx.lineTo(i,H); cx.stroke();
    }
    cx.restore();
    cx.beginPath(); cx.moveTo(0,GY); cx.lineTo(W,GY);
    cx.strokeStyle = 'rgba(110,45,190,0.4)';
    cx.lineWidth = 1.8; cx.stroke();
  }

  function drawBG() {
    cx.fillStyle = '#0d0520'; cx.fillRect(0,0,W,H);
    const vg = cx.createRadialGradient(MX,H*0.4,20,MX,H*0.4,H*0.82);
    vg.addColorStop(0,'rgba(80,20,155,0.2)');
    vg.addColorStop(1,'rgba(0,0,0,0)');
    cx.fillStyle = vg; cx.fillRect(0,0,W,H);
  }

  // MAIN RENDER — called every frame with current progress (0→1)
  // progress 0.00 - 0.55 = falling phase
  // progress 0.55 - 0.75 = bounce 1
  // progress 0.75 - 0.88 = bounce 2
  // progress 0.88 - 1.00 = settled + glow
  function render() {
    cx.clearRect(0,0,W,H);
    const p = progress; // 0 to 1
    const landY  = GY - PH/2;
    const startY = -(PH/2 + 30);
    let dbY, glow = 0;

    if (p < 0.55) {
      // Falling with gravity easing
      const t = p / 0.55;
      dbY = startY + (landY - startY) * eIC(t);
    } else if (p < 0.75) {
      // First bounce — rise 24px
      const t = (p - 0.55) / 0.20;
      dbY = landY - Math.sin(t * Math.PI) * 24;
    } else if (p < 0.88) {
      // Second bounce — rise 9px
      const t = (p - 0.75) / 0.13;
      dbY = landY - Math.sin(t * Math.PI) * 9;
    } else {
      // Settled + glow reveal
      dbY = landY;
      glow = eOC((p - 0.88) / 0.12);
    }

    drawBG();
    drawShadow(MX, dbY);
    drawGround();
    drawDumbbell(MX, dbY, glow);
  }

  // RAF loop — always running to keep canvas fresh
  let raf;
  function loop() {
    render();
    raf = requestAnimationFrame(loop);
  }
  loop();

  // SCROLL TRIGGER — scrubs progress based on scroll position
  // scrub: 0.8 means the animation trails scroll by 0.8s
  // This is what makes it feel weighted and physical, not robotic
  ScrollTrigger.create({
    trigger: '#about',
    start: 'top 75%',     // animation starts when about is 75% down viewport
    end:   'bottom 30%',  // animation ends when about bottom is at 30% up
    scrub: 0.8,           // smooth follow — NOT instant
    onUpdate: (self) => {
      progress = self.progress; // 0 to 1, updates on every scroll tick
    }
  });

  return () => cancelAnimationFrame(raf);
}
