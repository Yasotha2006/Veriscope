import { useEffect, useRef } from 'react';

interface Planet {
  id: number;
  name: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  orbitRadius: number;
  orbitAngle: number;
  orbitSpeed: number;
  tilt: number;
  docType: string;
}

interface EvidenceStar {
  planetId: number;
  angle: number;
  distance: number;
  size: number;
  brightness: number;
  isConflict: boolean;
  twinkleSpeed: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export function GalaxyHero({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let planets: Planet[] = [];
    let evidenceStars: EvidenceStar[] = [];
    let particles: Particle[] = [];
    let time = 0;

    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function init() {
      if (!canvas) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const cx = w / 2;
      const cy = h / 2;

      const baseRadius = Math.min(w, h) * 0.25;

      planets = [
        {
          id: 0,
          name: 'Academic Regulations',
          x: cx,
          y: cy,
          radius: baseRadius * 0.45,
          color: '#4f6df5',
          orbitRadius: baseRadius * 0.45,
          orbitAngle: 0,
          orbitSpeed: 0.003,
          tilt: -0.15,
          docType: 'PDF',
        },
        {
          id: 1,
          name: 'Scholarship Guidelines',
          x: cx,
          y: cy,
          radius: baseRadius * 0.6,
          color: '#22d3ee',
          orbitAngle: Math.PI * 0.7,
          orbitRadius: baseRadius * 0.6,
          orbitSpeed: -0.002,
          tilt: 0.2,
          docType: 'PDF',
        },
        {
          id: 2,
          name: 'Eligibility Circular',
          x: cx,
          y: cy,
          radius: baseRadius * 0.78,
          color: '#8aa3ff',
          orbitAngle: Math.PI * 1.4,
          orbitRadius: baseRadius * 0.78,
          orbitSpeed: 0.0015,
          tilt: -0.08,
          docType: 'TXT',
        },
      ];

      evidenceStars = [];
      for (const planet of planets) {
        const count = 5 + Math.floor(Math.random() * 4);
        for (let i = 0; i < count; i++) {
          evidenceStars.push({
            planetId: planet.id,
            angle: (Math.PI * 2 * i) / count + Math.random() * 0.5,
            distance: planet.radius * (1.2 + Math.random() * 0.8),
            size: Math.random() * 1.5 + 0.8,
            brightness: Math.random() * 0.5 + 0.5,
            isConflict: Math.random() < 0.15,
            twinkleSpeed: Math.random() * 0.03 + 0.01,
          });
        }
      }
    }

    function spawnParticle(x: number, y: number) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: 0,
        maxLife: 60 + Math.random() * 40,
      });
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);
      time += 1;

      // Background nebula
      const nebulaGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.5);
      nebulaGrad.addColorStop(0, 'rgba(36, 22, 86, 0.15)');
      nebulaGrad.addColorStop(0.4, 'rgba(50, 30, 115, 0.05)');
      nebulaGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, w, h);

      // Distant background stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      for (let i = 0; i < 60; i++) {
        const sx = ((i * 137.5) % w);
        const sy = ((i * 97.3) % h);
        const tw = Math.sin(time * 0.02 + i) * 0.3 + 0.5;
        ctx.globalAlpha = 0.15 * tw;
        ctx.beginPath();
        ctx.arc(sx, sy, 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Update planet positions
      for (const planet of planets) {
        planet.orbitAngle += planet.orbitSpeed;
        const ox = Math.cos(planet.orbitAngle) * planet.orbitRadius;
        const oy = Math.sin(planet.orbitAngle) * planet.orbitRadius * Math.cos(planet.tilt);
        planet.x = cx + ox;
        planet.y = cy + oy;
      }

      // Draw orbit lines
      for (const planet of planets) {
        ctx.strokeStyle = 'rgba(79, 109, 245, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(cx, cy, planet.orbitRadius, planet.orbitRadius * Math.abs(Math.cos(planet.tilt)), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw connections between planets
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.06)';
      ctx.lineWidth = 0.8;
      for (let i = 0; i < planets.length; i++) {
        for (let j = i + 1; j < planets.length; j++) {
          ctx.beginPath();
          ctx.moveTo(planets[i].x, planets[i].y);
          ctx.lineTo(planets[j].x, planets[j].y);
          ctx.stroke();
        }
      }

      // Draw evidence stars around planets
      for (const star of evidenceStars) {
        const planet = planets.find((p) => p.id === star.planetId);
        if (!planet) continue;
        const sx = planet.x + Math.cos(star.angle + time * 0.005) * star.distance;
        const sy = planet.y + Math.sin(star.angle + time * 0.005) * star.distance * 0.7;
        const tw = Math.sin(time * star.twinkleSpeed + star.angle) * 0.4 + 0.6;
        const alpha = star.brightness * tw;

        const color = star.isConflict ? '#ef4444' : '#22d3ee';
        ctx.beginPath();
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.fill();

        // glow
        const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, star.size * 4);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(sx, sy, star.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.globalAlpha = alpha * 0.2;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw central investigation core
      const corePulse = Math.sin(time * 0.03) * 0.15 + 0.85;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
      coreGrad.addColorStop(0, `rgba(34, 211, 238, ${0.4 * corePulse})`);
      coreGrad.addColorStop(0.5, `rgba(79, 109, 245, ${0.15 * corePulse})`);
      coreGrad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Core ring
      ctx.strokeStyle = `rgba(34, 211, 238, ${0.3 * corePulse})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.stroke();

      // Core center
      ctx.fillStyle = '#22d3ee';
      ctx.globalAlpha = corePulse;
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Draw planets
      for (const planet of planets) {
        // Glow
        const glowGrad = ctx.createRadialGradient(planet.x, planet.y, 0, planet.x, planet.y, planet.radius * 1.8);
        glowGrad.addColorStop(0, planet.color + '30');
        glowGrad.addColorStop(0.5, planet.color + '10');
        glowGrad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // Planet body
        const bodyGrad = ctx.createRadialGradient(
          planet.x - planet.radius * 0.3,
          planet.y - planet.radius * 0.3,
          0,
          planet.x,
          planet.y,
          planet.radius
        );
        bodyGrad.addColorStop(0, planet.color + '60');
        bodyGrad.addColorStop(0.6, planet.color + '30');
        bodyGrad.addColorStop(1, planet.color + '10');
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        ctx.fillStyle = bodyGrad;
        ctx.fill();

        // Ring
        ctx.strokeStyle = planet.color + '40';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Small orbit ring around planet
        ctx.strokeStyle = planet.color + '15';
        ctx.beginPath();
        ctx.ellipse(planet.x, planet.y, planet.radius * 1.5, planet.radius * 0.4, time * 0.002, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Update and draw particles
      particles = particles.filter((p) => p.life < p.maxLife);
      for (const p of particles) {
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        const alpha = (1 - p.life / p.maxLife) * 0.4;
        ctx.fillStyle = '#22d3ee';
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Spawn particles near center
      if (time % 8 === 0) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 15 + Math.random() * 10;
        spawnParticle(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist);
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();

    const handleResize = () => {
      resize();
      init();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
      }}
    />
  );
}
